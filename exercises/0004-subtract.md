# 0004 - Subtract

目的: 名前付きパラメータ（`minuend`, `subtrahend`）を受け取り差分を返す `subtract` を実装する。`subtrahend` が無い場合は 0 を使うデフォルト動作を示す。

例:
```
{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10,"subtrahend":3},"id":4}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":7,"id":4}
```

例（subtrahend 省略）:
```
{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10},"id":5}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":10,"id":5}
```

難易度: 入門

ヒント:
- 名前付き params の取り扱いを学ぶ。欠損パラメータに対するデフォルト値を定義する。
- 型チェックを行い、不正なら `-32602` でエラーを返す。

## テスト仕様

- 正常リクエスト:
```
{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10,"subtrahend":3},"id":4}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":7,"id":4}
```
- subtrahend 省略時リクエスト:
```
{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10},"id":5}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":10,"id":5}
```
- 型エラー時期待レスポンス（例）:
```
{"jsonrpc":"2.0","error":{"code":-32602,"message":"Invalid params: numbers required"},"id":4}
```

## テスト仕様（構造マッチ）

- 正常系必須条件:
	- `.jsonrpc` == `"2.0"`
	- `.result` が数値で期待値（例: `7` / `10`）と一致
	- `.id` がリクエストの id と一致

- 型エラー必須条件:
	- レスポンスに `error` が存在
	- `error.code` が `-32602`（または同等の invalid params コード）である
	- `id` をエコーしている

- jq による例（subtrahend 省略）:
```
curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"subtract","params":{"minuend":10},"id":5}' http://localhost:4000/rpc | jq -e '.jsonrpc=="2.0" and .result==10 and .id==5'
```


