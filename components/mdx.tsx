/**
 * 取材記事の本文（MDX）で使える部品。CMS のリッチテキストに置き換えやすいよう、数を絞る。
 *   ## 章の見出し            章（目次に出る）。lib/mdx.tsx が <ChapterTitle> に置きかえる
 *   <Q>質問</Q>              聞き手の質問（小見出し）。答えは、その下にふつうの段落で書く
 *   <Photo src alt caption align />  写真。align="left" で文章の左に回りこむ（省くと中央）
 *   <Quote>言葉</Quote>      本文から抜き出した、大きく見せる言葉（使わなくてもよい）
 */
import Image from "next/image";
import type { ReactNode } from "react";

export function ChapterTitle({ id, no, children }: { id: string; no: string; children: ReactNode }) {
  return (
    <h2 id={id} className="!mt-20 flex scroll-mt-24 items-baseline gap-4 border-t-2 border-ink pt-6 text-[1.375rem] leading-[1.6] first:!mt-0 md:!mt-28 md:text-[1.75rem]">
      <span aria-hidden="true" className="font-display text-base font-black text-accent md:text-lg">
        {no}
      </span>
      <span>{children}</span>
    </h2>
  );
}

export function Q({ children }: { children: ReactNode }) {
  return <h3 className="!mt-12 clear-both border-l-4 border-accent pl-4 text-[1.0625rem] leading-[1.7] md:text-[1.1875rem]">{children}</h3>;
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="relative !my-12 clear-both rounded-2xl bg-accent-soft/60 py-6 pr-6 pl-12 text-[1.125rem] leading-[1.7] font-medium md:pl-16 md:text-[1.375rem]">
      <span aria-hidden="true" className="absolute top-1 left-3 font-display text-[3.5rem] leading-none text-accent-bright/50 md:left-4 md:text-[4.5rem]">
        “
      </span>
      {children}
    </blockquote>
  );
}

export function Photo({ src, alt, caption, align = "center" }: { src: string; alt: string; caption?: string; align?: "center" | "left" }) {
  return (
    <figure className={align === "left" ? "!mt-6 md:float-left md:mr-8 md:mb-3 md:w-[44%]" : "!my-8 clear-both mx-auto md:w-[82%]"}>
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-mist">
        <Image src={src} alt={alt} fill sizes={align === "left" ? "(min-width: 768px) 360px, 100vw" : "(min-width: 768px) 680px, 100vw"} className="object-cover" />
      </div>
      {caption && <figcaption className="mt-2 text-xs leading-relaxed text-sub">{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = { ChapterTitle, Q, Quote, Photo };
