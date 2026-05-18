use std::env;

#[derive(Clone)]
pub struct Config {
    pub horizon_url: String,
    pub network_passphrase: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        let network = env::var("STELLAR_NETWORK").unwrap_or_else(|_| "testnet".to_string());

        let (horizon_url, network_passphrase) = match network.as_str() {
            "mainnet" => (
                "https://horizon.stellar.org".to_string(),
                "Public Global Stellar Network ; September 2015".to_string(),
            ),
            _ => (
                env::var("HORIZON_URL")
                    .unwrap_or_else(|_| "https://horizon-testnet.stellar.org".to_string()),
                env::var("NETWORK_PASSPHRASE")
                    .unwrap_or_else(|_| "Test SDF Network ; September 2015".to_string()),
            ),
        };

        Config {
            horizon_url,
            network_passphrase,
            port: env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8082),
        }
    }
}
