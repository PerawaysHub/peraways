"use client";

import { useEffect } from "react";

// iOS WebKit bug (affects Safari AND Chrome on iOS identically — Apple
// requires every iOS browser to use WebKit under the hood): rotating the
// device to landscape and back to portrait — and, per repeated real-world
// reports, especially opening/closing the embedded video's native
// fullscreen player after an earlier rotation — can leave the page stuck
// rendering as if it were still the wider (landscape) width. Tailwind's
// `md:` breakpoint (768px) classes — e.g. the 3-column service grid — keep
// matching / rendering wide even though the visible screen is narrow, so
// content overflows off the right edge. Not specific to any one page.
//
// Two independent, complementary detectors, since either can miss the bug
// depending on exactly which internal WebKit state got stuck:
//  - matchMedia vs innerWidth: catches a stuck CSS media-query cache.
//  - documentElement.scrollWidth vs innerWidth: catches actual laid-out
//    overflow directly, regardless of why it happened. This is the more
//    literal "is the page visibly too wide" check and turned out to be the
//    one that reliably fires in practice — the matchMedia check alone was
//    too often reporting "fine" even while the page was visibly broken.
const BREAKPOINT = 768;
const OVERFLOW_TOLERANCE = 4; // px slack for scrollbar-width rounding

function isBroken() {
  if (typeof window === "undefined") return false;
  const mqMatches = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
  const actuallyWide = window.innerWidth >= BREAKPOINT;
  if (mqMatches !== actuallyWide) return true;
  return document.documentElement.scrollWidth > window.innerWidth + OVERFLOW_TOLERANCE;
}

// Layered nudges: the plain viewport-meta-tag toggle alone wasn't reliably
// forcing WebKit to redo its layout/paint for this bug. Stack several
// known-effective forced-reflow/repaint tricks — cheap, harmless, and
// no-ops on browsers where they don't apply.
function softFix() {
  const meta = document.querySelector('meta[name="viewport"]');
  const original = meta?.getAttribute("content");
  if (meta && original) {
    meta.setAttribute("content", `${original}, shrink-to-fit=no`);
  }

  // Force a synchronous reflow.
  void document.documentElement.offsetHeight;

  // Non-standard but WebKit-honored; toggling it forces a full re-zoom/
  // re-layout/re-paint pass. No-op (throws are swallowed) elsewhere.
  try {
    const style = document.documentElement.style as CSSStyleDeclaration & { zoom?: string };
    style.zoom = "0.99999";
    requestAnimationFrame(() => {
      style.zoom = "1";
    });
  } catch {
    // ignore — non-standard property, safe to skip if unsupported
  }

  const x = window.scrollX;
  const y = window.scrollY;
  window.scrollTo(x, y + 1);
  window.scrollTo(x, y);

  requestAnimationFrame(() => {
    if (meta && original) meta.setAttribute("content", original);
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
    let escalation: ReturnType<typeof setTimeout> | null = null;

    // Re-checks a few times over ~2s, re-applying the soft fix each time,
    // and only reloads if it's still broken at the very last check — gives
    // WebKit a real chance to settle on its own first, without dragging
    // the worst case out.
    const escalate = (attempt = 0) => {
      const delays = [250, 600, 1100, 2000];
      if (attempt >= delays.length) return;
      escalation = setTimeout(() => {
        if (reloaded || !isBroken()) return;
        softFix();
        if (attempt === delays.length - 1) {
          setTimeout(() => {
            if (reloaded || !isBroken()) return;
            if (userIsTyping()) return; // retry on the next poll tick instead
            reloaded = true;
            window.location.reload();
          }, 150);
          return;
        }
        escalate(attempt + 1);
      }, delays[attempt]);
    };

    const check = () => {
      if (reloaded || !isBroken()) return;
      softFix();
      escalate();
    };

    document.addEventListener("fullscreenchange", check);
    document.addEventListener("webkitfullscreenchange", check);
    window.addEventListener("orientationchange", check);

    // Catch-all: don't depend on any single event firing reliably (the
    // cross-origin YouTube iframe's fullscreen transitions in particular
    // don't reliably raise fullscreenchange on the top document on iOS).
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") check();
    }, 1000);

    return () => {
      document.removeEventListener("fullscreenchange", check);
      document.removeEventListener("webkitfullscreenchange", check);
      window.removeEventListener("orientationchange", check);
      window.clearInterval(poll);
      if (escalation) clearTimeout(escalation);
    };
  }, []);

  return null;
}
