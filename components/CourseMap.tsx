"use client";

import { useEffect, useRef } from "react";
import { RevealTitle } from "@/components/Reveal";

/*
 * トップ「読んで、比べて、体験に行く」。写真ではなく、S字のコースを1本描く。
 * スクロールするとコースがオレンジに塗られていき、ランニングのステッカーが走って、
 * 3つのチェックポイント（読む → 比べる → 体験に行く）を順に通る。
 * - 画面は固定（sticky）。section の高さぶんスクロールするあいだに、スタートからゴールまで進む
 * - JS が動かない・reduced-motion のときは、最初から全部塗られて3つとも見えている
 */

/** コース（viewBox 600×500）。右へ → 折り返して左へ → 折り返して右へ */
const COURSE = "M40 70H400a90 90 0 0 1 0 180H200a90 90 0 0 0 0 180H560";

/** at: コース全体を 0〜1 としたときの位置。x, y: viewBox の中での位置 */
const STEPS = [
  {
    at: 0.121,
    x: 220,
    y: 70,
    sticker: "step-read",
    en: "Read",
    title: "読む",
    body: "まずは、気になるコーチのインタビューを一本。",
    // 文章を置く向き
    side: "below-right",
  },
  {
    at: 0.5,
    x: 300,
    y: 250,
    sticker: "step-compare",
    en: "Compare",
    title: "比べる",
    body: "迷ったら、何人かの教え方やレッスンの進め方を読み比べる。",
    side: "below-right",
  },
  {
    at: 0.946,
    x: 480,
    y: 430,
    sticker: "step-try",
    en: "Try",
    title: "体験に行く",
    body: "会ってみたいコーチが決まったら、各ページから申し込めます。",
    // 2つ目の文章と重ならないように、コースの下側に置く
    side: "below-left",
  },
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

export function CourseMap() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<SVGPathElement>(null);
  const runner = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = section.current;
    const path = line.current;
    const shoe = runner.current;
    if (!root || !path || !shoe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const total = path.getTotalLength();
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      // 最初と最後に少し「ため」をつくる
      const t = clamp((p - 0.06) / 0.82);
      path.style.strokeDashoffset = String(1 - t);
      const at = path.getPointAtLength(total * t);
      shoe.style.left = pct(at.x, 600);
      shoe.style.top = pct(at.y, 500);
      // 走っているあいだ、小さく弾む
      shoe.style.transform = `translate(-50%, ${-62 - Math.abs(Math.sin(t * 60)) * 10}%) rotate(${(Math.sin(t * 60) * 6).toFixed(1)}deg)`;
      steps.forEach((el) => (el.dataset.on = String(t >= STEPS[Number(el.dataset.step)].at - 0.015)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="course-title" className="relative h-[260svh] bg-mist md:h-[300svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16 md:pt-[4.5rem]">
        <div className="container-page grid w-full gap-6 md:grid-cols-12 md:items-center md:gap-10">
          <div className="md:col-span-5" data-reveal-group>
            <span className="eyebrow" data-reveal="fade">
              How to read
            </span>
            <RevealTitle id="course-title" lines={["読んで、比べて、", "体験に行く。"]} className="title-display mt-4 md:mt-6" />
          </div>

          <div className="md:col-span-7">
            {/* 中の大きさはすべて地図の幅に対する割合（cqw）。画面が低くて地図が縮んでも、文字とステッカーが重ならない */}
            <div className="relative mx-auto aspect-[6/5] max-h-[38svh] w-full max-w-[44rem] [container-type:inline-size] md:max-h-[62svh]">
              <svg viewBox="0 0 600 500" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" fill="none" strokeLinecap="round">
                {/* まだ走っていないコース（白いレーン） */}
                <path d={COURSE} stroke="#17202a" strokeOpacity="0.08" strokeWidth="38" />
                <path d={COURSE} stroke="#fff" strokeWidth="32" />
                {/* 走ったところ（オレンジ）。JS が stroke-dashoffset を動かす */}
                <path ref={line} d={COURSE} pathLength={1} stroke="var(--color-accent)" strokeWidth="32" strokeDasharray="1" strokeDashoffset="0" />
                <path d={COURSE} stroke="#17202a" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="2 14" />
                {/* スタートとゴールの線 */}
                <path d="M40 52v36" stroke="#17202a" strokeWidth="4" />
                <path d="M560 412v36" stroke="#17202a" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="butt" />
              </svg>

              <ol className="absolute inset-0">
                {STEPS.map((s, i) => (
                  <li key={s.sticker} data-step={i} data-on="true" className="group absolute" style={{ left: pct(s.x, 600), top: pct(s.y, 500) }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/stickers/${s.sticker}.webp`}
                      alt=""
                      width={512}
                      height={512}
                      className="course-sticker absolute top-0 left-0 w-[17cqw] max-w-none -translate-x-1/2 -translate-y-1/2"
                    />
                    <div
                      className={`absolute hidden w-[36cqw] transition-[opacity,transform] duration-500 group-data-[on=false]:translate-y-2 group-data-[on=false]:opacity-0 md:block ${
                        s.side === "below-right" ? "top-[4.2cqw] left-[9.5cqw]" : "top-[5.5cqw] right-[9.5cqw] text-right"
                      }`}
                    >
                      <p className="eyebrow !text-[clamp(0.5rem,1.45cqw,0.625rem)]">
                        0{i + 1} — {s.en}
                      </p>
                      <h3 className="mt-[0.3cqw] text-[clamp(0.875rem,2.9cqw,1.25rem)] leading-[1.5]">{s.title}</h3>
                      <p className="mt-[0.4cqw] text-[clamp(0.625rem,1.85cqw,0.8125rem)] leading-[1.75] text-sub">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* コースを走る靴。JS なしではゴールにいる */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={runner}
                src="/images/stickers/running.webp"
                alt=""
                width={512}
                height={512}
                className="pointer-events-none absolute w-[11cqw] max-w-none drop-shadow-[0_6px_8px_rgb(0_0_0/0.25)]"
                style={{ left: pct(560, 600), top: pct(430, 500), transform: "translate(-50%, -62%)" }}
              />
            </div>

            {/* スマホ：地図の上に文章を置く場所がないので、下に3行で。通ったものから濃くなる */}
            <ol className="mt-5 space-y-3 md:hidden">
              {STEPS.map((s, i) => (
                <li
                  key={s.sticker}
                  data-step={i}
                  data-on="true"
                  className="flex items-baseline gap-3 transition-opacity duration-500 data-[on=false]:opacity-25"
                >
                  <span className="font-display text-sm font-black text-accent">0{i + 1}</span>
                  <span>
                    <span className="font-display text-[0.9375rem] font-bold">{s.title}</span>
                    <span className="block text-[0.75rem] leading-[1.7] text-sub">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
