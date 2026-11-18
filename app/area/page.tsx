import { AreaLinks } from "@/components/AreaLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "エリアからスポーツコーチを探す",
  description: "取材したスポーツコーチを、都道府県・市区町村から探せます。",
  path: "/area/",
});

export default function AreaIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/area/", label: "エリアから探す" }]} />
      <div className="container-page pt-14 md:pt-24">
        <h1 className="heading-bar text-[2rem] md:text-[3rem]">エリアから探す</h1>
        <p className="container-text mt-4 text-sub">数字は、話を聞いたコーチの人数です。数字のない都道府県は、これから取材します。</p>
        <div className="mt-12">
          <AreaLinks headingLevel="h2" />
        </div>
      </div>
    </>
  );
}
