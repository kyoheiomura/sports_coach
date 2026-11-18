import { COMPARE_GROUPS } from "@/lib/compare-fields";
import type { CoachCompareData } from "@/lib/view";

/** 個別ページの「このコーチの教え方」。すべてのコーチで同じ順・同じ言い回しで出す */
export function CompareFieldsList({ data }: { data: CoachCompareData }) {
  return (
    <div className="space-y-10">
      {COMPARE_GROUPS.map((g) => (
        <section key={g.key} id={`cf-${g.key}`} aria-labelledby={`cf-${g.key}-title`} className="scroll-mt-24">
          <h3
            id={`cf-${g.key}-title`}
            className="inline-flex rounded-full bg-accent-soft px-4 py-1 text-sm font-medium text-accent-deep"
          >
            {g.label}
          </h3>
          <dl className="mt-2 divide-y divide-line">
            {g.fields.map((f) => {
              const v = f.get(data);
              const values = Array.isArray(v) ? v : [v];
              return (
                <div key={f.key} className="grid gap-1 py-3.5 md:grid-cols-[13rem_1fr] md:gap-6">
                  <dt className="text-[0.8125rem] font-bold text-sub">{f.label}</dt>
                  <dd className="text-[0.9375rem]">
                    {f.kind === "list" ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {values.map((x) => (
                          <li key={x} className="rounded-full border border-line px-3 py-0.5 text-[0.8125rem]">
                            {x}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      values.map((x) => <p key={x}>{x}</p>)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
