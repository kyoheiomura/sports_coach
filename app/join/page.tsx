import { TextPage } from "@/components/TextPage";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "掲載を希望するコーチの方へ（取材のご案内）",
  description: `${SITE.name}での取材・掲載を希望するスポーツコーチの方へのご案内です。`,
  path: "/join/",
});

export default function JoinPage() {
  return (
    <TextPage
      crumbs={[{ href: "/join/", label: "掲載を希望するコーチの方へ" }]}
      title="掲載を希望するコーチの方へ"
      lead={<p>読んだ人が「自分に合うコーチ」を見つけられるように、教え方と人柄を、ご本人の言葉で届けたいと考えています。</p>}
    >
      <section aria-labelledby="who">
        <h2 id="who">取材をお願いしたい方</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>個人レッスン、スクール、クラブチームなどで、スポーツを教えている方。</li>
          <li>種目や、教えている相手の年齢・レベルは問いません。選手としての実績も問いません。</li>
        </ul>
      </section>

      <section aria-labelledby="flow">
        <h2 id="flow">取材の流れ</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>お問い合わせフォームからご連絡ください。種目と教えている場所、ご連絡先をお書き添えください。</li>
          <li>事前に、比較項目の質問シートにお答えいただきます。すべてのコーチに同じ項目を伺っています。</li>
          <li>お話を伺い、原稿にまとめます。進め方はご相談のうえで決めます。</li>
          <li>原稿をご確認いただいてから公開します。</li>
        </ol>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">ご連絡先</h2>
        <p>
          <a href={SITE.contactUrl} target="_blank" rel="noopener" className="link">
            お問い合わせフォーム<span aria-hidden="true">↗</span>
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </p>
      </section>
    </TextPage>
  );
}
