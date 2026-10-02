# JSON-RPC Exercises — Node.js (v1)

This variant provides a minimal JSON-RPC 2.0 HTTP server and a test script exercising the beginner exercises.

How to run

1. Install dependencies:

```bash
cd implementations/nodejs/0001-jsonrpc-exercises/solutions/v1
npm install
```

2. Start server:

```bash
npm start
```

3. Run tests (runs server briefly and sends example requests):

```bash
npm test
```

What is included

- `src/server.js`: Minimal Express-based JSON-RPC 2.0 HTTP server implementing the beginner exercises (hello, echo, sum, subtract, notify_log, divide/errors, batch, id null, set/get).
- `tests/run.sh`: Curl-based script demonstrating requests/responses.
- `meta.yml`: Variant metadata used by `implementations/` conventions.
