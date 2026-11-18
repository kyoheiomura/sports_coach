// AI で作ったステッカーのシート（マゼンタ背景・3×3）を、1枚ずつ透明背景の WebP に切り抜く。
//   node scripts/slice-stickers.mjs
// 入力: artifacts/stickers/<sheet>-raw.png（scripts/generate-stickers.sh が作る）
// 出力: public/images/stickers/<name>.webp（512px・components/StickerField.tsx が読む）
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "artifacts/stickers";
const OUT = "public/images/stickers";
const SIZE = 512;
const MARGIN = 14;

/** シートごとの、読み順（左上→右下）の名前 */
const SHEETS = {
  "sheet-a": ["running", "baseball", "soccer", "tennis", "swimming", "golf", "basketball", "volleyball", "badminton"],
  "sheet-c": ["find-your-coach", "kendo", "gymnastics", "snowboard", "climbing", "surfing", "boxing", "cycling", "skateboard"],
  "sheet-d": ["yoga", "pilates", "karate", "futsal", "softball", "track-and-field", "figure-skating", null, "handball"],
  "sheet-e": ["step-read", "step-compare", "step-try", "step-start"],
  "sheet-b": [null, null, null, null, "table-tennis", "rugby", "judo", "dance", null], // 種目でない絵（null）は書き出さない
};

/** 画面の端からつながっているマゼンタだけを背景とみなす（絵の中の赤やピンクは残す） */
function findBackground(px, w, h) {
  const magenta = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    if (Math.min(r, b) - g > 70 && Math.abs(r - b) < 110) magenta[i] = 1;
  }
  const bg = new Uint8Array(w * h);
  // 絵に囲まれて端とつながっていない穴（ひもの輪の中など）も、はっきりしたマゼンタなら背景にする
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    if (Math.min(r, b) - g > 130 && Math.abs(r - b) < 60) bg[i] = 2;
  }
  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  const push = (i) => {
    if (magenta[i] && bg[i] !== 1) {
      bg[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < w; x++) (push(x), push((h - 1) * w + x));
  for (let y = 0; y < h; y++) (push(y * w), push(y * w + w - 1));
  while (head < tail) {
    const i = queue[head++];
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  for (let i = 0; i < w * h; i++) if (bg[i]) bg[i] = 1;
  return bg;
}

/** マスクを n 画素ふくらませる */
function dilate(mask, w, h, n) {
  let cur = mask;
  for (let k = 0; k < n; k++) {
    const next = new Uint8Array(cur);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (cur[i]) continue;
        if ((x > 0 && cur[i - 1]) || (x < w - 1 && cur[i + 1]) || (y > 0 && cur[i - w]) || (y < h - 1 && cur[i + w])) next[i] = 1;
      }
    cur = next;
  }
  return cur;
}

/** つながった前景のかたまりごとに、外接する四角と面積を返す */
function components(fg, w, h) {
  const seen = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  const boxes = [];
  for (let start = 0; start < w * h; start++) {
    if (!fg[start] || seen[start]) continue;
    let head = 0, tail = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    seen[start] = 1;
    queue[tail++] = start;
    while (head < tail) {
      const i = queue[head++];
      const x = i % w, y = (i - x) / w;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && fg[j] && !seen[j]) {
          seen[j] = 1;
          queue[tail++] = j;
        }
      }
    }
    boxes.push({ x0, y0, x1, y1, area: tail });
  }
  return boxes;
}

fs.mkdirSync(OUT, { recursive: true });
let failed = false;

for (const [sheet, names] of Object.entries(SHEETS)) {
  const file = path.join(SRC, `${sheet}-raw.png`);
  if (!fs.existsSync(file)) {
    console.log(`なし: ${file}（とばします）`);
    continue;
  }
  const { data: px, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const bg = dilate(findBackground(px, w, h), w, h, 2); // 白いフチに残るマゼンタのにじみを食べる
  const near = dilate(bg, w, h, 4);
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) {
      px[i * 4 + 3] = 0;
    } else if (near[i]) {
      // フチぎわの色かぶりを消す：緑が赤・青より低ければ持ち上げて白に寄せる
      const m = Math.min(px[i * 4], px[i * 4 + 2]);
      if (px[i * 4 + 1] < m) px[i * 4 + 1] = m;
    }
  }

  const fg = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) fg[i] = bg[i] ? 0 : 1;
  const boxes = components(fg, w, h).filter((b) => b.area > w * h * 0.012);
  if (boxes.length !== names.length) {
    console.log(`✖ ${sheet}: ステッカーが ${boxes.length} 枚見つかりました（${names.length} 枚のはず）。シートを作り直してください。`);
    failed = true;
    continue;
  }
  // 読み順に並べる：行（上から3段）→ 左から
  const row = (b) => Math.min(2, Math.floor(((b.y0 + b.y1) / 2 / h) * 3));
  boxes.sort((a, b) => row(a) - row(b) || a.x0 - b.x0);

  const clean = sharp(px, { raw: { width: w, height: h, channels: 4 } });
  for (const [i, b] of boxes.entries()) {
    if (!names[i]) continue;
    const out = path.join(OUT, `${names[i]}.webp`);
    await clean
      .clone()
      .extract({ left: b.x0, top: b.y0, width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1 })
      .resize(SIZE - MARGIN * 2, SIZE - MARGIN * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(out);
    console.log(`作成: ${out}`);
  }
}
process.exit(failed ? 1 : 0);
