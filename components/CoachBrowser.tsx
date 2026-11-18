"use client";

/**
 * コーチ一覧の絞り込みと並び替え。並び順は「新着順」と「エリア順」の2つだけ。
 * 条件は URL のクエリに残す（トップの検索パネルからも同じパラメータで来る）。
 * 最初の描画は条件なし＝静的 HTML と同じ。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { CoachCard } from "@/components/CoachCard";
import { CheckIcon, SlidersIcon } from "@/components/icons";
import { PAGE_SIZE } from "@/data/site";
import { GOALS, SPORTS } from "@/data/vocab";
import { CONDITIONS } from "@/lib/conditions";
import type { CoachSummary } from "@/lib/view";

type AreaOption = { slug: string; name: string; cities: { slug: string; name: string }[] };
type Sort = "new" | "area";
type Filters = {
  sports: string[];
  pref: string;
  city: string;
  goals: string[];
  conds: string[];
  q: string;
  sort: Sort;
};

const EMPTY: Filters = { sports: [], pref: "", city: "", goals: [], conds: [], q: "", sort: "new" };

function fromQuery(q: URLSearchParams): Filters {
  const list = (k: string) => q.getAll(k).flatMap((v) => v.split(",")).filter(Boolean);
  // 検索パネルは area=tokyo/setagaya の形で送ってくる
  const [areaPref, areaCity] = (q.get("area") ?? "").split("/");
  return {
    sports: list("sport"),
    pref: q.get("pref") || areaPref || "",
    city: q.get("city") || areaCity || "",
    goals: list("goal"),
    conds: list("cond"),
    q: q.get("q")?.trim() ?? "",
    sort: q.get("sort") === "area" ? "area" : "new",
  };
}

function toQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.sports.length) q.set("sport", f.sports.join(","));
  if (f.pref) q.set("pref", f.pref);
  if (f.city) q.set("city", f.city);
  if (f.goals.length) q.set("goal", f.goals.join(","));
  if (f.conds.length) q.set("cond", f.conds.join(","));
  if (f.q) q.set("q", f.q);
  if (f.sort !== "new") q.set("sort", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const norm = (s: string) => s.normalize("NFKC").toLowerCase();

export function CoachBrowser({ people, areas }: { people: CoachSummary[]; areas: AreaOption[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const panel = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setF(fromQuery(new URLSearchParams(window.location.search)));
    // 「さらに条件で絞り込む」から来たら絞り込みを開いておく
    if (window.location.hash === "#filters" && panel.current) panel.current.open = true;
  }, []);

  const update = (next: Filters) => {
    setF(next);
    setLimit(PAGE_SIZE);
    window.history.replaceState(null, "", `${window.location.pathname}${toQuery(next)}${window.location.hash}`);
  };

  const results = useMemo(() => {
    const words = norm(f.q).split(/\s+/).filter(Boolean);
    const filtered = people.filter(
      (s) =>
        (!f.sports.length || f.sports.some((t) => s.sports.includes(t))) &&
        (!f.pref || s.prefSlug === f.pref) &&
        (!f.city || s.citySlugs.includes(f.city)) &&
        (!f.goals.length || f.goals.some((c) => s.goals.includes(c))) &&
        f.conds.every((k) => CONDITIONS.find((c) => c.key === k)?.test(s) ?? true) &&
        words.every((w) => norm(s.searchText).includes(w)),
    );
    // people は新着順で渡ってくる。エリア順は地域コード順で、同じ地域の中は新着順
    return f.sort === "area" ? [...filtered].sort((a, b) => a.areaCode - b.areaCode) : filtered;
  }, [people, f]);

  const pref = areas.find((a) => a.slug === f.pref);
  const chips = [
    ...(f.q ? [{ label: `「${f.q}」`, remove: { ...f, q: "" } }] : []),
    ...f.sports.map((t) => ({ label: SPORTS.find((x) => x.slug === t)?.label ?? t, remove: { ...f, sports: toggle(f.sports, t) } })),
    ...(f.city && pref
      ? [{ label: pref.cities.find((c) => c.slug === f.city)?.name ?? f.city, remove: { ...f, city: "" } }]
      : f.pref && pref
        ? [{ label: pref.name, remove: { ...f, pref: "" } }]
        : []),
    ...f.goals.map((c) => ({
      label: GOALS.find((x) => x.slug === c)?.label ?? c,
      remove: { ...f, goals: toggle(f.goals, c) },
    })),
    ...f.conds.map((k) => ({
      label: CONDITIONS.find((c) => c.key === k)?.label ?? k,
      remove: { ...f, conds: toggle(f.conds, k) },
    })),
  ];

  return (
    <div>
      <div className="border-y border-line py-4">
        <details ref={panel} id="filters" className="group mt-3 scroll-mt-24">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-1 text-sm font-bold text-accent [&::-webkit-details-marker]:hidden">
            <SlidersIcon size={18} />
            さらに条件で絞り込む
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="mt-3 grid gap-6 border-t border-line pt-5 md:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-bold text-sub">種目</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {SPORTS.map((v) => (
                  <CheckChip key={v.slug} checked={f.sports.includes(v.slug)} onChange={() => update({ ...f, sports: toggle(f.sports, v.slug) })}>
                    {v.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-bold text-sub">エリア</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label>
                  <span className="sr-only">都道府県</span>
                  <select value={f.pref} onChange={(e) => update({ ...f, pref: e.target.value, city: "" })} className="field">
                    <option value="">都道府県</option>
                    {areas.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">市区町村</span>
                  <select
                    value={f.city}
                    disabled={!pref}
                    onChange={(e) => update({ ...f, city: e.target.value })}
                    className="field disabled:text-sub disabled:opacity-60"
                  >
                    <option value="">市区町村</option>
                    {pref?.cities.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="md:col-span-2">
              <legend className="text-xs font-bold text-sub">相談したいこと（よく受ける相談）</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {GOALS.map((c) => (
                  <CheckChip
                    key={c.slug}
                    checked={f.goals.includes(c.slug)}
                    onChange={() => update({ ...f, goals: toggle(f.goals, c.slug) })}
                  >
                    {c.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="md:col-span-2">
              <legend className="text-xs font-bold text-sub">特徴・こだわり</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <CheckChip key={c.key} checked={f.conds.includes(c.key)} onChange={() => update({ ...f, conds: toggle(f.conds, c.key) })}>
                    {c.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>
          </div>
        </details>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="font-bold">
          <span className="font-display text-2xl font-black text-accent">{results.length}</span>人のコーチ
        </p>
        <fieldset className="flex items-center gap-1 rounded-full bg-mist p-1 text-sm">
          <legend className="sr-only">並び順</legend>
          {(
            [
              ["new", "新着順"],
              ["area", "エリア順"],
            ] as const
          ).map(([v, label]) => (
            <label
              key={v}
              className={`cursor-pointer rounded-full px-4 py-1.5 font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${
                f.sort === v ? "bg-paper text-accent shadow-sm" : "text-sub hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value={v}
                checked={f.sort === v}
                onChange={() => update({ ...f, sort: v })}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => update(c.remove)}
              className="inline-flex min-h-9 items-center gap-1 rounded-full bg-accent-soft px-3 font-bold text-accent-deep hover:bg-[#fadfce]"
            >
              {c.label}
              <span aria-hidden="true">×</span>
              <span className="sr-only">の条件を外す</span>
            </button>
          ))}
          <button type="button" onClick={() => update({ ...EMPTY, sort: f.sort })} className="ml-1 text-sub underline">
            すべて外す
          </button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="font-bold">
            この条件では、まだ取材していません。
          </p>
          <p className="mt-2 text-sm text-sub">上の「×」で条件を1つ外してみてください。</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, limit).map((s, i) => (
            <li key={s.slug}>
              <CoachCard s={s} headingLevel="h2" priority={i < 2} />
            </li>
          ))}
        </ul>
      )}

      {results.length > limit && (
        <p className="mt-10 text-center">
          <button type="button" onClick={() => setLimit(limit + PAGE_SIZE)} className="btn-outline">
            もっと見る（残り{results.length - limit}人）
          </button>
        </p>
      )}
    </div>
  );
}

function CheckChip({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-full border px-3.5 text-[0.8125rem] font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        checked ? "border-accent bg-accent text-white" : "border-line bg-paper hover:border-accent"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {checked && <CheckIcon size={14} />}
      {children}
    </label>
  );
}
