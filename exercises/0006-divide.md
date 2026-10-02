# 0006 - Divide (エラー処理を含む)

目的: 割り算を行う `divide` メソッドを実装し、パラメータ検証とエラー応答（0 除算など）を扱う方法を学ぶ。

例（正常）:
```
{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":2},"id":6}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":5,"id":6}
```

例（0 除算）:
```
{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":0},"id":7}
```

期待エラー応答（例）:
```
{"jsonrpc":"2.0","error":{"code":-32000,"message":"Division by zero"},"id":7}
```

難易度: 入門

ヒント:
- パラメータの存在と型を検証する（数値であること）。
- JSON‑RPC 標準のエラーコード（例: `-32602`）やアプリケーション固有の `-32000`〜の範囲を使い分ける。

## テスト仕様

- 正常リクエスト:
```
{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":2},"id":6}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":5,"id":6}
```
- 0 除算リクエスト:
```
{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":0},"id":7}
```
- 期待エラー（例）:
```
{"jsonrpc":"2.0","error":{"code":-32000,"message":"Division by zero"},"id":7}
```

## テスト仕様（構造マッチ）

- 正常系必須条件:
	- `.jsonrpc` == `"2.0"`
	- `.result` が数値であること（例: 5）
	- `.id` をエコーしていること

- 0 除算エラー必須条件:
	- レスポンスに `error` オブジェクトが存在すること
	- `error.code` が `-32000`（アプリケーションエラーの例）や適切なエラーコードであること
	- `error.message` に `Division` 等の説明が含まれていること（部分一致可）
	- `.id` はリクエストの `id`（ここでは `7`）を保持していること

- jq による部分一致例（エラーチェック）:
```
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"divide","params":{"dividend":10,"divisor":0},"id":7}' http://localhost:4000/rpc | jq -e '.error and (.id==7)'
```


