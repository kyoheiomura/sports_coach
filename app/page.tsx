import Image from "next/image";
import Link from "next/link";
import { CourseMap } from "@/components/CourseMap";
import { JsonLd } from "@/components/JsonLd";
import { RevealChars, RevealTitle } from "@/components/Reveal";
import { CoachGrid } from "@/components/CoachCard";
import { StickerField } from "@/components/StickerField";
import { SportDirectory } from "@/components/SportDirectory";
import { Screen, StickyScene } from "@/components/StickyScene";
import { ArrowRight } from "@/components/icons";
import { SITE } from "@/data/site";
import { getAllCoaches } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { seq } from "@/lib/reveal";
import { toSummary } from "@/lib/view";

/*
 * トップは、コンセプトを伝えて /coach/ に送り出すページ。探す機能は /coach/ に置く。
 * 冒頭は、いろいろな種目のステッカーを貼った面（StickerField）。
 * そのあとは、背景の写真を固定したまま文章が流れる場面（StickyScene）と、白い面を交互に置く。
 * 写真は顔の入らない手元・道具・練習場所だけ（public/images/）。
 */
export const metadata = pageMeta({ absoluteTitle: SITE.defaultTitle, path: "/" });

const PHOTO = {
  pilates: "/images/top/pilates.jpg",
  // 02 はいろいろな種目の道具を並べた写真（public/images/top/variety.jpg）に差し替える予定。できるまではコーンの写真
  variety: "/images/top/cones.jpg",
  golf: "/images/coach/kamei-shin-grip.jpg",
  cones: "/images/top/cones.jpg",
};

const BIG = "font-display text-[clamp(2rem,5vw,4rem)] leading-[1.5] font-black tracking-[0.04em]";

const HOW = [
  {
    no: "01",
    en: "Who they are.",
    title: "どんな人かが、わかる",
    body: "なぜ教える側に回ったのか。何を大切にしているのか。お聞きしたことを、本人の言葉のまま載せています。経歴の紹介ではなく、その人の考え方が伝わる記事です。",
    photo: PHOTO.pilates,
  },
  {
    no: "02",
    en: "Many ways to coach.",
    title: "指導の仕方も、考え方も、人それぞれ",
    body: "おだやかに見守る人もいれば、理屈からていねいに説明する人、熱く引っぱる人もいます。まず楽しむことを大事にする人も、技術をじっくり磨くことを大事にする人も。どれが正しいかではなく、どれが自分に合うかで選べます。",
    photo: PHOTO.variety,
  },
  {
    no: "03",
    en: "Find your fit.",
    title: "「自分に合いそう」が、会う前に見つかる",
    body: "どんな人に教えているのか。初回はどう進めるのか。通うペースをどう考えているのか。レッスンの様子を思い描きながら読めるので、体験に行く前から「この人に教わってみたい」が見つかります。",
    photo: PHOTO.golf,
  },
];

export default function Home() {
  const all = getAllCoaches();
  const latest = all.slice(0, 3).map(toSummary);

  return (
    <>
      {/* 場面1：種目のステッカーを貼った面。見出し → 宣言、の2画面。スクロールでステッカーが円陣を組む
          スマホは説明文とボタンを出さず、画面中央の見出しをステッカーが上下から囲む */}
      <StickyScene background={<StickerField />}>
        <Screen group className="max-lg:items-center max-lg:pb-[calc(6rem+4rem)] max-lg:text-center">
          <span className="eyebrow !text-white/70" data-reveal="fade" style={seq(0)}>
            Interview media for sports coaches
          </span>
          <RevealChars
            as="h1"
            lines={[...SITE.tagline]}
            accent={SITE.taglineAccent}
            className="mt-5 font-display text-[clamp(2.25rem,7.9vw,5rem)] lg:mt-8 leading-[1.4] font-black tracking-[0.05em] [text-shadow:0_2px_24px_rgb(10_16_24/0.4)]"
            style={seq(1)}
          />
          <p className="mt-6 max-w-[32rem] text-[0.875rem] max-lg:hidden leading-[2] text-white/85 md:text-base lg:mt-10 lg:leading-[2.1]" data-reveal="fade" style={seq(7)}>
            教え方は、コーチの数だけあります。{SITE.name}は、コーチ本人へのインタビューで教え方と人柄を届けるメディア。読んで、比べて、あなたに合う一人を見つけてください。
          </p>
          <div className="mt-7 flex flex-wrap items-center max-lg:hidden gap-x-5 gap-y-4 sm:gap-x-8 lg:mt-10" data-reveal="fade" style={seq(9)}>
            <Link href="/coach/" className="btn-primary !bg-white !text-ink hover:!bg-accent-soft">
              コーチをさがす
            </Link>
            <a href="#purpose" className="link-quiet text-white/85">
              このサイトについて
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Screen>
        <Screen group mobileStart>
          <span id="purpose" className="eyebrow scroll-mt-32 !text-accent-bright" data-reveal="fade">
            Our purpose
          </span>
          <RevealTitle lines={["どの種目にも、", "あなたに合う", "コーチがいる。"]} className={`mt-8 ${BIG}`} />
        </Screen>
      </StickyScene>

      {/* 墨色の面：このサイトの考え。冒頭の場面が流れ去ったあとに、ふつうの速さで読める */}
      <section aria-label="このサイトの考え" className="bg-navy pb-28 text-white md:pb-44">
        <div className="container-page">
          <span aria-hidden="true" className="block h-px w-full bg-white/15" data-reveal="line" />
          <div className="mt-20 grid gap-x-16 gap-y-12 md:mt-28 md:grid-cols-2">
            {[
              ["コーチが100人いれば、", "教え方も、向き合い方も、100通りあります。"],
              ["どの教え方が合うかは、", "会ってみるまで分かりにくいものです。"],
              ["だから、会う前に読めるように、", "コーチ本人の言葉を載せています。"],
              ["「この人に教わりたい」で選ばれる出会いを、", "ひとつずつ増やしていきます。"],
            ].map(([a, b], i) => (
              <p key={a} className="flex gap-5 text-[0.9375rem] leading-[2.2] text-white/90 md:text-[1.0625rem]" data-reveal="fade" style={seq(i % 2)}>
                <span className="mt-[0.35em] font-display text-sm font-black text-accent-bright">0{i + 1}</span>
                <span>
                  {a}
                  <br />
                  {b}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 白い面：インタビューを読むと分かること 01・02・03（手順は下の CourseMap が担当） */}
      <section aria-labelledby="how-title" className="bg-paper py-28 md:py-44">
        <div className="container-page">
          <span className="eyebrow" data-reveal="fade">
            What you’ll find
          </span>
          <RevealTitle id="how-title" lines={["会う前に、", "ここまでわかる。"]} className="title-display mt-6" />
          <ol className="mt-20 space-y-24 md:mt-32 md:space-y-40">
            {HOW.map((item, i) => (
              <li key={item.no} className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
                <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="relative aspect-[3/2] rounded-sm" data-reveal="photo">
                    <div className="photo-drift absolute inset-0">
                      <Image src={item.photo} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`} data-reveal-group>
                  <p className="flex items-baseline gap-4">
                    <span className="font-display text-4xl font-black text-accent md:text-5xl" data-reveal="rise">
                      <span className="reveal-ink">{item.no}</span>
                    </span>
                    <span className="eyebrow !normal-case !tracking-[0.12em]" data-reveal="fade">
                      {item.en}
                    </span>
                  </p>
                  <span aria-hidden="true" className="mt-5 block h-px w-full bg-accent/35" data-reveal="line" />
                  <RevealTitle as="h3" lines={[item.title]} className="mt-6 text-2xl md:text-[2rem]" />
                  <p className="mt-6 text-[0.9375rem] leading-[2.1] text-sub" data-reveal="fade">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 砂色の面：読み方の案内。スクロールでコースを走り、3つのチェックポイントを通る */}
      <CourseMap />

      {/* 白い面：新着インタビュー */}
      <section aria-labelledby="latest-title" className="bg-paper py-28 md:py-44">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow" data-reveal="fade">
                Interviews
              </span>
              <RevealTitle id="latest-title" lines={["新着インタビュー"]} className="title-display mt-5" />
            </div>
            <Link href="/coach/" className="link-quiet" data-reveal="fade">
              すべてのインタビューを見る
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-16 md:mt-24">
            <CoachGrid people={latest} />
          </div>
        </div>
      </section>

      {/* 砂色の面：種目から探す入口 */}
      <section aria-labelledby="find-title" className="bg-mist py-28 md:py-44">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow" data-reveal="fade">
                Find
              </span>
              <RevealTitle id="find-title" lines={["種目からさがす"]} className="title-display mt-5" />
            </div>
            <Link href="/coach/#filters" className="link-quiet" data-reveal="fade">
              エリアや相談したいことで絞り込む
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 md:mt-16">
            <SportDirectory />
          </div>
          <p className="mt-5 text-xs text-sub" data-reveal="fade">
            数字は、話を聞いたコーチの人数です。数字のない種目は、これから取材します。
          </p>
        </div>
      </section>

      {/* 場面3：ならんだコーン。読者への呼びかけ（サイト名のホイッスル＝はじまりの合図） */}
      <StickyScene src={PHOTO.cones}>
        <Screen align="center" group>
          <span className="eyebrow !text-accent-bright" data-reveal="fade">
            Kick off
          </span>
          <RevealTitle lines={["はじまりの笛を、", "鳴らそう。"]} className={`mt-8 ${BIG}`} />
          <p className="mt-10 max-w-[32rem] text-[0.9375rem] leading-[2.1] text-white/85" data-reveal="fade" style={seq(4)}>
            「この人に教わりたい」。そう思えたら、それがはじまりの合図です。あなたに、あるいはお子さんに合うコーチを、探してみてください。
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" data-reveal="fade" style={seq(6)}>
            <Link href="/coach/" className="btn-primary !min-h-12 !bg-white !px-9 !text-ink hover:!bg-accent-soft">
              コーチをさがす
            </Link>
          </div>
        </Screen>
      </StickyScene>

      {/* コーチ向けの案内は、いちばん下に小さく */}
      <section aria-label="コーチの方へ" className="bg-paper">
        <div className="container-page flex flex-col gap-4 border-b border-line py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.875rem] text-sub">
            <span className="eyebrow mb-1">For coaches</span>
            スポーツを教えている方へ。取材を受けていただけるコーチを探しています。
          </p>
          <Link href="/join/" className="link-quiet">
            掲載を希望するコーチの方へ
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          alternateName: `${SITE.name} ${SITE.kind}`,
          url: `${SITE.url}/`,
          description: SITE.description,
          inLanguage: "ja",
        }}
      />
    </>
  );
}
