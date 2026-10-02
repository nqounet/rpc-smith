#!/usr/bin/env bash
set -euo pipefail

# Usage: run_exercise_0001.sh [URL]
# Default URL: http://localhost:4000/rpc

URL=${1:-http://localhost:4000/rpc}

REQ='{"jsonrpc":"2.0","method":"hello","id":1}'

RESP=$(curl -s -X POST -H "Content-Type: application/json" -d "$REQ" "$URL")
echo "$RESP"

# Structure-match checks using jq
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for structure-match checks" >&2
  exit 2
fi

echo "$RESP" | jq -e '.jsonrpc=="2.0" and .id==1 and .result=="Hello, world!"'
