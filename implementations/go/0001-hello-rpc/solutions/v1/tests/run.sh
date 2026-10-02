#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

# start server
go run src/main.go &
PID=$!
trap 'kill "$PID" >/dev/null 2>&1 || true' EXIT
sleep 0.3

../../../../tools/tests/run_exercise_0001.sh http://localhost:4000/rpc

echo "Go exercise 0001 test passed"
