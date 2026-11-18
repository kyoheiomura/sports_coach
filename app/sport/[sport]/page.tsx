import Link from "next/link";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/ListPage";
import { AREA_INDEX_MIN } from "@/data/site";
import { pageMeta } from "@/lib/meta";
import { coachesOfSport, getAllSports } from "@/lib/sports-index";
import { toSummary } from "@/lib/view";

type Props = { params: Promise<{ sport: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // まだ取材していない種目のページも作る（「これから取材します」と出す。少ないうちは noindex）
  return getAllSports().map((s) => ({ sport: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { sport: sportSlug } = await params;
  const sport = getAllSports().find((s) => s.slug === sportSlug);
  if (!sport) return {};
  return pageMeta({
    title: `${sport.label}のコーチを探す`,
    description: `${sport.label}を教えるコーチのインタビュー。教え方と人柄を、コーチ本人の言葉で紹介しています。`,
    path: `/sport/${sport.slug}/`,
    // 薄いページを増やさないため、少ないうちはインデックスさせない
    noindex: sport.count < AREA_INDEX_MIN,
  });
}

export default async function SportPage({ params }: Props) {
  const { sport: sportSlug } = await params;
  const sport = getAllSports().find((s) => s.slug === sportSlug);
  if (!sport) notFound();
  return (
    <ListPage
      crumbs={[
        { href: "/sport/", label: "種目から探す" },
        { href: `/sport/${sport.slug}/`, label: sport.label },
      ]}
      title={`${sport.label}のコーチ`}
      lead={
        <p>
          {sport.lead ?? `${sport.label}を教えるコーチたちです。`}
          指導の仕方も考え方も、コーチによってさまざまです。それぞれのインタビューで確かめてください。
        </p>
      }
      people={coachesOfSport(sport.slug).map(toSummary)}
    >
      {sport.count === 0 && (
        <div className="card mt-12 p-8 text-center">
          <p className="font-bold">{sport.label}のコーチは、これから取材します。</p>
          <p className="mt-2 text-sm text-sub">
            <Link href="/coach/" className="link">
              ほかの種目のコーチを見る
            </Link>
          </p>
        </div>
      )}
    </ListPage>
  );
}
