"use client";

import { type CSSProperties, useEffect, useRef } from "react";

/*
 * トップの冒頭の背景。いろいろな種目のステッカーを、濃い墨色の面にばらまいて貼る。
 * - 絵は public/images/stickers/*.webp（AI で作ったシートを切り抜いたもの。作り方は README）
 * - 置き場所は POSITIONS。PC は見出しのある左中央を空け、スマホは画面中央の見出しを上下から囲む
 * - 貼られるときの動きと揺れは CSS（globals.css の .sticker）
 * - スクロールすると、ばらばらのステッカーが回りながら集まり、2画面目で右側に円陣を組む。
 *   まん中には「FIND YOUR COACH」のエンブレムが入る（種目がコーチを囲む）。この動きは下の useEffect
 * - reduced-motion では、ばらばらに貼られたまま動かない
 */

/**
 * [絵, PC の x% y% 大きさpx 傾き, スマホの置き場所（null なら最初は出さない）]
 * PC は左中央（見出しと説明文）を空ける。
 * スマホは、画面中央の見出しの上と下の空きに、それぞれ2段で貼って見出しを囲む。
 *   [0=見出しの上 / 1=見出しの下, 段 0〜1, 左右 0〜1, 大きさの倍率]
 * 空きの高さは機種ごとに違うので、JS が測って大きさと間隔を決める（背の低い機種でも全部入る）。
 */
type Mobile = [zone: 0 | 1, row: 0 | 1, u: number, k: number];
type Pos = [name: string, x: number, y: number, size: number, rot: number, mobile: Mobile | null];
const POSITIONS: Pos[] = [
  ["running", 63, 24, 196, -10, [0, 0, 0.5, 1.12]],
  ["baseball", 80, 15, 156, 8, [0, 0, 0.84, 0.92]],
  ["yoga", 94, 34, 148, 12, [0, 1, 0.88, 0.86]],
  ["tennis", 75, 49, 184, 9, [0, 0, 0.16, 0.95]],
  ["soccer", 90, 61, 172, -8, [0, 1, 0.12, 0.88]],
  ["golf", 62, 69, 168, -6, [0, 1, 0.63, 0.9]],
  ["swimming", 77, 81, 164, 7, [1, 0, 0.13, 0.9]],
  ["basketball", 94, 87, 146, -10, [1, 0, 0.38, 0.86]],
  ["find-your-coach", 59, 46, 140, -8, null],
  ["volleyball", 49, 88, 144, 10, [1, 0, 0.63, 0.9]],
  ["pilates", 50, 14, 144, -12, [0, 1, 0.37, 0.86]],
  ["kendo", 35, 10, 122, 6, null],
  ["badminton", 5, 15, 128, -16, [1, 1, 0.2, 0.95]],
  ["table-tennis", 22, 91, 144, -8, null],
  ["rugby", 5, 88, 124, 8, [1, 1, 0.8, 0.95]],
  ["judo", 4, 53, 118, 10, [1, 0, 0.87, 0.88]],
  ["dance", 36, 92, 132, -6, [1, 1, 0.5, 1.08]],
  ["climbing", 96, 11, 116, 12, null],
  ["boxing", 67, 8, 112, -6, null],
  ["gymnastics", 86, 39, 116, -10, null],
  ["cycling", 20, 9, 116, 8, null],
  ["snowboard", 64, 93, 122, 6, null],
];
/** 画面の高さが足りないとき、見出しやボタンにかかるので出さない絵 */
const TALL_ONLY = new Set(["kendo", "table-tennis", "dance", "cycling"]);
/** 円陣のまん中に入る1枚 */
const KEEP = "find-your-coach";

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
/** a〜b のあいだを 0→1 に。出だしと止まり際をゆるやかに */
const ease = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Plan = {
  el: HTMLElement;
  /** 最初の位置の中心（上下）と、大きさの半分 */
  cy0: number;
  half: number;
  /** 円陣での位置（ばらばらの位置からのずれ px）と大きさ */
  ring: [number, number];
  ringScale: number;
  spin: number;
  /** 動き出しを1枚ずつ少しずらす */
  lag: number;
  /** 集まりながら現れる（スマホで最初は出していない絵） */
  fade: boolean;
};

export function StickerField() {
  const field = useRef<HTMLDivElement>(null);

  // 画像のデコードが終わったものから貼る（読み込みより先に「貼る動き」が終わって、欠けて見えるのを防ぐ）
  useEffect(() => {
    const root = field.current;
    if (!root) return;
    let alive = true;
    root.querySelectorAll<HTMLElement>("[data-sticker]").forEach((el) => {
      const img = el.querySelector("img");
      const show = () => alive && el.classList.add("is-ready");
      if (!img) return show();
      (img.complete ? img.decode() : new Promise((r) => img.addEventListener("load", r, { once: true })).then(() => img.decode()))
        .catch(() => undefined)
        .finally(show);
    });
    // 万一デコードが終わらなくても、3秒後には全部出す
    const fallback = window.setTimeout(() => root.querySelectorAll("[data-sticker]").forEach((el) => el.classList.add("is-ready")), 3000);
    return () => {
      alive = false;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const root = field.current;
    const section = root?.closest("section");
    if (!root || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let plans: Plan[] = [];
    // スマホ：円陣を置いたときの文章の下端（root の中の位置）。スクロールで文章が動いたら、円も同じだけ動かす
    let anchor: { el: Element; bottom: number } | null = null;
    // スマホ：円陣の画面の文章（集まる途中のステッカーが、この上を横切るときは薄くして重なって見えないようにする）
    let textBox: { first: Element; last: Element } | null = null;
    let ticking = false;

    // 画面の大きさから、円陣の場所と1枚ずつの行き先を決める
    const layout = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const wide = w >= 1024;
      // PC は右側に円。スマホは文章（上に寄せてある。Screen の mobileStart）の下に円
      const header = 64;
      const purpose = section.querySelectorAll<HTMLElement>("[data-screen]")[1];
      const last = purpose?.lastElementChild;
      const textBottom = purpose && last ? header + (last.getBoundingClientRect().bottom - purpose.getBoundingClientRect().top) : h * 0.45;
      /** スマホで、文章の下端から円のいちばん上のステッカーまでの間（px）。機種が変わってもこの間で固定する */
      const RING_GAP = 18;
      const lower = h - textBottom - RING_GAP - 12; // スマホで円に使える高さ
      const rx = wide ? Math.min(w * 0.21, h * 0.37) : Math.min(w * 0.38, lower / 2 - 26);
      const cx = wide ? w * 0.72 : w * 0.5;
      const ry = rx;
      // スマホ：冒頭の見出し（画面中央）の上と下の空きに、2段ずつ並べて囲む（大きさは空きの高さに合わせる）
      const hero = section.querySelectorAll<HTMLElement>("[data-screen]")[0];
      const shown = hero ? [...hero.children].filter((c) => getComputedStyle(c).display !== "none") : [];
      const heroTop = hero?.getBoundingClientRect().top ?? 0;
      const textTop = shown.length ? shown[0].getBoundingClientRect().top - heroTop : h * 0.4;
      const textBot = shown.length ? shown[shown.length - 1].getBoundingClientRect().bottom - heroTop : h * 0.6;
      const GAP = 14;
      // 背景はヘッダーの下から始まるので、最初の画面で見えている高さはそのぶん短い
      const visible = Math.min(h, window.innerHeight - (section.getBoundingClientRect().top + window.scrollY));
      const spaces = [textTop - GAP - 12, visible - 12 - textBot - GAP]; // 見出しの上・下の空き
      root.querySelectorAll<HTMLElement>("[data-mobile]").forEach((el) => {
        if (wide) {
          el.style.left = el.style.top = el.style.width = el.style.height = el.style.margin = "";
          return;
        }
        const [zone, row, u, k] = JSON.parse(el.dataset.mobile!) as Mobile;
        const rowH = Math.max(50, spaces[zone] / 2);
        // 1段に4枚まで並ぶ幅に収める。揺れの分だけ少し小さめ
        const base = Math.min(rowH * 0.92, w * 0.25);
        const size = base * k;
        // 段は見出しに寄せて詰める（空きが広くても、見出しから離れていかない）
        const pitch = Math.min(rowH, base * 1.12);
        const y = zone === 0 ? textTop - GAP - pitch * (2 - row) + pitch / 2 : textBot + GAP + pitch * row + pitch / 2;
        el.style.width = el.style.height = `${size}px`;
        el.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
        el.style.left = `${w / 2 + (u - 0.5) * w * 0.9}px`;
        el.style.top = `${y}px`;
      });

      const items = [...root.querySelectorAll<HTMLElement>("[data-sticker]")].filter((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        return getComputedStyle(el).display !== "none";
      });
      const members = items.filter((el) => el.dataset.sticker !== KEEP);
      const cell = clamp(((2 * Math.PI * rx) / members.length) * (wide ? 0.92 : 0.98), wide ? 60 : 34, wide ? 118 : 60);
      // スマホは、いちばん上のステッカーの上端が「文章の下端 + RING_GAP」にくるように置く
      const cy = wide ? h * 0.5 : textBottom + RING_GAP + cell / 2 + rx;
      anchor = !wide && last ? { el: last, bottom: textBottom } : null;
      textBox = !wide && purpose?.firstElementChild && last ? { first: purpose.firstElementChild, last } : null;
      let n = 0;
      plans = items.map((el, i) => {
        const size = el.offsetWidth;
        // いまの中心の位置
        const x = el.offsetLeft + size / 2;
        const y = el.offsetTop + size / 2;
        if (el.dataset.sticker === KEEP) {
          // エンブレムは円陣のまん中へ、大きく
          const big = rx * (wide ? 1.05 : 0.95);
          return { el, cy0: y, half: size / 2, ring: [cx - x, cy - y], ringScale: big / size, spin: 0, lag: 0.1, fade: getComputedStyle(el).opacity === "0" };
        }
        const angle = (n++ / members.length) * Math.PI * 2 - Math.PI / 2;
        return {
          el,
          cy0: y,
          half: size / 2,
          ring: [cx + Math.cos(angle) * rx - x, cy + Math.sin(angle) * ry - y],
          ringScale: cell / size,
          spin: i % 2 ? 360 : -360,
          lag: (i % 7) * 0.02,
          // スマホでは最初に出していない絵も、集まりながら現れて円に加わる
          fade: getComputedStyle(el).opacity === "0",
        };
      });
      update();
    };

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      // 文章がいまどれだけずれているか（円を文章にくっつけておくため。PC では 0）
      const rootTop = root.getBoundingClientRect().top;
      const follow = anchor ? anchor.el.getBoundingClientRect().bottom - rootTop - anchor.bottom : 0;
      // 文章の上端・下端（root の中の位置）。少し余白をとる
      const tTop = textBox ? textBox.first.getBoundingClientRect().top - rootTop - 6 : 0;
      const tBottom = textBox ? textBox.last.getBoundingClientRect().bottom - rootTop + 6 : 0;
      for (const s of plans) {
        const gather = ease(0.05 + s.lag, 0.62 + s.lag, p); // ばらばら → 円陣
        const x = mix(0, s.ring[0], gather);
        const y = mix(0, s.ring[1] + follow, gather);
        const scale = mix(1, s.ringScale, gather);
        s.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(s.spin * gather).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        // 集まる途中で文章に重なっている分だけ薄くする（重なりが 24px で消える）。止まったあとは重ならない
        let visible = s.fade ? gather : 1;
        if (textBox && gather > 0 && gather < 1) {
          const c = s.cy0 + y;
          const hh = s.half * scale;
          const overlap = Math.min(c + hh, tBottom) - Math.max(c - hh, tTop);
          if (overlap > 0) visible *= clamp(1 - overlap / 24);
        }
        s.el.style.opacity = s.fade || visible < 1 ? visible.toFixed(3) : "";
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      plans.forEach((s) => {
        s.el.style.transform = "";
        s.el.style.opacity = "";
      });
    };
  }, []);

  return (
    <div ref={field} aria-hidden="true" className="sticker-field absolute inset-0 overflow-hidden bg-navy">
      {/* コートのラインのような薄い線と、あたたかい光 */}
      <div className="sticker-court absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_72%_50%,rgb(255_122_61/0.28),transparent_70%)]" />
      {POSITIONS.map(([name, x, y, size, rot, m], i) => (
        <div
          key={name}
          data-sticker={name}
          data-mobile={m ? JSON.stringify(m) : undefined}
          className={`sticker ${m ? "" : "sticker-wide"} ${TALL_ONLY.has(name) ? "sticker-tall" : ""}`}
          style={
            {
              "--x": `${x}%`,
              "--y": `${y}%`,
              "--mx": `${(m ? m[2] : x / 100) * 100}%`,
              "--my": `${m ? (m[0] ? 66 : 14) + m[1] * 14 : y}%`,
              "--size": `${size}px`,
              "--rot": `${rot}deg`,
              "--i": i,
            } as CSSProperties
          }
        >
          {/* 装飾なので alt は空。大きさは CSS が決める（元は 512px の正方形） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/stickers/${name}.webp`} alt="" width={512} height={512} fetchPriority={i < 10 ? "high" : "auto"} draggable={false} />
        </div>
      ))}
      {/* 上と下を少し沈めて、文字を読みやすく */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/50" />
    </div>
  );
}
