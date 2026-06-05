#!/usr/bin/env bash
set -euo pipefail

if command -v mkcert >/dev/null 2>&1; then
  mkcert -uninstall
else
  echo "mkcert is not installed, skipping local CA uninstall."
fi

rm -rf .certs

echo "Local HTTPS certificates removed from this repo."
