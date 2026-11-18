/** 「特徴・こだわり」の絞り込み条件。検索パネルと一覧の両方で使う */
import type { CoachSummary } from "@/lib/view";

export const CONDITIONS = [
  { key: "private", label: "マンツーマンで習える", test: (s: CoachSummary) => s.formats.includes("マンツーマン") },
  { key: "calm", label: "おだやかに見守る", test: (s: CoachSummary) => s.tone === "おだやかに見守る" },
  { key: "logic", label: "理屈から知りたい", test: (s: CoachSummary) => s.tone === "理屈からていねいに" },
  { key: "video", label: "動画で振り返る", test: (s: CoachSummary) => s.feedback === "動画で一緒に振り返る" },
  { key: "female", label: "女性のコーチ", test: (s: CoachSummary) => s.gender === "女性" },
  { key: "watch", label: "保護者が見学できる", test: (s: CoachSummary) => s.features.includes("保護者の見学可") },
  { key: "weekend", label: "土日に習える", test: (s: CoachSummary) => s.weekend },
  { key: "evening", label: "19時以降も習える", test: (s: CoachSummary) => s.evening },
  { key: "morning", label: "朝7時までに始められる", test: (s: CoachSummary) => s.morning },
] as const;
