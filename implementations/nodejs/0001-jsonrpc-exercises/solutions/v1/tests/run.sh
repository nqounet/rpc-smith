#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

# start server in background
node src/server.js &
PID=$!
trap 'kill "$PID" >/dev/null 2>&1 || true' EXIT
sleep 0.3

echo "== hello =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"hello","id":1}' http://localhost:4000/rpc
echo -e "\n\n== echo (named) =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"echo","params":{"message":"hi"},"id":"a1"}' http://localhost:4000/rpc
echo -e "\n\n== echo (positional) =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"echo","params":["positional"],"id":2}' http://localhost:4000/rpc
echo -e "\n\n== sum =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"sum","params":[1,2,3],"id":3}' http://localhost:4000/rpc
echo -e "\n\n== subtract (default) =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10},"id":4}' http://localhost:4000/rpc
echo -e "\n\n== notify_log (notification) =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"notify_log","params":["started"]}' http://localhost:4000/rpc || true
echo -e "\n\n== divide by zero (error) =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":0},"id":5}' http://localhost:4000/rpc
echo -e "\n\n== batch (mix) =="
curl -s -X POST -H "Content-Type: application/json" -d '[{"jsonrpc":"2.0","method":"sum","params":[4,5],"id":6},{"jsonrpc":"2.0","method":"notify_log","params":["batch-notify"]},{"jsonrpc":"2.0","method":"subtract","params":{"minuend":20,"subtrahend":5},"id":7}]' http://localhost:4000/rpc
echo -e "\n\n== id null =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"status","id":null}' http://localhost:4000/rpc
echo -e "\n\n== set/get =="
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"set","params":{"key":"k","value":"v"},"id":8}' http://localhost:4000/rpc
echo
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"get","params":{"key":"k"},"id":9}' http://localhost:4000/rpc

echo -e "\n\nAll tests completed. Server PID: $PID"
