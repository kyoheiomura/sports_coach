import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ListPage } from "@/components/ListPage";
import { SITE } from "@/data/site";
import { getAllVenues, getVenue, coachesOfVenue } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { areaOf, hoursLabel, stationLabel, toSummary } from "@/lib/view";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllVenues().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const c = getVenue((await params).slug);
  if (!c) return {};
  const area = areaOf(c);
  return pageMeta({
    title: `${c.name}（${area.label}）のコーチ`,
    description: `${area.fullLabel}の「${c.name}」で教えているコーチのインタビューと、場所・時間帯の情報です。`,
    path: `/venue/${c.slug}/`,
  });
}

const DAY_MAP = { 月: "Monday", 火: "Tuesday", 水: "Wednesday", 木: "Thursday", 金: "Friday", 土: "Saturday", 日: "Sunday" } as const;

export default async function VenuePage({ params }: Props) {
  const c = getVenue((await params).slug);
  if (!c) notFound();
  const area = areaOf(c);
  const people = coachesOfVenue(c.slug);

  return (
    <>
      <ListPage
        crumbs={[
          { href: `/area/${area.pref.slug}/${area.city.slug}/`, label: area.city.name },
          { href: `/venue/${c.slug}/`, label: c.name },
        ]}
        title={`${c.name}のコーチ`}
        lead={
          <p>
            {area.fullLabel}にあります。ここで教えているコーチのうち、話を聞いたのは{people.length}人。場所の情報は下にまとめています。
          </p>
        }
        people={people.map(toSummary)}
      />
      <section aria-labelledby="venue-info" className="container-page pt-20">
        <h2 id="venue-info" className="text-2xl md:text-3xl">
          場所の情報
        </h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {[
            ["場所", `${area.fullLabel}${c.address.line}${c.address.building ? ` ${c.address.building}` : ""}`],
            ["最寄り駅", stationLabel(c)],
            ["時間帯", hoursLabel(c) + (c.hoursNote ? `（${c.hoursNote}）` : "")],
            ["設備・対応", c.features.length ? c.features.join("・") : "特になし"],
            ["申し込み", [c.booking.phone && `電話 ${c.booking.phone}`, c.booking.url && "公式サイト", c.booking.line && "LINE"].filter(Boolean).join("／")],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 md:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-bold text-sub">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {c.booking.url && (
          <p className="mt-6">
            <a href={c.booking.url} target="_blank" rel="noopener" className="btn-outline">
              公式サイトで申し込み方法を見る<span aria-hidden="true">↗</span>
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </p>
        )}
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          name: c.name,
          url: `${SITE.url}/venue/${c.slug}/`,
          telephone: c.booking.phone,
          address: {
            "@type": "PostalAddress",
            addressCountry: "JP",
            addressRegion: area.pref.name,
            addressLocality: area.city.name,
            streetAddress: c.address.line,
          },
          openingHoursSpecification: c.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.filter((d) => d !== "祝").map((d) => DAY_MAP[d as keyof typeof DAY_MAP]),
            opens: h.open,
            closes: h.close,
          })),
          employee: people.map((s) => ({ "@type": "Person", name: s.name, url: `${SITE.url}/coach/${s.slug}/` })),
        }}
      />
    </>
  );
}
