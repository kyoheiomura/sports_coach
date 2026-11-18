#!/bin/bash
# ダミー期間用の写真を AI（Codex 組み込みの image_gen / gpt-image-2）で生成する。
# 人物の顔は作らない（作り物の質感が出るため）。手元・道具・練習場所だけ。
# ChatGPT サブスクリプションの範囲で動く（API キー不要・従量課金なし）。
# Codex はワークスペース内だけ書き込めるサンドボックスで動かす:
#   bash scripts/generate-photos.sh          … まだ無い写真だけ作る
#   FORCE=1 bash scripts/generate-photos.sh  … すべて作り直す
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/coach public/images/interview public/images/top
LOG_DIR=artifacts/photos
mkdir -p "$LOG_DIR"

STYLE="Photorealistic editorial sports photograph, NO people's faces visible, no text, no logos, no brand marks, no watermark. Japan, early morning soft natural light, slightly warm tones, shallow depth of field, calm and focused atmosphere, high-end magazine photography, natural textures."

gen() { # gen <公開するパス（.jpg）> <サイズ> <プロンプト>
  if [ -f "$1" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $1"; return; fi
  local raw="$LOG_DIR/$(basename "${1%.jpg}").png"   # 元の PNG は artifacts/photos/ に残し、公開用は JPEG にする
  codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: '$3'
サイズ: $2
保存先: $raw" > "$LOG_DIR/$(basename "$1").log" 2>&1
  sips -s format jpeg -s formatOptions 86 "$raw" --out "$1" > /dev/null && file "$1"
}

D=public/images/coach
wait
gen $D/kamei-shin-grip.jpg 1536x1024 "Close-up of two hands gripping a golf club at address on a green practice mat, a single white golf ball in front, driving range softly blurred, faces out of frame. $STYLE" &
gen public/images/top/cones.jpg 1536x1024 "Low angle close-up of small orange training cones in a line on green artificial turf with a plain soccer ball, children's legs in sneakers softly blurred far behind, faces out of frame. $STYLE" &
gen $D/mogi-aoi-reformer.jpg 1536x1024 "Close-up of a pilates instructor's hands adjusting the springs of a wooden pilates reformer machine in a bright studio, a pilates ring and a folded towel on the carriage, light wood floor and large windows softly blurred, nobody else in frame, faces out of frame. $STYLE" &
wait
# 取材記事の本文に入れる写真（場所の様子・道具。人は入れない）
I=public/images/interview
gen $I/mogi-aoi-studio.jpg 1536x1024 "Interior of a small bright pilates studio with nobody in it: two wooden pilates reformer machines, rolled mats on a shelf, a large mirror, light wood floor, big windows with sheer curtains, wide shot. $STYLE" &
gen $I/mogi-aoi-tools.jpg 1536x1024 "Still life on a light wood floor in a pilates studio: a pilates ring, a foam roller, a small soft ball and a folded mat arranged neatly, soft window light, nobody in frame. $STYLE" &
wait
gen $I/kamei-shin-studio.jpg 1536x1024 "Interior of a small indoor golf lesson studio with nobody in it: a hitting mat in front of a large blank white impact screen, a golf bag with clubs leaning on a stand, a stool and a small table, warm spot lighting, wide shot. $STYLE" &
gen $I/kamei-shin-monitor.jpg 1536x1024 "Close-up in an indoor golf studio: a small launch monitor device standing on the green hitting mat beside a golf ball on a tee and an iron club head, shallow depth of field, nobody in frame. $STYLE" &
wait
# トップ「会う前に、ここまでわかる。」の写真（ゴルフはコーチの写真を使う）
gen public/images/top/variety.jpg 1536x1024 "Still life on a light wood floor against a plain warm white wall: a neat row of different sports equipment laid side by side, a rolled yoga mat, a tennis racket with a yellow ball, a golf club, a soccer ball, a pair of running shoes, a baseball glove, soft natural window light, nobody in frame, no logos, no text. $STYLE" &
gen public/images/top/pilates.jpg 1536x1024 "A bright pilates studio: an instructor's hands gently guiding a client's foot position on a wooden pilates reformer machine, seen from the side, light wood floor, large windows, faces out of frame. $STYLE" &
wait
echo "完了。public/images/ を確認してください。"
