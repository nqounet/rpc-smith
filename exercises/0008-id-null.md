# 0008 - ID Types and Null ID

目的: `id` フィールドは文字列・数値・`null` のいずれかを取り得ることを確認し、サーバーがそのまま `id` をエコーすることを学ぶ。

例（null id）:
```
{"jsonrpc":"2.0","method":"status","id":null}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":"ok","id":null}
```

難易度: 入門

ヒント:
- `id` を内部で数値や文字列に勝手に変換しないこと。`null` は有効な ID 値として扱う。

## テスト仕様

- リクエスト（null id）:
```
{"jsonrpc":"2.0","method":"status","id":null}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":"ok","id":null}
```

