#!/bin/bash

echo "Starting backend..."
docker compose -f Backend/docker-compose.yml up -d

cd frontend || exit

echo "Checking dependencies..."

if pnpm install --frozen-lockfile > /dev/null 2>&1; then
  echo "Dependencies are up-to-date ✅"
else
  echo "Dependencies outdated or missing → installing..."
  
  if curl -s https://registry.npmjs.org > /dev/null; then
    pnpm install
  else
    echo "No internet → cannot install, continuing anyway"
  fi
fi

echo "Starting frontend..."
pnpm run dev