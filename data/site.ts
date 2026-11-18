/** サイト名はここだけで決める。変えるときは NAME と NAME_EN を直せば全ページに反映される */
const NAME = "ホイッスル";
/** ロゴと OGP に使う欧文の表記 */
const NAME_EN = "WHISTLE";
const KIND = "スポーツコーチメディア";

export const SITE = {
  name: NAME,
  nameEn: NAME_EN,
  /** title の末尾などに添える種別 */
  kind: KIND,
  /** ロゴの横に添える、何のメディアかの一言 */
  descriptor: "あなたに最適なコーチが見つかるメディア",
  /** コンセプト。トップとフッター・OGP で使う */
  tagline: ["あなたに合った", "コーチと出会う。"],
  /** tagline のうち強調色にする部分 */
  taglineAccent: "あなたに合った",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://whistle-coach.example").replace(/\/$/, ""),
  /** トップの title。ほかのページは titleSuffix を付ける */
  defaultTitle: `${NAME}｜あなたに合ったコーチと出会う${KIND}`,
  titleSuffix: `｜${NAME} ${KIND}`,
  description:
    "ホイッスルは、スポーツコーチ一人ひとりを取材し、教え方と人柄を本人の言葉で届けるメディアです。インタビューと、教え方をまとめた項目から、あなたに合ったコーチを選べます。",
  /** お問い合わせ・取材の希望の窓口（運営会社のフォーム） */
  contactUrl: "https://0450.co.jp/contact",
  /** 掲載中のコーチ・場所がダミーのあいだは true。robots.txt で全面ブロックする */
  isDummyContent: true,
} as const;

/** 1ページに並べるコーチの数 */
export const PAGE_SIZE = 24;
/** エリアページ・種目ページをインデックスさせる最少人数 */
export const AREA_INDEX_MIN = 3;
