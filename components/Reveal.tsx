"use client";

/**
 * スクロールで現れる動き。
 * - 要素に data-reveal を付けると、画面に入ったときに pending → visible に切り替わる
 *     fade  … ぼやけた状態からピントが合う
 *     title … 1行ずつ、左から筆で書くように現れる（<RevealTitle>）
 *     rise  … 下からせり上がる（数字など。中に .reveal-ink）
 *     photo … 閉じたまぶたが開くように、中央から上下に開く
 *     line  … 罫線が左から伸びる
 *     chars … 一文字ずつ立ち上がる（<RevealChars>）
 * - data-reveal-group を付けた親は、親が画面に入ったときに中の data-reveal をまとめて順番に見せる。
 *   順番は --seq（自動採番。style={seq(n)}（lib/reveal.ts）で上書きできる）× 130ms。--seq-base で全体をずらす
 * - 隠すのは JS が動いて html に reveal-ready が付いたあとだけ。JS なし・検索エンジン・reduced-motion では最初から見える
 * - 画面に入ったものだけを見せる。下の方にあるものは、スクロールして来るまで出さない
 */
import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";

export function RevealProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-group]"));
    const show = (el: HTMLElement) => {
      el.dataset.revealState = "visible";
    };
    if (reduced || !("IntersectionObserver" in window)) {
      all.forEach(show);
      return;
    }
    document.documentElement.classList.add("reveal-ready");

    // 観察する対象 → そのとき見せる要素たち
    const targets = new Map<HTMLElement, HTMLElement[]>();
    for (const g of groups) {
      const items = Array.from(g.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
        (el) => el.closest("[data-reveal-group]") === g,
      );
      items.forEach((el, i) => {
        if (!el.style.getPropertyValue("--seq")) el.style.setProperty("--seq", String(i));
      });
      targets.set(g, items);
    }
    for (const el of all) {
      if (!el.closest("[data-reveal-group]")) targets.set(el, [el]);
    }
    for (const items of targets.values()) {
      items.forEach((el) => {
        if (!el.dataset.revealState) el.dataset.revealState = "pending";
      });
    }

    const reveal = (t: Element) => targets.get(t as HTMLElement)?.forEach(show);
    const observe = (rootMargin: string) =>
      new IntersectionObserver(
        (entries, io) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              reveal(e.target);
              io.unobserve(e.target);
            }
          }
        },
        // threshold は 0 にする。閉じた写真（clip-path）は見えている部分が 1% しかなく、Chrome の IO はそれを数える
        { rootMargin, threshold: 0 },
      );
    // 白い面は、下端から 15% 入ったら。固定背景の場面（data-screen）は、中央に近づいてから
    const ioPage = observe("0px 0px -15% 0px");
    const ioScreen = observe("-15% 0px -30% 0px");

    // 初回の幕開け（Motion.tsx の Intro）が出るあいだは待つ。Intro が sessionStorage に印を付ける前にここが動く
    const introDelay = sessionStorage.getItem("coach-media:intro") ? 0 : 1500;
    const start = window.setTimeout(() => {
      for (const t of targets.keys()) (t.closest("[data-screen]") ? ioScreen : ioPage).observe(t);
    }, introDelay);

    // 万一 IO が動かなくても、最初から画面内にあるものだけは見せる。下の方は触らない
    const safety = window.setTimeout(() => {
      for (const t of targets.keys()) {
        if (t.getBoundingClientRect().top < window.innerHeight) reveal(t);
      }
    }, introDelay + 2500);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(safety);
      ioPage.disconnect();
      ioScreen.disconnect();
    };
  }, [pathname]);
  return null;
}

/** 見出しを一文字ずつ立ち上げる（短い見出し向け）。文字列の配列＝行 */
export function RevealChars({
  as: Tag = "h1",
  lines,
  className = "",
  accent,
  style,
}: {
  as?: "h1" | "h2" | "p";
  lines: string[];
  className?: string;
  /** ここに含まれる文字を強調色にする（例: "教え方"） */
  accent?: string;
  style?: CSSProperties;
}) {
  let n = 0;
  return (
    <Tag className={className} data-reveal="chars" style={style}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {Array.from(line).map((ch, ci) => {
            const delay = `${(n++ * 45).toString()}ms`;
            return (
              <span
                key={ci}
                className={`reveal-char ${accent?.includes(ch) ? "text-accent-bright" : ""}`}
                style={{ transitionDelay: delay }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** 見出しを1行ずつ、左から書くように見せる。lines の各要素が1行 */
export function RevealTitle({
  as: Tag = "h2",
  lines,
  className = "",
  id,
  style,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  lines: ReactNode[];
  className?: string;
  id?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag id={id} className={className} data-reveal="title" style={style}>
      {lines.map((l, i) => (
        <span key={i} className="reveal-line">
          <span className="reveal-ink">{l}</span>
        </span>
      ))}
    </Tag>
  );
}
