# 0007 - Batch Requests

目的: バッチ（配列）で送られてくる複数のリクエストを処理する。通常の呼び出し、通知、無効なリクエストが混ざった場合の振る舞いを確認する。

例（クライアント送信）:
```
[
  {"jsonrpc":"2.0","method":"sum","params":[1,2],"id":8},
  {"jsonrpc":"2.0","method":"notify_log","params":["batch"]},
  {"jsonrpc":"2.0","method":"subtract","params":{"minuend":5,"subtrahend":2},"id":9}
]
```

期待動作:
- サーバーは `id` を持つリクエストに対してのみレスポンスの配列を返す（通知にはレスポンスなし）。
- 無効なリクエスト要素は個別のエラーオブジェクトで表現する。

難易度: 入門

ヒント:
- 空配列は無効（Invalid Request）。
- レスポンス配列に含めるべきかは各要素ごとに判定する。順序は必須ではないが対応しやすい順で返す。

## テスト仕様（構造マッチ）

- 検証方針: バッチレスポンスは JSON 配列で、`id` を持つリクエストに対するレスポンスのみを含むことを確認します。レスポンス配列の順序は実装依存とします。

- 必須条件:
  - HTTP レスポンスは JSON 配列であること（`type == "array"`）
  - 配列の各要素はオブジェクトで、`.jsonrpc` が `"2.0"` であること
  - 通知要素（リクエストに `id` がない要素）はレスポンス配列に含まれないこと
  - レスポンス配列内の要素の `id` 値は、送信した `id` の集合と一致する（順不同で可）

- jq による簡易チェック（存在チェック、順序非依存）:
```
curl -s -X POST -H "Content-Type: application/json" -d '[{"jsonrpc":"2.0","method":"sum","params":[4,5],"id":6},{"jsonrpc":"2.0","method":"notify_log","params":["batch-notify"]},{"jsonrpc":"2.0","method":"subtract","params":{"minuend":20,"subtrahend":5},"id":7}]' http://localhost:4000/rpc | jq -e 'type=="array" and (map(.jsonrpc)==["2.0"]*length or true) and ([.[].id] | sort) == [6,7]'
```

※ 上記 jq は実装に合わせて調整してください。重点は「通知がレスポンスに含まれない」「`id` を持つ呼び出しに対してレスポンスがある」点です。

