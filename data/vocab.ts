/**
 * 比較項目で使う決まった語彙。自由入力にすると絞り込みと比較が崩れるので、増やすときはここに足す。
 */

/** 種目の分類。トップと /sport/ の一覧で、この順に見出しを立てる */
export const SPORT_GROUPS = [
  { key: "fit", label: "フィットネス・体づくり" },
  { key: "racket", label: "ゴルフ・ラケット" },
  { key: "ball", label: "球技" },
  { key: "run", label: "走る・泳ぐ・こぐ" },
  { key: "martial", label: "武道・格闘技" },
  { key: "action", label: "雪・波・アクション" },
] as const;

/**
 * 種目。slug は URL（/sport/[slug]/）とステッカーの画像名（public/images/stickers/<slug>.webp）に使うので、公開後は変えない。
 * lead は種目ページの冒頭の文。省くと「〇〇を教えるコーチたちです。」になる。
 * 並びは一覧・絞り込み・「〇〇コーチ」の表記の順になる。
 */
export type Sport = { slug: string; label: string; en: string; group: (typeof SPORT_GROUPS)[number]["key"]; lead?: string };
export const SPORTS: Sport[] = [
  { slug: "yoga", label: "ヨガ", en: "Yoga", group: "fit" },
  { slug: "pilates", label: "ピラティス", en: "Pilates", group: "fit" },
  { slug: "dance", label: "ダンス", en: "Dance", group: "fit" },
  { slug: "gymnastics", label: "体操", en: "Gymnastics", group: "fit" },

  { slug: "golf", label: "ゴルフ", en: "Golf", group: "racket", lead: "はじめてクラブを握る日から、スコアの壁まで。スイングと考え方を整理するコーチたちです。" },
  { slug: "tennis", label: "テニス", en: "Tennis", group: "racket", lead: "ラケットの握り方から、試合での組み立てまで。一球ずつ打ち方を一緒に見直すコーチたちです。" },
  { slug: "badminton", label: "バドミントン", en: "Badminton", group: "racket" },
  { slug: "table-tennis", label: "卓球", en: "Table tennis", group: "racket" },

  { slug: "soccer", label: "サッカー", en: "Soccer", group: "ball", lead: "ボールに触れる楽しさから、判断の速さまで。足もとの技術と見る力を育てるコーチたちです。" },
  { slug: "futsal", label: "フットサル", en: "Futsal", group: "ball" },
  { slug: "baseball", label: "野球", en: "Baseball", group: "ball", lead: "投げる・打つ・捕るの基本から、チームの中での役割まで。子どもにも大人にも教えるコーチたちです。" },
  { slug: "softball", label: "ソフトボール", en: "Softball", group: "ball" },
  { slug: "basketball", label: "バスケットボール", en: "Basketball", group: "ball" },
  { slug: "volleyball", label: "バレーボール", en: "Volleyball", group: "ball" },
  { slug: "handball", label: "ハンドボール", en: "Handball", group: "ball" },
  { slug: "rugby", label: "ラグビー", en: "Rugby", group: "ball" },

  { slug: "running", label: "ランニング", en: "Running", group: "run", lead: "走りはじめの一歩から、フルマラソンの記録づくりまで。フォームや練習の組み立てを一緒に考えるコーチたちです。" },
  { slug: "track-and-field", label: "陸上競技", en: "Track & field", group: "run" },
  { slug: "swimming", label: "水泳", en: "Swimming", group: "run", lead: "水に慣れるところから、四泳法、マスターズの大会まで。水の中での体の使い方を教えるコーチたちです。" },
  { slug: "cycling", label: "自転車", en: "Cycling", group: "run" },

  { slug: "judo", label: "柔道", en: "Judo", group: "martial" },
  { slug: "karate", label: "空手", en: "Karate", group: "martial" },
  { slug: "kendo", label: "剣道", en: "Kendo", group: "martial" },
  { slug: "boxing", label: "ボクシング", en: "Boxing", group: "martial" },

  { slug: "snowboard", label: "スキー・スノーボード", en: "Snow", group: "action" },
  { slug: "surfing", label: "サーフィン", en: "Surfing", group: "action" },
  { slug: "skateboard", label: "スケートボード", en: "Skateboard", group: "action" },
  { slug: "climbing", label: "クライミング", en: "Climbing", group: "action" },
  { slug: "figure-skating", label: "フィギュアスケート", en: "Figure skating", group: "action" },
];
export const SPORT_SLUGS = SPORTS.map((s) => s.slug) as [string, ...string[]];
export const findSport = (slug: string) => SPORTS.find((s) => s.slug === slug);
export const sportLabel = (slug: string) => findSport(slug)?.label ?? slug;

/** よく受ける相談。「できるようになること」とは書かない（上達を約束する表示になるため） */
export const GOALS = [
  { slug: "hajimete", label: "はじめてで不安" },
  { slug: "nigate", label: "運動に苦手意識がある" },
  { slug: "form", label: "フォームを見直したい" },
  { slug: "kiroku", label: "記録・スコアを伸ばしたい" },
  { slug: "shiai", label: "試合や大会に向けて" },
  { slug: "tsuzukanai", label: "ひとりだと続かない" },
  { slug: "saikai", label: "久しぶりに再開したい" },
  { slug: "kega", label: "ケガをしにくい体の使い方" },
  { slug: "kodomo", label: "子どもに合う教え方を探している" },
  { slug: "kenko", label: "健康のために続けたい" },
] as const;
export const GOAL_SLUGS = GOALS.map((g) => g.slug) as [string, ...string[]];
export const goalLabel = (slug: string) => GOALS.find((g) => g.slug === slug)?.label ?? slug;

/** 教えている相手 */
export const TARGETS = ["未就学児", "小学生", "中高生", "大人の初心者", "大人の経験者", "シニア"] as const;

/** 教え方の温度感。優劣ではなく相性の項目 */
export const TONES = ["おだやかに見守る", "理屈からていねいに", "熱く引っぱる", "相手に合わせる"] as const;
/** 伝え方の中心 */
export const FEEDBACKS = ["言葉で細かく伝える", "見本を見せる", "動画で一緒に振り返る", "問いかけて考えてもらう"] as const;
export const FORMATS = ["マンツーマン", "少人数（2〜4人）", "グループ"] as const;
export const ROLES = ["代表", "コーチ", "契約コーチ"] as const;

export const VENUE_KINDS = ["スクール", "個人レッスン", "クラブチーム", "レッスンスタジオ", "その他"] as const;
export const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日", "祝"] as const;
export const FEATURES = [
  "屋内",
  "駐車場",
  "用具の貸し出し",
  "更衣室・シャワー",
  "保護者の見学可",
  "出張レッスン",
  "オンライン相談",
  "英語対応",
] as const;
