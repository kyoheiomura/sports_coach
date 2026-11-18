import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `ページが見つかりません${SITE.titleSuffix}` },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page py-24 md:py-32">
      <h1 className="heading-bar text-[2rem] md:text-[3rem]">ページが見つかりません</h1>
      <p className="mt-6 text-sub">移動したか、削除された可能性があります。</p>
      <Link href="/coach/" className="btn-primary mt-10">
        コーチを探す <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
