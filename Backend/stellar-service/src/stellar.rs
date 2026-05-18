use base64::{engine::general_purpose::STANDARD, Engine};
use ed25519_dalek::{Signer, SigningKey};
use sha2::{Digest, Sha256};
use stellar_strkey::ed25519::{PrivateKey as StrPrivateKey, PublicKey as StrPublicKey};
use stellar_xdr::curr::{
    AccountId, Asset, AssetAlphaNum12, AssetAlphaNum4, AssetCode12, AssetCode4, BytesM,
    ChangeTrustAsset, ChangeTrustOp, DecoratedSignature, Limits, ManageSellOfferOp, Memo,
    MuxedAccount, Operation, OperationBody, PaymentOp, Preconditions, Price, PublicKey,
    Signature, SignatureHint, Transaction, TransactionEnvelope, TransactionExt,
    TransactionV1Envelope, Uint256, VecM, WriteXdr,
};

use crate::error::AppError;

// ── Key helpers ───────────────────────────────────────────────────────────────

fn parse_secret(secret: &str) -> Result<SigningKey, AppError> {
    let sk = StrPrivateKey::from_string(secret)
        .map_err(|e| AppError::InvalidKey(format!("Bad secret key: {e}")))?;
    Ok(SigningKey::from_bytes(&sk.0))
}

fn parse_public_bytes(public_key: &str) -> Result<[u8; 32], AppError> {
    let pk = StrPublicKey::from_string(public_key)
        .map_err(|e| AppError::InvalidKey(format!("Bad public key: {e}")))?;
    Ok(pk.0)
}

fn muxed(bytes: [u8; 32]) -> MuxedAccount {
    MuxedAccount::Ed25519(Uint256(bytes))
}

fn account_id(bytes: [u8; 32]) -> AccountId {
    AccountId(PublicKey::PublicKeyTypeEd25519(Uint256(bytes)))
}

/// Returns the G... public key string derived from a secret key.
pub fn public_key_from_secret(secret: &str) -> Result<String, AppError> {
    let signing_key = parse_secret(secret)?;
    let pub_bytes = signing_key.verifying_key().to_bytes();
    Ok(StrPublicKey(pub_bytes).to_string())
}

// ── Asset parser ──────────────────────────────────────────────────────────────

/// Parses "native" / "XLM" → `Asset::Native`
/// and "<CODE>:<ISSUER_G...>" → `Asset::CreditAlphanum4/12`.
pub fn parse_asset(s: &str) -> Result<Asset, AppError> {
    if s.eq_ignore_ascii_case("native") || s.eq_ignore_ascii_case("xlm") {
        return Ok(Asset::Native);
    }

    let (code_str, issuer_str) = s.split_once(':').ok_or_else(|| {
        AppError::InvalidKey(format!(
            "Invalid asset '{}'. Use 'native' or '<CODE>:<ISSUER>'",
            s
        ))
    })?;

    let issuer = account_id(parse_public_bytes(issuer_str)?);

    match code_str.len() {
        1..=4 => {
            let mut code = [0u8; 4];
            code[..code_str.len()].copy_from_slice(code_str.as_bytes());
            Ok(Asset::CreditAlphanum4(AssetAlphaNum4 {
                asset_code: AssetCode4(code),
                issuer,
            }))
        }
        5..=12 => {
            let mut code = [0u8; 12];
            code[..code_str.len()].copy_from_slice(code_str.as_bytes());
            Ok(Asset::CreditAlphanum12(AssetAlphaNum12 {
                asset_code: AssetCode12(code),
                issuer,
            }))
        }
        _ => Err(AppError::InvalidKey(format!(
            "Asset code '{}' exceeds 12 characters",
            code_str
        ))),
    }
}

// ── Amount / price helpers ────────────────────────────────────────────────────

fn to_stroops(amount: &str) -> Result<i64, AppError> {
    let v: f64 = amount
        .parse()
        .map_err(|_| AppError::InvalidKey(format!("Invalid amount '{}'", amount)))?;
    if v <= 0.0 {
        return Err(AppError::InvalidKey("Amount must be positive".into()));
    }
    Ok((v * 10_000_000.0).round() as i64)
}

fn to_price(price_str: &str) -> Result<Price, AppError> {
    let v: f64 = price_str
        .parse()
        .map_err(|_| AppError::InvalidKey(format!("Invalid price '{}'", price_str)))?;
    if v <= 0.0 {
        return Err(AppError::InvalidKey("Price must be positive".into()));
    }
    // Approximate as n/d with d = 10_000_000 then reduce with GCD
    const DENOM: i64 = 10_000_000;
    let n = (v * DENOM as f64).round() as i64;
    let g = gcd(n.unsigned_abs(), DENOM as u64) as i64;
    Ok(Price {
        n: (n / g) as i32,
        d: (DENOM / g) as i32,
    })
}

fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

// ── Signing ───────────────────────────────────────────────────────────────────

fn sign(
    tx: &Transaction,
    signing_key: &SigningKey,
    network_passphrase: &str,
) -> Result<DecoratedSignature, AppError> {
    // hash = SHA256( SHA256(network_passphrase) || uint32(ENVELOPE_TYPE_TX=2) || XDR(tx) )
    let tx_xdr = tx
        .to_xdr(Limits::none())
        .map_err(|e| AppError::SerializationError(e.to_string()))?;

    let network_hash = Sha256::digest(network_passphrase.as_bytes());
    let mut h = Sha256::new();
    h.update(&network_hash);
    h.update([0u8, 0u8, 0u8, 2u8]); // ENVELOPE_TYPE_TX
    h.update(&tx_xdr);
    let hash = h.finalize();

    let sig = signing_key.sign(&hash);
    let sig_bytes: Vec<u8> = sig.to_bytes().to_vec();

    let pub_bytes = signing_key.verifying_key().to_bytes();
    let hint = SignatureHint([pub_bytes[0], pub_bytes[1], pub_bytes[2], pub_bytes[3]]);
    let signature = Signature(
        BytesM::<64>::try_from(sig_bytes)
            .map_err(|_| AppError::SerializationError("Signature encoding failed".into()))?,
    );

    Ok(DecoratedSignature { hint, signature })
}

fn to_base64_envelope(
    tx: Transaction,
    sigs: Vec<DecoratedSignature>,
) -> Result<String, AppError> {
    let sigs: VecM<DecoratedSignature, 20> = sigs
        .try_into()
        .map_err(|_| AppError::SerializationError("Too many signatures".into()))?;

    let envelope = TransactionEnvelope::Tx(TransactionV1Envelope {
        tx,
        signatures: sigs,
    });

    envelope
        .to_xdr_base64(Limits::none())
        .map_err(|e| AppError::SerializationError(e.to_string()))
}

// ── Public transaction builders ───────────────────────────────────────────────

pub fn build_payment(
    secret: &str,
    destination: &str,
    amount: &str,
    asset_str: &str,
    memo_text: Option<&str>,
    sequence: i64,
    network_passphrase: &str,
) -> Result<String, AppError> {
    let signing_key = parse_secret(secret)?;
    let source_pub = signing_key.verifying_key().to_bytes();
    let dest_pub = parse_public_bytes(destination)?;

    let memo = match memo_text {
        Some(text) => Memo::Text(
            text.as_bytes()
                .to_vec()
                .try_into()
                .map_err(|_| AppError::InvalidKey("Memo exceeds 28 bytes".into()))?,
        ),
        None => Memo::None,
    };

    let tx = Transaction {
        source_account: muxed(source_pub),
        fee: 100,
        seq_num: sequence + 1,
        cond: Preconditions::None,
        memo,
        operations: vec![Operation {
            source_account: None,
            body: OperationBody::Payment(PaymentOp {
                destination: muxed(dest_pub),
                asset: parse_asset(asset_str)?,
                amount: to_stroops(amount)?,
            }),
        }]
        .try_into()
        .map_err(|_| AppError::TransactionError("Operation list overflow".into()))?,
        ext: TransactionExt::V0,
    };

    let sig = sign(&tx, &signing_key, network_passphrase)?;
    to_base64_envelope(tx, vec![sig])
}

pub fn build_trustline(
    secret: &str,
    asset_str: &str,
    limit: Option<&str>,
    sequence: i64,
    network_passphrase: &str,
) -> Result<String, AppError> {
    let signing_key = parse_secret(secret)?;
    let source_pub = signing_key.verifying_key().to_bytes();

    let trust_asset = match parse_asset(asset_str)? {
        Asset::CreditAlphanum4(a) => ChangeTrustAsset::CreditAlphanum4(a),
        Asset::CreditAlphanum12(a) => ChangeTrustAsset::CreditAlphanum12(a),
        Asset::Native => {
            return Err(AppError::InvalidKey(
                "Cannot create a trustline for native XLM".into(),
            ))
        }
    };

    let trust_limit = match limit {
        Some(l) => to_stroops(l)?,
        None => i64::MAX,
    };

    let tx = Transaction {
        source_account: muxed(source_pub),
        fee: 100,
        seq_num: sequence + 1,
        cond: Preconditions::None,
        memo: Memo::None,
        operations: vec![Operation {
            source_account: None,
            body: OperationBody::ChangeTrust(ChangeTrustOp {
                line: trust_asset,
                limit: trust_limit,
            }),
        }]
        .try_into()
        .map_err(|_| AppError::TransactionError("Operation list overflow".into()))?,
        ext: TransactionExt::V0,
    };

    let sig = sign(&tx, &signing_key, network_passphrase)?;
    to_base64_envelope(tx, vec![sig])
}

/// Places a sell offer on the Stellar DEX.
/// To purchase shares with XLM: set `selling = "native"`, `buying = "SHARE:G..."`.
pub fn build_trade(
    secret: &str,
    selling_str: &str,
    buying_str: &str,
    amount: &str,
    price_str: &str,
    sequence: i64,
    network_passphrase: &str,
) -> Result<String, AppError> {
    let signing_key = parse_secret(secret)?;
    let source_pub = signing_key.verifying_key().to_bytes();

    let tx = Transaction {
        source_account: muxed(source_pub),
        fee: 100,
        seq_num: sequence + 1,
        cond: Preconditions::None,
        memo: Memo::None,
        operations: vec![Operation {
            source_account: None,
            body: OperationBody::ManageSellOffer(ManageSellOfferOp {
                selling: parse_asset(selling_str)?,
                buying: parse_asset(buying_str)?,
                amount: to_stroops(amount)?,
                price: to_price(price_str)?,
                offer_id: 0, // 0 = create a new offer
            }),
        }]
        .try_into()
        .map_err(|_| AppError::TransactionError("Operation list overflow".into()))?,
        ext: TransactionExt::V0,
    };

    let sig = sign(&tx, &signing_key, network_passphrase)?;
    to_base64_envelope(tx, vec![sig])
}
