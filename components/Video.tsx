"use client";

import { useEffect } from "react";
import { FadeUp } from "./FadeUp";
import { translations } from "./translations";

// iOS Safari bug: rotating the phone while the embedded YouTube video is in
// native fullscreen (common on landscape rotation), then exiting fullscreen
// and rotating back to portrait, can leave Safari's internal layout-viewport
// width stuck at the old (landscape) value — the page renders as if it's
// still wide even though the visible screen is narrow, breaking every
// section below the video. A synthetic resize event alone doesn't fix this
// (it only nudges JS listeners, not WebKit's own viewport metrics); toggling
// the <meta name="viewport"> content attribute forces Safari to recompute it.
// Also listen for plain orientationchange, not just fullscreenchange: a
// cross-origin YouTube iframe's fullscreen transitions don't reliably raise
// fullscreenchange on the top document on iOS, but a physical rotation always
// fires orientationchange regardless of what triggered it.
function useFullscreenViewportFix() {
  useEffect(() => {
    const fix = () => {
      const meta = document.querySelector('meta[name="viewport"]');
      const original = meta?.getAttribute("content");
      if (!meta || !original) return;
      meta.setAttribute("content", `${original}, shrink-to-fit=no`);
      requestAnimationFrame(() => {
        meta.setAttribute("content", original);
        window.dispatchEvent(new Event("resize"));
      });
    };
    // iOS settles its own layout a moment after orientationchange fires, so a
    // fix run immediately can get overwritten — nudge again shortly after.
    const delayedFix = () => {
      fix();
      setTimeout(fix, 300);
    };
    document.addEventListener("fullscreenchange", fix);
    document.addEventListener("webkitfullscreenchange", fix);
    window.addEventListener("orientationchange", delayedFix);
    return () => {
      document.removeEventListener("fullscreenchange", fix);
      document.removeEventListener("webkitfullscreenchange", fix);
      window.removeEventListener("orientationchange", delayedFix);
    };
  }, []);
}

export function Video() {
  const content = translations.de.video;
  useFullscreenViewportFix();

  return (
    <section id="video" className="bg-[var(--cream)] px-6 py-16 text-center lg:py-24">
      <FadeUp>
        <span className="mb-5 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          {content.label}
        </span>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div
          className="relative mx-auto aspect-video max-w-[860px] overflow-hidden rounded-3xl bg-[#0F2820] shadow-[0_32px_80px_rgba(25,70,60,0.22)]"
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}?rel=0`}
            title={content.title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </FadeUp>
    </section>
  );
}
