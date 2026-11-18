import { Barlow_Condensed, LINE_Seed_JP, Noto_Sans_JP } from "next/font/google";

// 和文フォントは分割された全ファイルを自前で配信する。preload は latin 分だけになるので切る
// 本文：Noto Sans JP（細め〜中）
export const sans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sans-jp",
});

// 見出し：LINE Seed JP（幾何学的で、すっきりした太字）。明朝体はサイト全体で使わない
export const display = LINE_Seed_JP({
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-jp",
});

// ロゴ：欧文のコンデンス体（斜体・極太）。「WHISTLE」の文字にだけ使う
export const logo = Barlow_Condensed({
  weight: ["800"],
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-logo-en",
});
