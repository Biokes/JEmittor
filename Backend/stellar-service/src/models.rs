use serde::{Deserialize, Serialize};

// ── Requests ─────────────────────────────────────────────────────────────────

/// Send a payment of XLM or any Stellar asset.
#[derive(Debug, Deserialize)]
pub struct PaymentRequest {
    /// Sender's Stellar secret key (starts with S)
    pub secret_key: String,
    /// Recipient's Stellar public key (starts with G)
    pub destination: String,
    /// Decimal amount string e.g. "10.5"
    pub amount: String,
    /// "native" for XLM, or "<CODE>:<ISSUER_G...>" for any asset
    pub asset: String,
    /// Optional text memo (max 28 bytes)
    pub memo: Option<String>,
}

/// Establish a trustline so an account can hold a custom Stellar asset.
/// Must be done before receiving that asset.
#[derive(Debug, Deserialize)]
pub struct TrustlineRequest {
    /// Account that will trust the asset (secret key S...)
    pub secret_key: String,
    /// Asset in format "<CODE>:<ISSUER_G...>"
    pub asset: String,
    /// Maximum balance to trust. Omit for maximum allowed.
    pub limit: Option<String>,
}

/// Place an offer on the Stellar DEX.
/// To *buy* shares with XLM: set `selling = "native"`, `buying = "SHARE:G..."`.
/// To *sell* shares for XLM: set `selling = "SHARE:G..."`, `buying = "native"`.
#[derive(Debug, Deserialize)]
pub struct TradeRequest {
    /// Trader's secret key (S...)
    pub secret_key: String,
    /// Asset being offered — "native" or "<CODE>:<ISSUER>"
    pub selling: String,
    /// Asset being sought — "native" or "<CODE>:<ISSUER>"
    pub buying: String,
    /// Amount of the `selling` asset to place in the offer
    pub amount: String,
    /// Price expressed as units of `buying` per unit of `selling` (e.g. "1.50")
    pub price: String,
}

// ── Responses ────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub success: bool,
    pub transaction_hash: String,
    pub ledger: Option<u64>,
}

#[derive(Debug, Serialize)]
pub struct AccountResponse {
    pub account_id: String,
    pub sequence: String,
    pub balances: Vec<Balance>,
    pub subentry_count: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Balance {
    pub asset_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asset_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asset_issuer: Option<String>,
    pub balance: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct OrderBookResponse {
    pub bids: Vec<PriceLevel>,
    pub asks: Vec<PriceLevel>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PriceLevel {
    pub price: String,
    pub amount: String,
}
