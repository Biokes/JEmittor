# JEmittor

A real-time market alert and automation platform for crypto and FX assets. Define conditional rules, get notified the instant they fire, and connect automated workflows — all through a single, unified interface.

Built to monitor on-chain and off-chain asset streams with sub-millisecond precision, with native support for the Stellar network alongside traditional crypto markets.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Stack](#running-the-stack)
- [API Reference](#api-reference)
- [Stellar Integration](#stellar-integration)
  - [How It Works](#how-it-works)
  - [Key Concepts](#key-concepts)
  - [Share Tokens on Stellar](#share-tokens-on-stellar)
  - [Transaction Lifecycle](#transaction-lifecycle)
  - [Testnet Development Workflow](#testnet-development-workflow)
  - [Security Model](#security-model)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)

---

## Overview

JEmittor lets users define rules against live market data streams:

```
if (asset.price < 58000)
  trigger "SMS_ALERT"

on volume_spike(percent: 15)
  trigger "WEBHOOK"
```

When a rule fires, the platform dispatches the configured notification or webhook in real time. Supported alert types include price thresholds, volume spikes, scheduled summaries, and emergency SMS.

Asset coverage spans major blockchain networks — including the Stellar network — as well as traditional FX pairs.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│                    localhost:3000                            │
└────────────────────────┬────────────────────────────────────┘
                         │  OpenID Connect (Authorization Code)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Keycloak  :8001                           │
│              Identity Provider / Auth Server                 │
│         (Custom build with Kafka Event Listener)            │
└────────┬──────────────────────────────┬─────────────────────┘
         │ user events → Kafka           │ JWT validation
         ▼                               ▼
┌────────────────┐            ┌──────────────────────────────┐
│  Apache Kafka  │            │   User Service  :8081        │
│  :9092         │──────────▶ │   (Spring Boot, DDD layout)  │
│  KRaft mode    │            │   Keycloak consumer          │
└────────────────┘            └──────────────┬───────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │   PostgreSQL (user data)   │
                               │   jemittor_user_service    │
                               └───────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Stellar Service  :8082  (Rust / Axum)          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Payments · Trustlines · DEX Trades · Order Book     │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             │ HTTPS                          │
└─────────────────────────────┼───────────────────────────────┘
                              ▼
             ┌────────────────────────────────┐
             │  Horizon API (Stellar network) │
             │  testnet / mainnet             │
             └────────────────────────────────┘

┌─────────────────────────────┐
│   PostgreSQL (Keycloak DB)  │
│   jemittor_keycloak_db      │
└─────────────────────────────┘
```

All services run inside a shared Docker network (`keycloak_net`). Keycloak emits user registration and login events to a Kafka topic (`keycloak-user-events`), which the User Service consumes to keep its own profile store in sync. The Stellar Service is stateless — it builds, signs, and submits transactions directly to the Stellar Horizon API.

---

## Services

| Service | Port | Description |
|---|---|---|
| `frontend` | `3000` | Next.js 16 UI — landing page, login/register via Keycloak OIDC |
| `keycloak` | `8001` | Keycloak 26 with Kafka event-listener plugin baked in |
| `user-service` | `8081` | Spring Boot 4 microservice — user profiles, JWT-protected REST API |
| `stellar-service` | `8082` | Rust / Axum microservice — Stellar payments, trustlines, DEX trading |
| `kafka` | `9092` | Apache Kafka in KRaft mode (no Zookeeper) |
| `kafka-ui` | `8002` | Kafka UI for inspecting topics and messages |
| `postgres` | `5432` | PostgreSQL 16 — Keycloak database |
| `postgres_user` | `5432` | PostgreSQL 16 — User Service database |

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- Java 21 (only needed for local development outside Docker)
- [Rust](https://www.rust-lang.org/tools/install) 1.78+ (only needed for local development outside Docker)

### Environment Variables

Create a `.env` file in the `Backend/` directory before starting the stack. All required variables are listed below — see the [Placeholders](#placeholders) section for the full reference.

```env
# Keycloak database
KEYCLOAK_POSTGRES_DB=<your-keycloak-db-name>
KEYCLOAK_POSTGRES_USER=<your-keycloak-db-user>
KEYCLOAK_POSTGRES_PASSWORD=<your-keycloak-db-password>

# Keycloak admin credentials
KEYCLOAK_ADMIN=<your-keycloak-admin-username>
KEYCLOAK_ADMIN_PASSWORD=<your-keycloak-admin-password>

# User Service database
UserService_DB_USER=<your-user-service-db-user>
UserService_DB_PASSWORD=<your-user-service-db-password>

# Stellar Service (optional overrides — defaults to Stellar testnet)
# STELLAR_NETWORK=testnet            # or mainnet
# HORIZON_URL=https://horizon-testnet.stellar.org
# NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

### Running the Stack

**One-command start (backend + frontend):**

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

The script starts the Docker Compose stack (detached) and then runs the Next.js dev server.

**Backend only:**

```bash
docker compose -f Backend/docker-compose.yml up -d
```

**Frontend only:**

```bash
cd frontend
pnpm install
pnpm dev
```

### Post-startup: Keycloak Configuration

After first boot, configure the `Jemittor` realm in Keycloak (`http://localhost:8001`):

1. Log in with your admin credentials.
2. Create a new realm named **`Jemittor`**.
3. Create a client named **`jemittor-frontend`** with:
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:3000/*`
4. (Optional) Create a client named **`jemittor-user-service`** if adding service-level auth.

---

## API Reference

### User Service — `localhost:8081`

All endpoints require a valid Bearer JWT issued by Keycloak.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/User/me` | Returns the authenticated user's profile by email claim from JWT |

### Auth Service (legacy) — `localhost:8081`

> This module (`auths/`) reflects an earlier OAuth2 login flow using Google OAuth. It is retained in the repository but superseded by the Keycloak-based flow.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/auth/` | Returns email of the authenticated OAuth2 user |
| `POST` | `/api/v1/auth/logout` | Invalidates the current session |

### Stellar Service — `localhost:8082`

All requests are unauthenticated at the transport layer — callers supply their own Stellar secret key per request. **Never expose this service to the public internet.** Keep it internal to the Docker network and proxy calls through the authenticated user-service.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts/:public_key` | Balances and sequence number for a Stellar account |
| `POST` | `/api/payments` | Send XLM or any Stellar asset to another account |
| `POST` | `/api/trustlines` | Add a trustline so an account can hold a custom asset or share token |
| `POST` | `/api/trades` | Place a sell offer on the Stellar DEX (set `selling=native`, `buying=TOKEN:ISSUER` to purchase shares with XLM) |
| `GET` | `/api/orderbook?selling=...&buying=...` | View the current bids and asks for an asset pair |
| `GET` | `/health` | Liveness check |

**Payment request body:**
```json
{
  "secret_key": "S...",
  "destination": "G...",
  "amount": "10.5",
  "asset": "native",
  "memo": "optional text"
}
```

**Trade / share purchase request body:**
```json
{
  "secret_key": "S...",
  "selling": "native",
  "buying": "JDROP:G<ISSUER_PUBLIC_KEY>",
  "amount": "50",
  "price": "1.25"
}
```

**Trustline request body:**
```json
{
  "secret_key": "S...",
  "asset": "JDROP:G<ISSUER_PUBLIC_KEY>",
  "limit": "10000"
}
```

Asset format reference:
- Native XLM: `"native"` or `"xlm"`
- Custom asset: `"<CODE>:<ISSUER_G...>"` — e.g. `"USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"`

---

## Stellar Integration

### How It Works

The `stellar-service` is a stateless Rust microservice that acts as a thin, type-safe bridge between the JEmittor backend and the Stellar blockchain. It does not hold any private keys at rest — callers pass a Stellar secret key with each request, the service builds and signs the XDR transaction in memory, submits it to the Horizon API, then discards the key. Nothing is persisted.

```
Caller (user-service)
  │
  │  POST /api/trades  { secret_key, selling, buying, amount, price }
  ▼
stellar-service
  ├─ parse + validate inputs
  ├─ fetch current sequence number  ──▶  Horizon GET /accounts/{G...}
  ├─ build Transaction XDR  (stellar-xdr crate)
  ├─ sign with Ed25519  (ed25519-dalek crate)
  │     hash = SHA256( SHA256(network_passphrase) || 0x00000002 || tx_xdr )
  │     signature = ed25519_sign(secret_key, hash)
  ├─ wrap in TransactionEnvelope XDR
  ├─ base64-encode envelope
  └─ POST /transactions  ──▶  Horizon
              │
              ▼
       Stellar Network
```

### Key Concepts

**Accounts**  
Every participant on Stellar has a keypair: a **public key** (`G...`, 56 chars, base32) and a **secret key** (`S...`, 56 chars, base32). Accounts must hold a minimum XLM balance (currently 1 XLM base reserve + 0.5 XLM per subentry). New testnet accounts can be funded via Friendbot:
```bash
curl https://friendbot.stellar.org?addr=G<YOUR_PUBLIC_KEY>
```

**Lumens (XLM)**  
The native asset of the Stellar network. Used to pay transaction fees (100 stroops = 0.00001 XLM per operation by default) and to satisfy minimum balance requirements. Specified as `"native"` in this API.

**Stroops**  
The smallest unit of XLM — 1 XLM = 10,000,000 stroops. All amounts are converted to stroops internally before building the XDR transaction.

**Custom Assets**  
Any account can issue a custom token on Stellar by setting a trustline on the recipient side and sending the asset. Assets are identified by a code (up to 12 characters) and an issuer public key:
```
USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
```

**Trustlines**  
Before an account can receive a custom asset it must explicitly opt in by establishing a trustline. This prevents spam and is a core security primitive on Stellar. The `POST /api/trustlines` endpoint handles this. **A trustline must be created before any trade or payment involving a non-native asset.**

**Stellar DEX**  
Stellar has a built-in decentralised exchange. Any account can place offers to trade one asset for another using `ManageSellOffer` or `ManageBuyOffer` operations. Offers sit in an on-chain order book and are matched automatically by the network. This is what powers the share-purchase flow.

**XDR (External Data Representation)**  
Stellar uses XDR for transaction serialization. The `stellar-xdr` Rust crate provides generated types directly from the Stellar XDR specification. The service builds a `Transaction` struct, serializes it to XDR bytes, hashes it, signs the hash, wraps everything in a `TransactionEnvelope`, and base64-encodes the result for submission to Horizon.

### Share Tokens on Stellar

On-chain share/equity tokens are issued as custom Stellar assets. The workflow is:

**Step 1 — Issue the asset**  
The platform operator creates an issuer account and sets appropriate flags (`AUTHORIZATION_REQUIRED`, `CLAWBACK_ENABLED`, etc.) depending on compliance requirements.

**Step 2 — Investor creates a trustline**  
Before an investor can hold or trade the share token, they must opt in:
```json
POST /api/trustlines
{
  "secret_key": "S<INVESTOR_SECRET>",
  "asset": "JDROP:G<ISSUER_PUBLIC_KEY>",
  "limit": "10000"
}
```

**Step 3 — Place a buy offer on the DEX**  
The investor places a buy offer: selling XLM, buying the share token.
```json
POST /api/trades
{
  "secret_key": "S<INVESTOR_SECRET>",
  "selling": "native",
  "buying":  "JDROP:G<ISSUER_PUBLIC_KEY>",
  "amount":  "100",
  "price":   "2.50"
}
```
This creates a `ManageSellOffer` on the Stellar order book: offering 100 XLM at 2.50 XLM per JDROP token. If a matching sell offer exists, the trade settles immediately on-chain.

**Step 4 — Verify holdings**  
```bash
GET /api/accounts/G<INVESTOR_PUBLIC_KEY>
```
The response includes a `balances` array. A line with `asset_code: "JDROP"` and the issuer confirms the trade settled.

**Offer management**  
Offers placed with `offer_id: 0` create new orders. To modify or cancel an existing offer, the caller must supply the `offer_id` returned by Horizon — this can be added as an optional field to `TradeRequest` in a future iteration.

### Transaction Lifecycle

The sequence from API call to confirmed ledger:

```
1. stellar-service fetches current sequence number  (Horizon)
2. stellar-service builds Transaction XDR:
     source_account  = derived from secret key
     fee             = 100 stroops (base fee)
     seq_num         = current_sequence + 1
     operation       = Payment | ChangeTrust | ManageSellOffer
3. Signing hash:
     network_id    = SHA256("Test SDF Network ; September 2015")
     signing_hash  = SHA256(network_id || 0x00000002 || raw_tx_xdr)
4. Ed25519 signature computed over signing_hash
5. DecoratedSignature { hint: pubkey[0..4], signature }
6. TransactionEnvelope XDR base64-encoded
7. Horizon POST /transactions → transaction propagates to the network
8. Network validates, applies to the next ledger (~5 second close time)
9. Horizon returns { hash, ledger } on success
```

Ledger close time on the Stellar network is approximately **3–5 seconds**, making on-chain settlement fast enough for interactive use cases.

### Testnet Development Workflow

All development should be done on Stellar testnet first. The service defaults to testnet when no environment override is provided.

**1. Create and fund a testnet account:**
```bash
# Generate a keypair with the Stellar Lab or any SDK, then fund via Friendbot
curl "https://friendbot.stellar.org?addr=G<YOUR_PUBLIC_KEY>"
```

**2. Start the stack:**
```bash
docker compose -f Backend/docker-compose.yml up stellar-service -d
```

**3. Check account balances:**
```bash
curl http://localhost:8082/api/accounts/G<YOUR_PUBLIC_KEY>
```

**4. Send a testnet XLM payment:**
```bash
curl -X POST http://localhost:8082/api/payments \
  -H 'Content-Type: application/json' \
  -d '{
    "secret_key": "S<SENDER_SECRET>",
    "destination": "G<RECIPIENT_PUBLIC_KEY>",
    "amount": "10",
    "asset": "native"
  }'
```

**5. View a submitted transaction:**  
Paste the returned `transaction_hash` into [Stellar Expert (testnet)](https://stellar.expert/explorer/testnet) or [Stellar Lab](https://laboratory.stellar.org) to inspect operations and effects.

**Switching to mainnet:**  
Set in `Backend/.env`:
```env
STELLAR_NETWORK=mainnet
```
The service will automatically use `https://horizon.stellar.org` and the public network passphrase. **Never test with real funds** — exhaust testnet testing before flipping this switch.

### Security Model

| Concern | Mitigation |
|---|---|
| Secret keys in transit | Use HTTPS / TLS in all non-local deployments; the service must never be public-facing |
| Secret keys at rest | The service holds no keys — they are used per-request and never logged or persisted |
| Sequence number races | Horizon rejects any transaction with a stale sequence number, providing natural replay protection |
| Fee bumps | Base fee of 100 stroops is hardcoded; increase `fee` in `stellar.rs` for high-traffic periods |
| Clawback / compliance | Issuers can enable `CLAWBACK_ENABLED` on share tokens for regulatory compliance — this is configured at the asset-issuer level, not in this service |
| Internal-only exposure | The service binds to `0.0.0.0:8082` but should sit behind the Docker internal network with no public port mapping in production |

---

## Project Structure

```
jemittor/
├── auths/                          # Legacy auth module (Google OAuth2, Spring Boot)
│   ├── config/SecurityConfig.java  # Spring Security filter chain
│   ├── controllers/Auth.java       # Login / logout endpoints
│   ├── logic/                      # User upsert logic
│   ├── middlewares/                # OAuth2 success handler
│   └── models/                     # User entity + ProfileType enum
│
├── Backend/
│   ├── docker-compose.yml          # Full infrastructure stack
│   ├── Dockerfile.keycloak         # Keycloak + Kafka event-listener plugin
│   ├── userService/                # Primary user microservice (Java)
│   │   ├── src/main/java/com/jemittor/userService/
│   │   │   ├── api/                # REST controllers
│   │   │   ├── application/        # Service interfaces + request DTOs
│   │   │   ├── domain/             # Entities, enums, repository interfaces
│   │   │   └── infrastructure/     # Kafka consumer
│   │   └── src/main/resources/
│   │       └── application.yaml    # App config (DB, Kafka, Keycloak issuer)
│   └── stellar-service/            # Stellar transaction microservice (Rust)
│       ├── Cargo.toml              # Crate manifest and dependencies
│       ├── Dockerfile              # Multi-stage Rust build
│       └── src/
│           ├── main.rs             # Axum server setup and route registration
│           ├── config.rs           # Environment-based config
│           ├── error.rs            # Unified error type with HTTP mapping
│           ├── horizon.rs          # Stellar Horizon REST API client
│           ├── stellar.rs          # XDR transaction building and Ed25519 signing
│           ├── handlers.rs         # Axum request handlers
│           └── models.rs           # Request / response DTOs
│
├── frontend/                       # Next.js 16 application
│   ├── app/                        # App Router pages
│   │   ├── page.tsx                # Landing page
│   │   └── home/page.tsx           # Authenticated home (stub)
│   └── components/
│       └── HomePage.tsx            # Dashboard component (features, alerts, stats)
│
└── scripts/
    └── start.sh                    # One-command startup script
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Auth | Keycloak 26 (OIDC / OAuth2), Spring Security |
| Backend (Java) | Spring Boot 4, Java 21, Lombok |
| Backend (Rust) | Axum 0.7, Tokio, stellar-xdr, ed25519-dalek, reqwest |
| Blockchain | Stellar Network (Horizon API, XDR transactions, DEX) |
| Messaging | Apache Kafka (KRaft) |
| Database | PostgreSQL 16, Spring Data JPA |
| Containerization | Docker, Docker Compose |
| Build | Maven 3.9, pnpm, Cargo |

---

## Placeholders

> Fill these in before running the project. All required variables go in a `.env` file inside `Backend/`.

**Required — must be set:**

| Variable | Used In | Description |
|---|---|---|
| `KEYCLOAK_POSTGRES_DB` | `docker-compose.yml` | Name of the PostgreSQL database for Keycloak |
| `KEYCLOAK_POSTGRES_USER` | `docker-compose.yml` | PostgreSQL username for the Keycloak database |
| `KEYCLOAK_POSTGRES_PASSWORD` | `docker-compose.yml` | PostgreSQL password for the Keycloak database |
| `KEYCLOAK_ADMIN` | `docker-compose.yml` | Keycloak bootstrap admin username |
| `KEYCLOAK_ADMIN_PASSWORD` | `docker-compose.yml` | Keycloak bootstrap admin password |
| `UserService_DB_USER` | `docker-compose.yml`, `application.yaml` | PostgreSQL username for the User Service database |
| `UserService_DB_PASSWORD` | `docker-compose.yml`, `application.yaml` | PostgreSQL password for the User Service database |

**Optional — Stellar Service (defaults to testnet if omitted):**

| Variable | Default | Description |
|---|---|---|
| `STELLAR_NETWORK` | `testnet` | Set to `mainnet` to use the public Stellar network |
| `HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon API base URL (ignored when `STELLAR_NETWORK=mainnet`) |
| `NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` | Stellar network passphrase used for transaction signing |

**Hardcoded values that may need updating for non-local deployments:**

| Value | Location | Description |
|---|---|---|
| `Jemittor` | `frontend/app/page.tsx`, `application.yaml` | Keycloak realm name |
| `jemittor-frontend` | `frontend/app/page.tsx` | Keycloak OIDC client ID used by the frontend |
| `http://localhost:8001` | `frontend/app/page.tsx`, `application.yaml` | Keycloak base URL |
| `http://localhost:3000/home` | `frontend/app/page.tsx` | OIDC redirect URI after login/register |
| `keycloak-user-events` | `docker-compose.yml`, `KafkaService.java` | Kafka topic for Keycloak user events |

