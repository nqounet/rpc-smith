# 0009 - Tiny Key-Value Store (stateful)

目的: `set` / `get` メソッドで簡単なインメモリのキー・バリューを実装し、状態を持つ RPC の扱い方を学ぶ。

例（set）:
```
{"jsonrpc":"2.0","method":"set","params":{"key":"k","value":"v"},"id":10}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":true,"id":10}
```

例（get）:
```
{"jsonrpc":"2.0","method":"get","params":{"key":"k"},"id":11}
```

期待レスポンス:
```
{"jsonrpc":"2.0","result":"v","id":11}
```

キーが無ければエラーを返す（例: `-32001` Key not found）。

難易度: 入門

ヒント:
- サーバー側に単純なオブジェクト（マップ）を持たせる。永続化は不要（セッション内のみ）。

## テスト仕様

- set リクエスト:
```
{"jsonrpc":"2.0","method":"set","params":{"key":"k","value":"v"},"id":10}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":true,"id":10}
```
- get リクエスト:
```
{"jsonrpc":"2.0","method":"get","params":{"key":"k"},"id":11}
```
- 期待レスポンス:
```
{"jsonrpc":"2.0","result":"v","id":11}
```
- キーが存在しない場合の期待エラー（例）:
```
{"jsonrpc":"2.0","error":{"code":-32001,"message":"Key not found","data":{"key":"missing"}},"id":12}
```

