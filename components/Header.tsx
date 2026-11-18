import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MenuIcon } from "@/components/icons";
import { SITE } from "@/data/site";

const NAV = [
  { href: "/", label: "TOP" },
  { href: "/coach/", label: "コーチをさがす" },
  { href: "/sport/", label: "種目から" },
  { href: "/area/", label: "エリアから" },
];

/** 細く静かなヘッダー。小さな文字のナビ */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link href="/" aria-label={`${SITE.name} ホーム`} className="shrink-0 py-2">
          <Logo />
        </Link>

        <nav aria-label="メイン" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.8125rem] font-medium tracking-[0.04em]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="py-2 hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* モバイル */}
        <details className="group md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full [&::-webkit-details-marker]:hidden">
            <span className="sr-only">メニュー</span>
            <MenuIcon size={22} />
          </summary>
          <nav aria-label="メイン" className="fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] bg-paper px-6 pt-4">
            <ul className="font-display text-xl font-bold">
              {NAV.map((n) => (
                <li key={n.href} className="border-b border-line">
                  <Link href={n.href} className="flex py-5">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="border-b border-line">
                <Link href="/join/" className="flex py-5 text-sub">
                  掲載を希望するコーチの方へ
                </Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
