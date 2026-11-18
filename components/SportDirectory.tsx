import Link from "next/link";
import { getSportGroups } from "@/lib/sports-index";

/**
 * 種目の一覧。分類ごとに見出しを立てて、ステッカー付きの小さなボタンを並べる。
 * トップと /sport/ で使う。まだ取材していない種目も載せる（人数を出さず、薄く見せる）。
 */
export function SportDirectory({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {getSportGroups().map((g) => (
        <section key={g.key} aria-labelledby={`sports-${g.key}`} className="grid gap-3 py-5 md:grid-cols-[12rem_1fr] md:gap-8 md:py-8" data-reveal="fade">
          <Heading id={`sports-${g.key}`} className="font-sans text-[0.8125rem] font-bold tracking-[0.08em] text-sub md:pt-4">
            {g.label}
          </Heading>
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {g.sports.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/sport/${s.slug}/`}
                  className={`group flex h-12 items-center gap-2 rounded-full border pr-3 pl-1 text-[0.75rem] leading-tight font-bold [word-break:auto-phrase] sm:inline-flex sm:h-14 sm:gap-2.5 sm:pr-5 sm:pl-1.5 sm:text-[0.9375rem] transition-colors hover:border-accent hover:text-accent ${
                    s.count ? "border-line bg-paper" : "border-transparent bg-paper/60 text-sub"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/stickers/${s.slug}.webp`}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    className={`h-10 w-10 shrink-0 transition-transform sm:h-11 sm:w-11 duration-300 group-hover:scale-110 group-hover:-rotate-6 ${s.count ? "" : "opacity-70"}`}
                  />
                  {s.label}
                  {s.count > 0 && (
                    <span className="font-display text-xs font-black text-accent">
                      {s.count}
                      <span className="sr-only">人</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
