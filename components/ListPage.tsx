import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CoachGrid } from "@/components/CoachCard";
import type { CoachSummary } from "@/lib/view";

/** 種目別・エリア別・場所別など、条件が決まった静的な一覧ページの共通の形 */
export function ListPage({
  crumbs,
  title,
  lead,
  people,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lead: ReactNode;
  people: CoachSummary[];
  children?: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <div className="container-page pt-14 md:pt-24">
        <h1 className="heading-bar text-[2rem] md:text-[3rem]">{title}</h1>
        <div className="container-text mt-4 text-sub">{lead}</div>
        {children}
        <div className="mt-16 md:mt-24">
          <CoachGrid people={people} headingLevel="h2" priorityCount={2} />
        </div>
      </div>
    </>
  );
}
