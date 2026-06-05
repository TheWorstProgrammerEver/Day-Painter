#!/usr/bin/env bash
set -euo pipefail

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert is required. Install it with: brew install mkcert nss"
  exit 1
fi

mkdir -p .certs
mkcert -install
mkcert \
  -cert-file .certs/day-painter.pem \
  -key-file .certs/day-painter-key.pem \
  localhost 127.0.0.1 ::1

echo "Local HTTPS certificates are ready."
echo "Run npm run dev and open https://localhost:5173/ or the port Vite prints."
