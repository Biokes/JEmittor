use std::{collections::HashMap, sync::Arc};

use axum::{
    extract::{Path, Query, State},
    Json,
};

use crate::{
    error::AppError,
    horizon::HorizonClient,
    models::{
        AccountResponse, OrderBookResponse, PaymentRequest, TradeRequest, TransactionResponse,
        TrustlineRequest,
    },
    stellar,
};

// ── Shared state ──────────────────────────────────────────────────────────────

pub struct AppState {
    pub horizon: HorizonClient,
    pub network_passphrase: String,
}

// ── Handlers ──────────────────────────────────────────────────────────────────

/// GET /api/accounts/:public_key
/// Returns account balances and sequence number.
pub async fn get_account(
    State(state): State<Arc<AppState>>,
    Path(public_key): Path<String>,
) -> Result<Json<AccountResponse>, AppError> {
    let account = state.horizon.get_account(&public_key).await?;
    Ok(Json(account))
}

/// POST /api/payments
/// Send XLM or any Stellar asset to another account.
pub async fn send_payment(
    State(state): State<Arc<AppState>>,
    Json(req): Json<PaymentRequest>,
) -> Result<Json<TransactionResponse>, AppError> {
    let public_key = stellar::public_key_from_secret(&req.secret_key)?;
    let sequence = state.horizon.get_sequence_number(&public_key).await?;

    let tx_xdr = stellar::build_payment(
        &req.secret_key,
        &req.destination,
        &req.amount,
        &req.asset,
        req.memo.as_deref(),
        sequence,
        &state.network_passphrase,
    )?;

    let (hash, ledger) = state.horizon.submit_transaction(&tx_xdr).await?;
    Ok(Json(TransactionResponse {
        success: true,
        transaction_hash: hash,
        ledger,
    }))
}

/// POST /api/trustlines
/// Add a trustline so the account can hold the specified asset.
/// Must be called before receiving any custom Stellar asset (e.g. a share token).
pub async fn add_trustline(
    State(state): State<Arc<AppState>>,
    Json(req): Json<TrustlineRequest>,
) -> Result<Json<TransactionResponse>, AppError> {
    let public_key = stellar::public_key_from_secret(&req.secret_key)?;
    let sequence = state.horizon.get_sequence_number(&public_key).await?;

    let tx_xdr = stellar::build_trustline(
        &req.secret_key,
        &req.asset,
        req.limit.as_deref(),
        sequence,
        &state.network_passphrase,
    )?;

    let (hash, ledger) = state.horizon.submit_transaction(&tx_xdr).await?;
    Ok(Json(TransactionResponse {
        success: true,
        transaction_hash: hash,
        ledger,
    }))
}

/// POST /api/trades
/// Place a sell offer on the Stellar DEX.
/// To buy a share token with XLM: set selling="native", buying="TOKEN:ISSUER".
/// To sell a share token for XLM: set selling="TOKEN:ISSUER", buying="native".
pub async fn place_trade(
    State(state): State<Arc<AppState>>,
    Json(req): Json<TradeRequest>,
) -> Result<Json<TransactionResponse>, AppError> {
    let public_key = stellar::public_key_from_secret(&req.secret_key)?;
    let sequence = state.horizon.get_sequence_number(&public_key).await?;

    let tx_xdr = stellar::build_trade(
        &req.secret_key,
        &req.selling,
        &req.buying,
        &req.amount,
        &req.price,
        sequence,
        &state.network_passphrase,
    )?;

    let (hash, ledger) = state.horizon.submit_transaction(&tx_xdr).await?;
    Ok(Json(TransactionResponse {
        success: true,
        transaction_hash: hash,
        ledger,
    }))
}

/// GET /api/orderbook?selling=native&buying=TOKEN:ISSUER
/// Returns the current bids and asks for an asset pair on the Stellar DEX.
pub async fn get_order_book(
    State(state): State<Arc<AppState>>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<OrderBookResponse>, AppError> {
    let selling = params
        .get("selling")
        .map(|s| s.as_str())
        .unwrap_or("native");
    let buying = params
        .get("buying")
        .ok_or_else(|| AppError::InvalidKey("Query param 'buying' is required".into()))?;

    let (st, sc, si) = asset_query_params(selling);
    let (bt, bc, bi) = asset_query_params(buying);

    let book = state
        .horizon
        .get_order_book(&st, sc.as_deref(), si.as_deref(), &bt, bc.as_deref(), bi.as_deref())
        .await?;

    Ok(Json(book))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

fn asset_query_params(asset: &str) -> (String, Option<String>, Option<String>) {
    if asset.eq_ignore_ascii_case("native") || asset.eq_ignore_ascii_case("xlm") {
        return ("native".into(), None, None);
    }
    match asset.split_once(':') {
        Some((code, issuer)) => {
            let asset_type = if code.len() <= 4 {
                "credit_alphanum4"
            } else {
                "credit_alphanum12"
            };
            (asset_type.into(), Some(code.into()), Some(issuer.into()))
        }
        None => ("native".into(), None, None),
    }
}
