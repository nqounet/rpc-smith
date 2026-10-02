# ディレクトリ構成と命名ルール
メタ運用のキーポイント
このファイルは運用に合わせて随時更新してください。

----

- 大量のバリアントを CI で毎回走らせると重くなるため、日常的な PR では「最新 vN のみ」を実行する設定が現実的。
- variant を乱立させないために、PR テンプレートで `variant の目的` を必須にするのが有効。

小さな注意点

4. ツールが `tools/generate-index` を使って自動的に index を更新。
3. PR: PR の説明に `variant: v1`、`author:`、`purpose:` を明記。
2. 実装を追加: `implementations/<lang>/0002-my-challenge/solutions/v1/` を作る。`meta.yml` を書き、`src/` と `tests/` を追加。
1. 新規課題を追加: `exercises/0002-my-challenge/` を作成し、`spec.md` と `meta.yml` を追加。

運用ワークフロー（簡易）

- 将来的にタグや難易度、所要時間でフィルタできるようにメタデータを充実させる。
- `tools/generate-index` は exercises ごとに実装言語と各 `vN` を列挙し、`exercises/index.json` を出力する。

拡張性と検索性

  - 全バリアントを実行するモードも用意（オプション）。
  - canonical が明示されていない場合、ツールは「最新の vN（最大 N）」を『デフォルト実行対象』として扱うことを推奨。
- CI やツールは project-level policy に従い振る舞う:
- variant の作者や目的は `solutions/vN/meta.yml` に明記（author, purpose, date など）。
- variant は `vN`（N は 1 からの整数）で命名。例: `v1`, `v2`。

  - generate-index    # exercises と implementations を走査して index.json を生成
- tools/

      - meta.yml      # 実装ディレクトリのサマリ（任意）
        - v2/         # 追加のバリアント（別解、最適化版、教育版 など）
          - tests/
          - src/
          - meta.yml  # variant メタデータ（version/author/description/run_cmd/test_cmd 等）
        - v1/         # versioned variant（初回は v1）
      - solutions/
    - 0001-hello-rpc/
  - go/
- implementations/

    - meta.yml       # 課題メタデータ（id/title/difficulty/tags 等）
    - spec.md        # 課題説明・入出力・テスト仕様
  - 0001-hello-rpc/
- exercises/

例: ディレクトリツリー（抜粋）

- canonical（代表解）はデフォルトで設定しない（プロジェクト方針: `canonical: null` または未指定）。
- 同一言語で複数解を許容する。バリアント名は「単純なバージョン番号」を採用（`v1`, `v2`, ...）。
- 各課題は `exercises/<ID>-<slug>/` に置く。スラッグは英数字とハイフン。
- 課題IDは4桁（例: `0001`）。将来的に 9999 まで拡張可能。
主な方針（今回の決定）

このドキュメントは「100問以上になっても破綻しない」ことを目標にしたディレクトリ設計と命名ルールを示します。
