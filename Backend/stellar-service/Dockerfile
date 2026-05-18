# Stage 1 — build
FROM rust:1.78-alpine AS builder

RUN apk add --no-cache musl-dev

WORKDIR /app

# Cache dependency compilation separately from source changes
COPY Cargo.toml ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Build the real source
COPY src ./src
RUN touch src/main.rs && cargo build --release

# Stage 2 — minimal runtime image
FROM alpine:3.19

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/target/release/stellar-service .

EXPOSE 8082

ENTRYPOINT ["./stellar-service"]
