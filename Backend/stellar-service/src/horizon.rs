use reqwest::Client;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    error::AppError,
    models::{AccountResponse, Balance, OrderBookResponse, PriceLevel},
};

pub struct HorizonClient {
    client: Client,
    base_url: String,
}

// Internal Horizon response shapes ────────────────────────────────────────────

#[derive(Deserialize)]
struct HorizonAccount {
    id: String,
    sequence: String,
    subentry_count: u32,
    balances: Vec<Balance>,
}

#[derive(Deserialize)]
struct HorizonOrderBook {
    bids: Vec<PriceLevel>,
    asks: Vec<PriceLevel>,
}

#[derive(Deserialize)]
struct HorizonSubmitResponse {
    hash: Option<String>,
    ledger: Option<u64>,
    extras: Option<Value>,
}

// ─────────────────────────────────────────────────────────────────────────────

impl HorizonClient {
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
        }
    }

    pub async fn get_account(&self, public_key: &str) -> Result<AccountResponse, AppError> {
        let url = format!("{}/accounts/{}", self.base_url, public_key);
        let resp = self.client.get(&url).send().await?;

        if !resp.status().is_success() {
            let body = resp.text().await.unwrap_or_default();
            return Err(AppError::HorizonError(format!(
                "Account lookup failed: {}",
                body
            )));
        }

        let account: HorizonAccount = resp.json().await?;
        Ok(AccountResponse {
            account_id: account.id,
            sequence: account.sequence,
            balances: account.balances,
            subentry_count: account.subentry_count,
        })
    }

    pub async fn get_sequence_number(&self, public_key: &str) -> Result<i64, AppError> {
        let url = format!("{}/accounts/{}", self.base_url, public_key);
        let resp = self.client.get(&url).send().await?;

        if !resp.status().is_success() {
            return Err(AppError::HorizonError(
                "Account not found or not funded".to_string(),
            ));
        }

        let account: HorizonAccount = resp.json().await?;
        account
            .sequence
            .parse::<i64>()
            .map_err(|_| AppError::HorizonError("Unparseable sequence number".to_string()))
    }

    pub async fn submit_transaction(
        &self,
        tx_xdr: &str,
    ) -> Result<(String, Option<u64>), AppError> {
        let url = format!("{}/transactions", self.base_url);
        let resp = self
            .client
            .post(&url)
            .form(&[("tx", tx_xdr)])
            .send()
            .await?;

        let body: HorizonSubmitResponse = resp.json().await?;

        match body.hash {
            Some(hash) => Ok((hash, body.ledger)),
            None => {
                let detail = body
                    .extras
                    .and_then(|e| e.get("result_codes").cloned())
                    .map(|v| v.to_string())
                    .unwrap_or_else(|| "unknown error".to_string());
                Err(AppError::HorizonError(format!(
                    "Transaction rejected: {}",
                    detail
                )))
            }
        }
    }

    pub async fn get_order_book(
        &self,
        selling_type: &str,
        selling_code: Option<&str>,
        selling_issuer: Option<&str>,
        buying_type: &str,
        buying_code: Option<&str>,
        buying_issuer: Option<&str>,
    ) -> Result<OrderBookResponse, AppError> {
        let mut url = format!(
            "{}/order_book?selling_asset_type={}&buying_asset_type={}",
            self.base_url, selling_type, buying_type
        );

        if let (Some(code), Some(issuer)) = (selling_code, selling_issuer) {
            url.push_str(&format!(
                "&selling_asset_code={}&selling_asset_issuer={}",
                code, issuer
            ));
        }
        if let (Some(code), Some(issuer)) = (buying_code, buying_issuer) {
            url.push_str(&format!(
                "&buying_asset_code={}&buying_asset_issuer={}",
                code, issuer
            ));
        }

        let resp = self.client.get(&url).send().await?;
        let book: HorizonOrderBook = resp.json().await?;

        Ok(OrderBookResponse {
            bids: book.bids,
            asks: book.asks,
        })
    }
}
