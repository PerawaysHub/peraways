"use client";

import { FadeUp } from "./FadeUp";
import { translations } from "./translations";

export function Video() {
  const content = translations.de.video;

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
