# 0005 - Notification: notify_log

目的: 通知（notification）を受け取りログに出力する `notify_log` を実装する。通知は `id` を持たないため、サーバーは応答を返さないことを確認する。

例（通知）:
```
{"jsonrpc":"2.0","method":"notify_log","params":["started"]}
```

期待動作:
- サーバーはログに `started` を出力するが、HTTP レスポンスボディは返さない（204 または空応答）。

難易度: 超入門

ヒント:
- リクエストに `id` が存在しない場合は「通知」として扱う。レスポンスを送らないこと。

検証:
- `curl` でリクエスト送信後にサーバーログ（コンソール）を確認する。

## テスト仕様

- 通知リクエスト（例）:
```
{"jsonrpc":"2.0","method":"notify_log","params":["started"]}
```
- 期待動作:
	- HTTP レスポンスボディは返さない（ステータス 204 など）。
	- サーバーログに `started` が出力されること。

※ 自動テストでは `curl` を実行してステータスコードが 204 または空ボディであることを確認し、サーバーログをgrepしてメッセージの出力を検査する。

## テスト仕様（構造マッチ）

- 検証方針: 通知はレスポンスを返さない（HTTP レスポンスボディは空、またはステータス 204）。サーバー側でログに出力されることを確認する。

- 自動検証の例:
	- `curl` を実行して HTTP ステータスが 204 か、レスポンスボディが空であることをチェック
	- サーバーログを読み、指定メッセージ（ここでは `started`）が出ていることを grep 等で確認

```
# HTTP レスポンスが空または 204
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"notify_log","params":["started"]}' http://localhost:4000/rpc)
test "$status" = "204" || echo "OK if body empty and logs contain message"

# サーバログ確認の例（実装によりログファイルや stdout を指定）
grep -q "started" /path/to/server.log
```


