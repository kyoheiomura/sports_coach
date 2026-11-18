import Link from "next/link";
import { getRegions } from "@/lib/areas-index";

/**
 * 47都道府県の一覧。地方ごとに見出しを立てて、都道府県のボタンを並べる。
 * 取材したコーチがいる県には人数を出し、その下に市区町村のリンクを添える。まだいない県は薄く見せる。
 * 並びは都道府県コード順（北から南）。
 */
export function AreaLinks({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="divide-y divide-line border-y border-line">
      {getRegions().map((region) => (
        <section key={region.key} aria-labelledby={`region-${region.key}`} className="grid gap-3 py-5 md:grid-cols-[12rem_1fr] md:gap-8 md:py-8">
          <Heading id={`region-${region.key}`} className="font-sans text-[0.8125rem] font-bold tracking-[0.08em] text-sub md:pt-3">
            {region.label}
          </Heading>
          <div>
            <ul className="flex flex-wrap gap-2">
              {region.prefs.map((pref) => (
                <li key={pref.slug}>
                  <Link
                    href={`/area/${pref.slug}/`}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] font-bold sm:min-h-11 sm:px-4 sm:text-sm transition-colors hover:border-accent hover:text-accent ${
                      pref.count ? "border-ink/25 bg-paper" : "border-line text-sub"
                    }`}
                  >
                    {pref.name}
                    {pref.count > 0 && (
                      <span className="font-display text-xs font-black text-accent">
                        {pref.count}
                        <span className="sr-only">人</span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            {/* 取材したコーチがいる市区町村 */}
            {region.prefs
              .filter((pref) => pref.cities.length > 0)
              .map((pref) => (
                <p key={pref.slug} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem]">
                  <span className="font-bold text-sub">{pref.name}</span>
                  {pref.cities.map((city) => (
                    <Link key={city.slug} href={`/area/${pref.slug}/${city.slug}/`} className="link">
                      {city.name}（{city.count}）
                    </Link>
                  ))}
                </p>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
