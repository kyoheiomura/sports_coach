import type { CSSProperties } from "react";

/**
 * スクロールで現れる順番を手で決めるとき：style={seq(2)}
 * --seq × 130ms 遅らせる。base は --seq-base（カードごとのずらしなど）
 * サーバー側の部品からも呼ぶので、"use client" の Reveal.tsx とは分けてある
 */
export function seq(n: number, base?: number): CSSProperties {
  const s: Record<string, number> = { "--seq": n };
  if (base !== undefined) s["--seq-base"] = base;
  return s as CSSProperties;
}
