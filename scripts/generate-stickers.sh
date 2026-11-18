#!/bin/bash
# トップ冒頭のステッカーを AI（Codex 組み込みの image_gen / gpt-image-2）で生成する。
# 3×3 のシートを 4 枚つくり、scripts/slice-stickers.mjs で1枚ずつ切り抜く。
# 背景はマゼンタ一色（芝やコートの緑と混ざらないように。切り抜きのときに透明にする）。
# ChatGPT サブスクリプションの範囲で動く（API キー不要・従量課金なし）。
#   bash scripts/generate-stickers.sh && node scripts/slice-stickers.mjs
set -u
cd "$(dirname "$0")/.."
OUT=artifacts/stickers
mkdir -p "$OUT"

COMMON="Create a sports sticker sprite sheet image, square, exactly 3x3 equally spaced grid cells, ONE separate die-cut sticker per cell. All art fully within its cell, generous empty margins separating each sticker, stickers must not touch each other, no grid lines. The background outside the stickers must be one perfectly flat solid pure magenta #FF00FF with no gradient, texture or shadow, and magenta must not appear inside any sticker. Vintage detailed hand illustrated varsity souvenir stickers and embroidered-patch style badges, mixed shapes (round seals, shields, pennants, ribbons, ovals), palette of dark navy, cream, warm orange, golden yellow, teal, forest green and coral red, thick white paper die-cut border around every sticker, screenprinted textured artwork with rich detail, beautifully readable uppercase English lettering on a ribbon or banner, spelled exactly as given. No human faces, no people, no brand logos, no Japanese characters."

gen() { # gen <名前> <プロンプト>
  if [ -n "${ONLY:-}" ] && [ "$ONLY" != "$1" ]; then return; fi   # ONLY=sheet-d で1枚だけ作る
  if [ -f "$OUT/$1-raw.png" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $OUT/$1-raw.png（作り直すなら FORCE=1）"; return; fi
  codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: '$2'
サイズ: 2048x2048
保存先: $OUT/$1-raw.png" > "$OUT/$1.log" 2>&1
  file "$OUT/$1-raw.png"
}

gen sheet-a "$COMMON Reading order: 1 running shoes on a red athletics track with lane lines at sunrise labelled RUNNING; 2 a leather baseball glove, ball and crossed bats over a diamond labelled BASEBALL; 3 a classic soccer ball in front of a goal net on a pitch labelled SOCCER; 4 a tennis racket and ball on a court with a net labelled TENNIS; 5 swimming goggles and cap above pool lane ropes and waves labelled SWIMMING; 6 a golf flag on a green with a ball and club and rolling hills labelled GOLF; 7 a basketball dropping through a hoop and net labelled BASKETBALL; 8 a volleyball above a net with sun rays labelled VOLLEYBALL; 9 a badminton shuttlecock and crossed rackets labelled BADMINTON. Nine distinct isolated stickers on flat #FF00FF." &
gen sheet-b "$COMMON Reading order: 1 a coach whistle on a lanyard with stars labelled COACH; 2 a vintage stopwatch with laurel leaves labelled MY PACE; 3 a tactics clipboard with Xs, Os and arrows labelled GAME PLAN; 4 a bold comic speech bubble containing only the big word NICE! with small stars; 5 table tennis paddles and ball over a table labelled TABLE TENNIS; 6 a rugby ball between goal posts labelled RUGBY; 7 a folded judo uniform with a black belt labelled JUDO; 8 dance sneakers with musical notes and a spotlight labelled DANCE; 9 orange training cones and an agility ladder on turf labelled DRILL. Nine distinct isolated stickers on flat #FF00FF." &
gen sheet-c "$COMMON Reading order: 1 a large proud round emblem with a silver coach whistle in the centre, laurel wreath and stars, a ribbon with the exact words FIND YOUR COACH; 2 a kendo helmet and crossed bamboo swords labelled KENDO; 3 a gymnastics pommel horse, rings and a ribbon labelled GYMNASTICS; 4 a snowboard on a snowy mountain slope labelled SNOWBOARD; 5 a climbing wall with colourful holds, rope and carabiner labelled CLIMBING; 6 a surfboard on a big curling wave labelled SURFING; 7 a pair of red boxing gloves hanging in front of a ring labelled BOXING; 8 a road bicycle on a mountain road labelled CYCLING; 9 a skateboard on a ramp labelled SKATEBOARD. Nine distinct isolated stickers on flat #FF00FF." &
gen sheet-d "$COMMON Reading order: 1 a rolled yoga mat, yoga blocks and a lotus flower at sunrise labelled YOGA; 2 a pilates reformer machine with a pilates ring and ball labelled PILATES; 3 a folded karate uniform with a black belt and a wooden board labelled KARATE; 4 a futsal ball and small indoor goal on a wooden court labelled FUTSAL; 5 a softball, bat and glove on a diamond labelled SOFTBALL; 6 track and field hurdles on a red athletics track in a stadium labelled TRACK AND FIELD; 7 a pair of white figure skates on ice with snowflakes labelled FIGURE SKATING; 8 dumbbells and a kettlebell in a gym labelled TRAINING; 9 a handball flying into a goal net labelled HANDBALL. Nine distinct isolated stickers on flat #FF00FF." &
# トップ「読んで、比べて、体験に行く」の3つの手順に貼るステッカー（2×2）
gen sheet-e "${COMMON/exactly 3x3 equally spaced grid cells/exactly 2x2 equally spaced grid cells} Reading order: 1 an open sports magazine with an interview page, a pencil and a cup labelled READ; 2 two coach profile cards side by side with a magnifying glass over them labelled COMPARE; 3 a vintage admission ticket with a whistle and stars with the exact words TRIAL LESSON; 4 a checkered start flag on a running track labelled START. Four distinct isolated stickers on flat #FF00FF." &
wait
echo "完了。次に node scripts/slice-stickers.mjs を実行してください。"
