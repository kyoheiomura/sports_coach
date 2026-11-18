import Link from "next/link";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/ListPage";
import { AREA_INDEX_MIN } from "@/data/site";
import { getAllPrefs, coachesInPref } from "@/lib/areas-index";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

type Props = { params: Promise<{ pref: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // 47都道府県すべてのページを作る（まだ取材していない県は「これから取材します」と出す。少ないうちは noindex）
  return getAllPrefs().map((p) => ({ pref: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { pref: prefSlug } = await params;
  const pref = getAllPrefs().find((p) => p.slug === prefSlug);
  if (!pref) return {};
  return pageMeta({
    title: `${pref.name}のスポーツコーチ`,
    description: `${pref.name}のスポーツコーチのインタビュー。教え方と人柄から、習う相手を選べます。`,
    path: `/area/${pref.slug}/`,
    noindex: pref.count < AREA_INDEX_MIN,
  });
}

export default async function PrefPage({ params }: Props) {
  const { pref: prefSlug } = await params;
  const pref = getAllPrefs().find((p) => p.slug === prefSlug);
  if (!pref) notFound();
  return (
    <ListPage
      crumbs={[
        { href: "/area/", label: "エリアから探す" },
        { href: `/area/${pref.slug}/`, label: pref.name },
      ]}
      title={`${pref.name}のコーチ`}
      lead={pref.count > 0 ? <p>{pref.name}で話を聞いたスポーツコーチは{pref.count}人です（新着順）。</p> : <p>{pref.name}のスポーツコーチを紹介するページです。</p>}
      people={coachesInPref(pref.slug).map(toSummary)}
    >
      <ul className="mt-8 flex flex-wrap gap-2">
        {pref.cities.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/area/${pref.slug}/${c.slug}/`}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink"
            >
              {c.name}
              <span className="ml-1 text-sub">（{c.count}）</span>
            </Link>
          </li>
        ))}
      </ul>
      {pref.count === 0 && (
        <div className="card mt-4 p-8 text-center">
          <p className="font-bold">{pref.name}のコーチは、これから取材します。</p>
          <p className="mt-2 text-sm text-sub">
            <Link href="/coach/" className="link">
              ほかのエリアのコーチを見る
            </Link>
          </p>
        </div>
      )}
    </ListPage>
  );
}
