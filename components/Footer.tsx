import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SITE } from "@/data/site";

const GROUPS = [
  {
    label: "さがす",
    links: [
      { href: "/coach/", label: "コーチをさがす" },
      { href: "/sport/", label: "種目からさがす" },
      { href: "/area/", label: "エリアからさがす" },
    ],
  },
  {
    label: "このサイトについて",
    links: [
      { href: "/join/", label: "掲載を希望するコーチの方へ" },
      { href: "/privacy/", label: "プライバシーポリシー" },
      { href: SITE.contactUrl, label: "お問い合わせ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-white md:mt-36">
      <div className="container-page grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <Logo size="lg" invert />
          <p className="mt-8 max-w-[26rem] font-display text-lg leading-[1.9] font-bold">
            {SITE.tagline.join("")}
            <br />
            教え方は、コーチの数だけ。
            <br />
            コーチ本人の言葉を、届けます。
          </p>
        </div>
        {GROUPS.map((g) => (
          <nav key={g.label} aria-label={`フッター（${g.label}）`} className="md:col-span-3">
            <p className="eyebrow !text-white/50">{g.label}</p>
            <ul className="mt-5 space-y-3 text-[0.8125rem]">
              {g.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("/") ? (
                    <Link href={l.href} className="text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} target="_blank" rel="noopener" className="text-white/80 hover:text-white">
                      {l.label}
                      <span aria-hidden="true"> ↗</span>
                      <span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page border-t border-white/15 py-6 text-[0.6875rem] text-white/50">
        © {SITE.name} {SITE.kind}
        <span className="ml-3">掲載料による表示順の変更はしていません</span>
      </div>
    </footer>
  );
}
