# メタデータスキーマ（例）

以下は課題側（exercise）と実装側（solution variant）に置く `meta.yml` の例です。

## exercises/<ID>-<slug>/meta.yml (課題メタ)

```yaml
id: "0001"
slug: "hello-rpc"
title: "Hello RPC"
description: "単純なメソッドを実装してメッセージを返す"
difficulty: "easy"
tags:
  - basics
  - rpc
estimated_minutes: 15
prereqs: []
# other optional fields
```

## implementations/<lang>/<ID>-<slug>/solutions/vN/meta.yml (variant メタ)

```yaml
version: "v1"
author: "nobu"
date: "2025-12-09"
purpose: "reference implementation (minimal, no external deps)"
description: "Go での最小実装。単体テストを含む。"
run_cmd: "go run ./src"
test_cmd: "go test ./tests/..."
language_version: "go1.21"
notes: "パフォーマンスを重視していない"
```

## implementations/<lang>/<ID>-<slug>/meta.yml (実装ディレクトリのサマリ、任意)

```yaml
language: "go"
exercise_id: "0001"
available_variants:
  - version: "v1"
    path: "solutions/v1/"
  - version: "v2"
    path: "solutions/v2/"
```

## index.json の想定出力（tools/generate-index による）

```json
{
  "exercises": [
    {
      "id": "0001",
      "slug": "hello-rpc",
      "implementations": {
        "go": {
          "variants": ["v1"],
          "latest": "v1"
        },
        "nodejs": {
          "variants": ["v1","v2"],
          "latest": "v2"
        }
      }
    }
  ]
}
```

---

メタは人が読むことを重視して `YAML` を推奨します。ツールは YAML を読み取り `index.json` を生成して高速検索・CI 設定に使います。
