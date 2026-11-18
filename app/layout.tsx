import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DevFeedback } from "@/components/DevFeedback";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Intro, ScrollFx, SmoothScroll } from "@/components/Motion";
import { RevealProvider } from "@/components/Reveal";
import { SITE } from "@/data/site";
import { display, logo, sans } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.defaultTitle, template: `%s${SITE.titleSuffix}` },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${sans.variable} ${display.variable} ${logo.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-paper focus:px-4 focus:py-2 focus:font-bold"
        >
          本文へ移動
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealProvider />
        <SmoothScroll />
        <ScrollFx />
        <Intro />
        {process.env.NODE_ENV === "development" && <DevFeedback />}
      </body>
    </html>
  );
}
