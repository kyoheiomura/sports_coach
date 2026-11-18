# ホイッスル（スポーツコーチメディア）

スポーツコーチへのインタビューを軸にした「コーチを比較して選べる」メディア。
コンセプトは **あなたに合ったコーチと出会う。** 合う教え方は人によって違うので、戦績や星では並べない。星・口コミ・ランキングは作らず、判断材料は「インタビュー本文」と「全員に同じ質問をした比較項目」の2つだけ。

たなごころ（整体・鍼灸メディア／`../shinkyu-seitai`）と同じ作りを土台にしている。

- 取材の質問シート: [docs/interview-question-sheet.md](docs/interview-question-sheet.md)
- 原稿テンプレート: [templates/coach.mdx](templates/coach.mdx)・[templates/venue.yaml](templates/venue.yaml)

## 技術

Next.js（App Router・全ページ静的生成）／TypeScript／Tailwind CSS v4／MDX＋frontmatter（Zod で検証）。Vercel にそのままデプロイできる。

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー（http://localhost:3000） |
| `npm run build` | 原稿の検査 → ビルド → title の検査。どれかで失敗したら止まる |
| `npm start` | ビルドしたものを起動 |
| `npm run lint:content` | 原稿の検査だけ（スキーマ・参照・NG ワード・情報の鮮度） |
| `npm run check:titles` | ビルド後の全ページの title に「コーチ」が入っているか |
| `npm run typecheck` | 型チェック |
| `bash scripts/generate-stickers.sh && node scripts/slice-stickers.mjs` | トップ冒頭のステッカーを AI（Codex）で作り直す。3×3 のシート2枚を生成し、1枚ずつ切り抜いて `public/images/stickers/` に置く |
| `FORCE=1 bash scripts/generate-photos.sh` | ダミーのコーチの写真を AI（Codex）で作り直す（FORCE を付けなければ、無い写真だけ作る） |

## コーチ・場所を追加する

1. `templates/venue.yaml` を `content/venue/<slug>.yaml` にコピーして埋める（地域は `data/areas.ts` にある値だけ）
2. `templates/coach.mdx` を `content/coach/<slug>.mdx` にコピーして埋める。写真は `public/images/coach/` へ
3. `npm run lint:content` で検査 → `draft: false` にして公開
4. ファイル名が `_` で始まるものは読み込まれない（下書き置き場に使える）。`SHOW_DRAFTS=1 npm run dev` で下書きも表示
5. 種目を増やすときは `data/vocab.ts` の `SPORTS` に足す（掲載が1人でもいれば `/sport/<slug>/` が自動でできる）

## 構成

```
app/                 ページ（/、/coach/、/coach/[slug]/、/sport/…、/area/…、/venue/[slug]/、/about/…）
components/          部品（CoachCard、ProfileHeader、SearchPanel、CompareFieldsList など）
content/             原稿（coach/*.mdx、venue/*.yaml）
data/                マスター（site＝サイト名とコンセプト、areas、vocab＝決まった語彙、ng-words）
lib/content.ts       コンテンツを読む唯一の入口。CMS に移るときはここだけ差し替える
lib/schema.ts        Zod スキーマ
lib/compare-fields.ts 個別ページ「教え方」の項目の並びと言い回し
scripts/             lint・title 検査・画像
components/CourseMap.tsx    トップ「読んで、比べて、体験に行く」（スクロールでコースを走る）
components/StickerField.tsx トップ冒頭の背景（種目のステッカー）。置き場所とスクロールの動きはこのファイルの中。絵は public/images/stickers/
```

サイト名とコンセプトの文言は `data/site.ts` にまとめてある（ロゴ・フッター・OGP・title に反映される）。

## 守ること（コンセプトから）

- 口コミ・星・点数・ランキング・「人気順」「おすすめ順」は作らない。並び順は新着順とエリア順だけ
- 戦績・教えた人数・教え子の進路など、数字や肩書きの大きさを比べる項目は作らない（触れるならインタビュー本文の中で）
- 有料掲載でも表示順を変えない。`listing: paid` のコーチには「掲載プラン利用」と自動で表示する
- 料金は通常の額だけ。割引・体験価格を強調しない
- 上達や結果を約束する表現は使わない（`data/ng-words.ts`。公開前・有料掲載の開始前に専門家の確認を受ける）

## 公開前にやること

- サイト名「ホイッスル」の商標・同名サービスを確認する
- `data/site.ts` の `isDummyContent` を `false` にする（robots.txt の全面ブロックが外れる）
- `NEXT_PUBLIC_SITE_URL` を本番ドメインに設定する
- ダミーのコーチ・場所（`content/`）と AI 生成の写真を、実際の取材内容と写真に差し替える
- プライバシーポリシーを確定する
