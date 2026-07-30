"use client";

import { useEffect } from "react";

// iOS WebKit bug (affects Safari AND Chrome on iOS identically — Apple
// requires every iOS browser to use WebKit under the hood): rotating the
// device to landscape and back to portrait can leave CSS media-query
// evaluation stuck at the pre-rotation width, even though the visible
// screen and document.documentElement.clientWidth are correctly narrow
// again. Tailwind's `md:` breakpoint (768px) classes — e.g. the 3-column
// service grid — keep matching, so the grid renders 3-wide for a portrait
// screen and overflows off the right edge. This is a plain-rotation bug,
// not specific to video/fullscreen, and can happen on any page.
//
// Detect it by comparing matchMedia's answer (what CSS thinks) against the
// real window width (what's actually true) — a much more direct signal
// than comparing viewport size metrics, which can stay consistent with
// each other while the separate media-query cache is the thing that's
// actually stuck.
const BREAKPOINT = 768;

function isBroken() {
  if (typeof window === "undefined") return false;
  const mqMatches = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
  const actuallyWide = window.innerWidth >= BREAKPOINT;
  return mqMatches !== actuallyWide;
}

function softFix() {
  const meta = document.querySelector('meta[name="viewport"]');
  const original = meta?.getAttribute("content");
  if (!meta || !original) return;
  meta.setAttribute("content", `${original}, shrink-to-fit=no`);
  requestAnimationFrame(() => {
    meta.setAttribute("content", original);
    window.dispatchEvent(new Event("resize"));
  });
}

// Never reload out from under someone actively typing (contact form,
// CRM forms) — better to leave the layout soft-fixed and retry later than
// to risk losing what they've entered.
function userIsTyping() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return false;
  return !!(el as HTMLInputElement | HTMLTextAreaElement).value;
}

export function ViewportBugFix() {
  useEffect(() => {
    let reloaded = false;

    const check = () => {
      if (reloaded || !isBroken()) return;
      softFix();
      setTimeout(() => {
        if (reloaded || !isBroken()) return;
        if (userIsTyping()) return; // retry on the next poll tick instead
        reloaded = true;
        window.location.reload();
      }, 400);
    };

    // iOS settles its own layout a moment after these events fire, so a
    // check run immediately can get overwritten — check again shortly after.
    const delayedCheck = () => {
      check();
      setTimeout(check, 300);
    };

    document.addEventListener("fullscreenchange", delayedCheck);
    document.addEventListener("webkitfullscreenchange", delayedCheck);
    window.addEventListener("orientationchange", delayedCheck);

    // Catch-all: don't depend on any single event firing reliably.
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") check();
    }, 1500);

    return () => {
      document.removeEventListener("fullscreenchange", delayedCheck);
      document.removeEventListener("webkitfullscreenchange", delayedCheck);
      window.removeEventListener("orientationchange", delayedCheck);
      window.clearInterval(poll);
    };
  }, []);

  return null;
}
