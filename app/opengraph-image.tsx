import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

// サイト共通の OGP 画像。濃い墨色の地に、コンセプトを太い角ゴシックで
export const alt = SITE.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEXT = `${SITE.name}${SITE.nameEn}${SITE.kind}${SITE.tagline.join("")}`;

/** 使う文字だけを Google Fonts から取得する（ビルド時に1回） */
async function loadFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(TEXT)}`,
  ).then((r) => r.text());
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error(`OGP 用フォントを取得できませんでした: ${family}`);
  return fetch(src).then((r) => r.arrayBuffer());
}

export default async function OgImage() {
  const gothic = await loadFont("LINE+Seed+JP", 800);
  const [line1, line2] = SITE.tagline;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          background: "#141d27",
          color: "#ffffff",
          fontFamily: "Gothic",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.3, display: "flex", color: "#ff9a5c" }}>{line1}</div>
          <div style={{ fontSize: 96, lineHeight: 1.3, display: "flex" }}>{line2}</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", borderTop: "2px solid rgba(255,255,255,0.25)", paddingTop: 28 }}>
          <span style={{ fontSize: 44 }}>{SITE.nameEn}</span>
          <span style={{ fontSize: 26, marginLeft: 20 }}>{SITE.name}</span>
          <span style={{ fontSize: 26, marginLeft: 24, color: "rgba(255,255,255,0.65)" }}>{SITE.kind}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Gothic", data: gothic, weight: 800, style: "normal" }],
    },
  );
}
