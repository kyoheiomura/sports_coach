"use client";

/**
 * サイト全体の動き。
 * - SmoothScroll … 慣性のあるスクロール（Lenis）
 * - ScrollFx     … 固定背景の視差（data-parallax）と、文章の画面の浮かび上がり・溶け（data-screen）
 * - Intro        … 初回だけの幕開け（セッション中は1回）
 * reduced-motion のときは、どれも動かさない。
 */
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function ScrollFx() {
  const pathname = usePathname();
  useEffect(() => {
    if (reduced()) return;
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const screens = Array.from(document.querySelectorAll<HTMLElement>("[data-screen]"));
    if (!parallax.length && !screens.length) return;
    let ticking = false;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      // 背景写真：場面全体の進み具合に合わせて、ゆっくり上に流れつつ少し引く
      for (const el of parallax) {
        const scene = el.parentElement?.parentElement; // StickyScene の section
        if (!scene) continue;
        const r = scene.getBoundingClientRect();
        const total = r.height - vh;
        const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
        const strength = Number(el.dataset.parallax || 12); // 画面の高さに対する %
        el.style.transform = `translate3d(0, ${(p - 0.5) * strength}%, 0) scale(${1.08 - p * 0.06})`;
      }
      // 文章の画面：中央に近いほどはっきり、離れるほど薄く・少し沈む
      for (const el of screens) {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = (center - vh / 2) / vh; // -1〜1 くらい
        const o = clamp(1 - Math.abs(d) * 1.6, 0, 1);
        el.style.opacity = String(0.08 + o * 0.92);
        el.style.transform = `translate3d(0, ${d * -24}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      [...parallax, ...screens].forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
      });
    };
  }, [pathname]);
  return null;
}

export function Intro() {
  const [state, setState] = useState<"hidden" | "show" | "leave">("hidden");
  useEffect(() => {
    if (reduced() || sessionStorage.getItem("coach-media:intro")) return;
    sessionStorage.setItem("coach-media:intro", "1");
    setState("show");
    const t1 = window.setTimeout(() => setState("leave"), 1400);
    const t2 = window.setTimeout(() => setState("hidden"), 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
  if (state === "hidden") return null;
  return (
    <div
      aria-hidden="true"
      className={`intro fixed inset-0 z-[100] flex items-center justify-center bg-navy text-white ${state === "leave" ? "intro-leave" : ""}`}
    >
      <p className="intro-word font-logo text-[clamp(2.5rem,7vw,5rem)] font-extrabold uppercase italic">{SITE.nameEn}</p>
    </div>
  );
}
