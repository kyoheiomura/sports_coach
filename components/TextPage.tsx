import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

/** 読み物ページ（about・ポリシーなど）の共通の形 */
export function TextPage({
  crumbs,
  title,
  lead,
  aside,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <div className="container-page pt-14 md:pt-24">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="heading-bar text-[2rem] md:text-[3rem]">{title}</h1>
            {lead && <div className="container-text mt-6 text-lg font-bold leading-relaxed md:text-xl">{lead}</div>}
          </div>
          {aside}
        </div>
        <div className="container-text mt-14 space-y-16 [&_h2]:text-xl md:[&_h2]:text-2xl [&_p]:mt-4 [&_ul]:mt-4">
          {children}
        </div>
      </div>
    </>
  );
}
