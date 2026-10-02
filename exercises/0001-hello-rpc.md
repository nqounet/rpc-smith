# 0001 - Hello RPC

目的: 最小の JSON‑RPC 2.0 リクエスト/レスポンスを実装して動作確認する（超入門）。

要求: メソッド `hello` を実装し、呼ばれたら文字列 `"Hello, world!"` を返す。

例:

リクエスト:
```
{"jsonrpc":"2.0","method":"hello","id":1}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":"Hello, world!","id":1}
```

難易度: 超入門

ヒント:
- `jsonrpc` フィールドは必ず `"2.0"` にする。
- レスポンスはリクエストの `id` をそのまま返す。

検証（curl 例）:
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"hello","id":1}' \
  http://localhost:4000/rpc
```

## テスト仕様

- リクエスト（期待）:
```
{"jsonrpc":"2.0","method":"hello","id":1}
```
- 期待レスポンス（厳密）:
```
{"jsonrpc":"2.0","result":"Hello, world!","id":1}
```
- 自動検証のヒント: `curl` で POST した結果を `jq` でパースして `result` が `"Hello, world!"` であることを確認する。

## テスト仕様（構造マッチ）

- 検証方針: レスポンス JSON の「構造」が期待に沿うことを確認します。厳密な文字列一致ではなく、必須フィールドと型・値をチェックします。
- 必須条件:
  - `.jsonrpc` が文字列 `"2.0"`
  - レスポンスに `result` フィールドが存在し、その値が文字列 `"Hello, world!"`
  - レスポンスの `id` がリクエストと同じ値（`1`）であること

- jq による例（成功時は exit 0）:
```
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"hello","id":1}' \
  http://localhost:4000/rpc | jq -e '.jsonrpc=="2.0" and .id==1 and (.result=="Hello, world!")'
```

※ テストランナーは上記のような構造チェックを行って合否判定してください。

