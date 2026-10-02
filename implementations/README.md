# implementations/ ディレクトリガイド

目的: 各言語ごとに課題の複数バリアント（解答）を整理するためのルールをまとめます。

構成ルール（要点）

- 言語ルート: `implementations/<lang>/`（例: `implementations/go/`, `implementations/nodejs/`）
- 課題フォルダ: `exercises/<ID>-<slug>/`
- バリアントフォルダ: `implementations/<lang>/<ID>-<slug>/solutions/v1/`, `v2/`, ...
- 各バリアントは `meta.yml`（version, author, run_cmd, test_cmd）を必ず持つ。

追加手順（開発者向け）

1. 新規バリアントを追加する際は `solutions/vN/` を作成（N は次の整数）。
2. `solutions/vN/meta.yml` を追加し、`author` と `purpose` を明記。
3. 実装コードは `src/`、テストは `tests/` に配置。
4. `test_cmd` を `meta.yml` に書いて、CI が自動検出できるようにする。
5. PR の説明に「このバリアントの目的」と「互換性（言語バージョン等）」を必須で記載する。

CI の運用（提案）

- PR ビルド: デフォルトで各実装ディレクトリの "latest vN" のみを実行（軽量化）。
- フル実行: 設定フラグで `solutions/*` のすべてを並列実行できるようにする（デイリージョブ等）。
- バリアントが多すぎる場合は warning を出すルールを追加（例: 1課題につき最大 10 バリアントを推奨）。

命名・バージョン方針

- バリアントは `v1`, `v2`, ... のシンプルな番号を使用。
- author 情報は `meta.yml` へ。ディレクトリ名に author を入れる必要はない（可読性を優先）。

例: 新しい Go バリアントを追加する手順

$ cd implementations/go/0001-hello-rpc
$ mkdir -p solutions/v2/src solutions/v2/tests
# 追加: solutions/v2/meta.yml を作成して内容を記載

----

この README は運用に合わせて随時更新してください。
