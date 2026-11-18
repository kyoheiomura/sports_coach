import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchPanel } from "@/components/SearchPanel";
import { CoachBrowser } from "@/components/CoachBrowser";
import { getAreaTree } from "@/lib/areas-index";
import { getAllCoaches } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

export const metadata = pageMeta({
  title: "コーチを探す（スポーツコーチのインタビュー一覧）",
  description:
    "取材したスポーツコーチの一覧です。種目・エリア・相談したいことで絞り込んで、気になるコーチのインタビューを読めます。",
  path: "/coach/",
});

export default function CoachListPage() {
  const people = getAllCoaches().map(toSummary);
  const areas = getAreaTree().map((p) => ({
    slug: p.slug,
    name: p.name,
    cities: p.cities.map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return (
    <>
      <Breadcrumbs items={[{ href: "/coach/", label: "コーチを探す" }]} />
      <div className="container-page pb-8 pt-10 md:pt-14">
        <h1 className="heading-bar text-[2rem] md:text-[3rem]">コーチを探す</h1>
        <p className="mt-4 text-sub">
          {people.length}人のスポーツコーチに話を聞きました。気になるコーチから、読んでみてください。
        </p>
        <div className="mt-12 rounded-lg bg-mist p-6 md:p-10">
          <SearchPanel />
        </div>
        <div className="mt-12">
          <CoachBrowser people={people} areas={areas} />
        </div>
      </div>
    </>
  );
}
