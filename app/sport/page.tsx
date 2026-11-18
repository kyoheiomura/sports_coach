import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SportDirectory } from "@/components/SportDirectory";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "種目からスポーツコーチを探す",
  description: "取材したスポーツコーチを、サッカー・テニス・ヨガ・ピラティスなどの種目から探せます。",
  path: "/sport/",
});

export default function SportIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/sport/", label: "種目から探す" }]} />
      <div className="container-page pt-14 md:pt-24">
        <h1 className="heading-bar text-[2rem] md:text-[3rem]">種目から探す</h1>
        <p className="container-text mt-4 text-sub">数字は、話を聞いたコーチの人数です。数字のない種目は、これから取材します。</p>
        <div className="mt-12">
          <SportDirectory headingLevel="h2" />
        </div>
      </div>
    </>
  );
}
