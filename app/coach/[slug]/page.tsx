import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareFieldsList } from "@/components/CompareFieldsList";
import { JsonLd } from "@/components/JsonLd";
import { CoachGrid } from "@/components/CoachCard";
import { SITE } from "@/data/site";
import { findSport } from "@/data/vocab";
import { venuesOf, getAllCoaches, getCoach } from "@/lib/content";
import { chaptersOf, renderInterview } from "@/lib/mdx";
import { pageMeta } from "@/lib/meta";
import { areaOf, formatDate, formatMonth, formatYen, hoursLabel, sportsLabel, stationLabel, toCompareData, toSummary } from "@/lib/view";

/*
 * コーチの取材記事。上から、
 *   見出し（名前・場所・更新日）→ 写真 → 導入文 → 目次 → 章ごとの質問と答え
 *   → 教え方のまとめ → 教わるには（場所・料金・申し込み）
 * の順。記事が主役で、まとめと連絡先は読み終えたあとに置く。
 */
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCoaches().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = getCoach((await params).slug);
  if (!s) return {};
  const area = areaOf(venuesOf(s)[0]);
  return pageMeta({
    title: `${s.name}さんの取材記事（${sportsLabel(s.sports)}／${area.label}）`,
    description: s.lead ?? `${area.fullLabel}の${sportsLabel(s.sports)}、${s.name}さんの取材記事。${s.compare.belief}`,
    path: `/coach/${s.slug}/`,
    ogType: "article",
  });
}

export default async function CoachPage({ params }: Props) {
  const s = getCoach((await params).slug);
  if (!s) notFound();

  const venues = venuesOf(s);
  const main = areaOf(venues[0]);
  const data = toCompareData(s);
  const chapters = chaptersOf(s.body);
  const interview = await renderInterview(s.body);
  const sport = findSport(s.sports[0]);
  const station = venues[0].stations[0];

  // 「おすすめ」ではなく、同じ地域で話を聞いたコーチを新着順に
  const others = getAllCoaches().filter((o) => o.slug !== s.slug);
  const sameCity = others.filter((o) => toSummary(o).citySlugs.some((c) => data.citySlugs.includes(c)));
  const related = (sameCity.length ? sameCity : others.filter((o) => toSummary(o).prefSlug === main.pref.slug))
    .slice(0, 3)
    .map(toSummary);

  return (
    <>
      <Breadcrumbs
        items={[
          ...(sport ? [{ href: `/sport/${sport.slug}/`, label: sport.label }] : []),
          { href: `/coach/${s.slug}/`, label: `${s.name}さん` },
        ]}
      />

      <article className="container-page pt-10 md:pt-16">
        <div className="mx-auto max-w-[52rem]">
          <header>
            <p className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{data.sportsLabel}</span>
              {/* 有料掲載は必ず明示する。表示順には影響しない */}
              {s.listing === "paid" && <span className="badge">掲載プラン利用</span>}
            </p>
            <h1 className="heading-bar mt-3 text-[1.75rem] leading-[1.5] md:text-[2.5rem]">{s.name}さんの取材記事</h1>
            <p className="mt-3 text-[0.9375rem] font-bold">
              {venues.map((c) => c.name).join("／")}
              <span className="ml-2 text-[0.8125rem] font-normal text-sub">
                （{main.label}／{station.name}駅）
              </span>
            </p>
            <p className="mt-1 text-xs text-sub">最終更新日：{formatDate(s.updatedAt ?? s.publishedAt)}</p>
          </header>

          <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-xl bg-mist">
            <Image src={s.photo.src} alt={s.photo.alt} fill priority sizes="(min-width: 900px) 832px, 100vw" className="object-cover" />
          </div>

          <div className="mt-8 rounded-xl bg-mist p-6 md:p-8">
            <p className="font-display text-lg leading-[1.7] font-bold md:text-xl">
              <span className="-ml-[0.45em]">「</span>
              {s.catchphrase}」
            </p>
            {s.lead && <p className="mt-4 text-[0.9375rem] leading-[2]">{s.lead}</p>}
            <p className="mt-3 text-xs text-sub">
              （取材日 {formatDate(s.interviewedAt)}／聞き手 {s.interviewer}
              {s.photographer && `／撮影 ${s.photographer}`}）
            </p>
          </div>

          {chapters.length > 0 && (
            <nav aria-labelledby="toc" className="mt-6 rounded-xl border border-line p-6 md:p-8">
              <p id="toc" className="eyebrow">
                Contents
              </p>
              <ol className="mt-3 space-y-2">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="flex gap-3 text-[0.9375rem] font-bold [word-break:auto-phrase] hover:text-accent">
                      <span className="font-display font-black text-accent">{c.no}</span>
                      {c.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#fields" className="flex gap-3 text-[0.9375rem] font-bold [word-break:auto-phrase] hover:text-accent">
                    <span className="font-display font-black text-accent">—</span>
                    {s.name}さんの教え方・教わるには
                  </a>
                </li>
              </ol>
            </nav>
          )}

          <div className="interview mt-12 md:mt-16">{interview}</div>
          <div className="clear-both" />
        </div>

        <section id="fields" aria-labelledby="fields-title" className="scroll-mt-24 pt-24 md:pt-32">
          <h2 id="fields-title" className="heading-bar text-[1.5rem] md:text-[2rem]">
            {s.name}さんの教え方
          </h2>
          <p className="mt-3 text-[0.8125rem] text-sub">教えるときの温度感や伝え方、初回の進め方、通うペースの考え方など、会う前に知っておきたいことをまとめています。</p>
          <div className="card mt-6 p-5 md:p-10">
            <CompareFieldsList data={data} />
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-title" className="scroll-mt-24 pt-20 md:pt-28">
          <h2 id="visit-title" className="heading-bar text-[1.5rem] md:text-[2rem]">
            {s.name}さんに教わるには
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {venues.map((c, i) => (
              <section key={c.slug} aria-labelledby={`venue-${c.slug}`} className="card p-6 md:p-8">
                <h3 id={`venue-${c.slug}`} className="text-lg">
                  <Link href={`/venue/${c.slug}/`} className="hover:text-accent">
                    {c.name}
                  </Link>
                  {s.venues[i].days && <span className="badge ml-2 align-middle">{s.venues[i].days}に担当</span>}
                </h3>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <Row label="場所">
                    {areaOf(c).fullLabel}
                    {c.address.line}
                    {c.address.building && ` ${c.address.building}`}
                  </Row>
                  <Row label="最寄り駅">{stationLabel(c)}</Row>
                  <Row label="時間帯">
                    {hoursLabel(c)}
                    {c.hoursNote && <span className="block text-sub">{c.hoursNote}</span>}
                  </Row>
                  {i === 0 && (
                    <Row label="料金（税込）">
                      体験レッスン {formatYen(s.compare.price.trial)}／通常 1回 {formatYen(s.compare.price.regular)}
                      {s.compare.price.note && <span className="block text-sub">{s.compare.price.note}</span>}
                    </Row>
                  )}
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  {c.booking.url && (
                    <a href={c.booking.url} target="_blank" rel="noopener" className="btn-outline">
                      公式サイトで申し込み方法を見る<span aria-hidden="true">↗</span>
                      <span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  )}
                  {c.booking.phone && (
                    <a href={`tel:${c.booking.phone}`} className="btn-outline">
                      電話する（{c.booking.phone}）
                    </a>
                  )}
                  {c.booking.line && (
                    <a href={c.booking.line} target="_blank" rel="noopener" className="btn-outline">
                      LINEで問い合わせる<span aria-hidden="true">↗</span>
                      <span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  )}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-4 text-xs text-sub">体験や入会の申し込みは、それぞれの窓口で受け付けています。</p>
        </section>

        <footer className="pt-10">
          <div className="space-y-1.5 rounded-xl bg-mist p-5 text-xs leading-relaxed text-sub md:p-6">
            <p>掲載している情報は{formatMonth(s.verifiedAt)}に確認したものです。料金や時間帯は変わることがあります。</p>
            <p>上達の進み方には個人差があります。痛みや体調に不安があるときは無理をせず、医療機関に相談してください。</p>
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="container-page pt-24 md:pt-36">
          <h2 id="related" className="heading-bar text-[1.5rem] md:text-[2rem]">
            同じエリアで話を聞いたコーチ
          </h2>
          <div className="mt-6">
            <CoachGrid people={related} />
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${s.name}さんの取材記事「${s.catchphrase}」`,
          datePublished: s.publishedAt.toISOString(),
          dateModified: (s.updatedAt ?? s.publishedAt).toISOString(),
          image: `${SITE.url}${s.photo.src}`,
          inLanguage: "ja",
          author: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/` },
          publisher: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/` },
          mainEntityOfPage: `${SITE.url}/coach/${s.slug}/`,
          about: {
            "@type": "Person",
            name: s.name,
            jobTitle: sportsLabel(s.sports),
            hasCredential: s.qualifications.map((l) => ({ "@type": "EducationalOccupationalCredential", name: l })),
            worksFor: venues.map((c) => ({
              "@type": "SportsActivityLocation",
              name: c.name,
              url: `${SITE.url}/venue/${c.slug}/`,
            })),
          },
        }}
      />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3">
      <dt className="font-bold text-sub">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
