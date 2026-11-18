import { SITE } from "@/data/site";

/**
 * ロゴ：笛のしるし＋欧文の「WHISTLE」（斜体のコンデンス体）＋小さなカタカナ＋何のメディアかの一言。
 * 読み上げは外側のリンクの aria-label が担当するので、ここは飾りとして扱う。
 */
export function Logo({ size = "md", invert = false }: { size?: "md" | "lg"; invert?: boolean }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-2 ${invert ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 24 24" className={`shrink-0 ${size === "lg" ? "h-9 w-9" : "h-6 w-6 md:h-7 md:w-7"} ${invert ? "text-accent-bright" : "text-accent"}`}>
        {/* 笛：丸い胴と吹き口、まん中の穴、上に鳴っている音の線 */}
        <path d="M9.2 8.3H22.5v4.8h-6.9A6.6 6.6 0 1 1 9.2 8.3Z" fill="currentColor" />
        <circle cx="9.2" cy="14.8" r="2.3" fill={invert ? "#141d27" : "#fff"} />
        <path d="M5.2 5.3 3.8 3.2M9 4.3V1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
      <span className={`font-logo leading-none font-extrabold tracking-[0.02em] uppercase italic ${size === "lg" ? "text-[2.75rem]" : "text-[1.625rem] md:text-[1.875rem]"}`}>
        {SITE.nameEn}
      </span>
      <span className={`ml-1 hidden self-end pb-[0.2em] text-[0.625rem] font-medium tracking-[0.18em] sm:inline ${invert ? "text-white/60" : "text-sub"}`}>
        {SITE.name}
      </span>
      {/* 何のメディアかの一言。幅に余裕があるときだけ出す */}
      <span className={`ml-2 hidden self-end pb-[0.2em] text-[0.6875rem] font-medium tracking-[0.08em] whitespace-nowrap lg:inline ${invert ? "text-white/60" : "text-sub"}`}>
        ー {SITE.descriptor} ー
      </span>
    </span>
  );
}
