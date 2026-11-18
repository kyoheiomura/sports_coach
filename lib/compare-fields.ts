/**
 * 個別ページ「〇〇さんの教え方」に載せる項目の並びと書き方（components/CompareFieldsList.tsx）。
 * kind: short = 短い値／long = 文章／list = 箇条書き
 * 値に優劣の色付けはしない。
 */
import type { CoachCompareData } from "@/lib/view";

export type FieldValue = string | string[];
export type CompareField = {
  key: string;
  label: string;
  kind: "short" | "long" | "list";
  get: (d: CoachCompareData) => FieldValue;
};
export type CompareGroup = { key: string; label: string; fields: CompareField[] };

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    key: "person",
    label: "人",
    fields: [
      { key: "sports", label: "種目", kind: "short", get: (d) => d.sportsLabel },
      {
        key: "qualifications",
        label: "指導者資格",
        kind: "list",
        get: (d) => (d.qualifications.length ? d.qualifications : ["特になし"]),
      },
      { key: "years", label: "指導歴", kind: "short", get: (d) => `${d.years}年` },
      { key: "why", label: "コーチになったきっかけ", kind: "long", get: (d) => d.compare.why },
    ],
  },
  {
    key: "belief",
    label: "考え",
    fields: [
      { key: "belief", label: "いちばん大切にしていること", kind: "long", get: (d) => d.compare.belief },
      { key: "approach", label: "「できない」への向き合い方", kind: "long", get: (d) => d.compare.approach },
      { key: "message", label: "メッセージ", kind: "long", get: (d) => `「${d.compare.message}」` },
      { key: "notFor", label: "ほかを勧めることがあるケース", kind: "long", get: (d) => d.compare.notFor },
    ],
  },
  {
    key: "lesson",
    label: "教え方",
    fields: [
      { key: "feature", label: "教え方の特徴", kind: "long", get: (d) => d.compare.feature },
      { key: "targets", label: "教えている相手", kind: "list", get: (d) => d.compare.targets },
      { key: "tone", label: "教えるときの温度感", kind: "short", get: (d) => d.compare.tone },
      { key: "feedback", label: "伝え方の中心", kind: "short", get: (d) => d.compare.feedback },
      { key: "formats", label: "レッスンの形", kind: "list", get: (d) => d.compare.formats },
      { key: "methods", label: "練習で使うもの", kind: "list", get: (d) => d.compare.methods },
      { key: "explanation", label: "練習のねらいの伝え方", kind: "long", get: (d) => d.compare.explanation },
      {
        key: "firstLesson",
        label: "初回の時間",
        kind: "short",
        get: (d) => `聞き取り${d.compare.firstLesson.hearingMin}分＋練習${d.compare.firstLesson.practiceMin}分`,
      },
      { key: "pace", label: "通うペースの考え方", kind: "long", get: (d) => d.compare.pace },
      {
        key: "homework",
        label: "自主練習の提案",
        kind: "short",
        get: (d) => (d.compare.homework ? "あり" : "なし"),
      },
      { key: "goals", label: "よく受ける相談", kind: "list", get: (d) => d.compare.goalLabels },
    ],
  },
  {
    key: "access",
    label: "通いやすさ",
    fields: [
      { key: "venue", label: "教えている場所", kind: "list", get: (d) => d.venues.map((c) => c.name) },
      {
        key: "area",
        label: "エリア・最寄り駅",
        kind: "long",
        get: (d) => d.venues.map((c) => `${c.area}　${c.stations}`),
      },
      { key: "hours", label: "レッスンの時間帯", kind: "long", get: (d) => d.venues.map((c) => c.hours) },
      {
        key: "features",
        label: "設備・対応",
        kind: "list",
        get: (d) => (d.features.length ? d.features : ["特になし"]),
      },
      { key: "gender", label: "コーチの性別", kind: "short", get: (d) => d.gender ?? "非公開" },
      {
        key: "price",
        label: "料金（税込）",
        kind: "long",
        get: (d) =>
          [
            `体験レッスン ${yen(d.compare.price.trial)}`,
            `通常 1回 ${yen(d.compare.price.regular)}`,
            d.compare.price.note,
          ].filter((v): v is string => Boolean(v)),
      },
    ],
  },
];
