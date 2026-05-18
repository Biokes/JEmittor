mod config;
mod error;
mod handlers;
mod horizon;
mod models;
mod stellar;

use std::sync::Arc;

use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use config::Config;
use handlers::AppState;
use horizon::HorizonClient;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::new(
                std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
            ),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = Config::from_env();

    let state = Arc::new(AppState {
        horizon: HorizonClient::new(config.horizon_url.clone()),
        network_passphrase: config.network_passphrase.clone(),
    });

    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        // Account info
        .route("/api/accounts/{public_key}", get(handlers::get_account))
        // Payments — XLM or any Stellar asset
        .route("/api/payments", post(handlers::send_payment))
        // Trustlines — required before holding a custom asset / share token
        .route("/api/trustlines", post(handlers::add_trustline))
        // DEX trading — buy/sell on the Stellar order book
        .route("/api/trades", post(handlers::place_trade))
        // Order book — view open bids and asks for an asset pair
        .route("/api/orderbook", get(handlers::get_order_book))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!("stellar-service listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
