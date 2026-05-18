use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Horizon API error: {0}")]
    HorizonError(String),

    #[error("Invalid key or asset: {0}")]
    InvalidKey(String),

    #[error("Transaction build error: {0}")]
    TransactionError(String),

    #[error("HTTP error: {0}")]
    HttpError(#[from] reqwest::Error),

    #[error("Serialization error: {0}")]
    SerializationError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::InvalidKey(_) => (StatusCode::BAD_REQUEST, self.to_string()),
            AppError::HorizonError(_) => (StatusCode::BAD_GATEWAY, self.to_string()),
            AppError::TransactionError(_) => (StatusCode::UNPROCESSABLE_ENTITY, self.to_string()),
            AppError::HttpError(_) => (StatusCode::BAD_GATEWAY, self.to_string()),
            AppError::SerializationError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string())
            }
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}
