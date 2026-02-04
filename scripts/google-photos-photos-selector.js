/**
 * google-photos-photos-selector.js
 *
 * Purpose:
 * - Select visible photos in Google Photos (e.g., Album -> "Add photos" picker).
 * - Hide already selected photos while it runs so you can review what's left.
 * - Toggle ON/OFF by running the script again.
 *
 * - SCROLL_MODE: "down" | "up"
 * - START_AT: "top" | "bottom" | "keep"
 */

(async () => {
  const FLAG = "__gp_photos_selector_v2";
  const STYLE_ID = "__gp_hide_selected_css_v2";

  // ===== Toggle OFF (run again to stop and restore UI) =====
  if (window[FLAG]?.stop) {
    window[FLAG].stop();
    console.log("👁️‍🗨️ Disabled: selection/hiding stopped and UI restored.");
    return;
  }

  // ===== Config =====
  const START_AT = "keep";     // "top" | "bottom" | "keep"
  const SCROLL_MODE = "down";  // "down" | "up"
  const SAVE_CLICKS = false;   // Save aria-labels (if present) into window.__savedPhotoLabels
  const MAX_IDLE_LOOPS = 10;   // Stop after N loops with no scroll progress and no content growth
  const DEBUG = false;

  // ===== Helpers =====
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(min + Math.random() * (max - min));
  const humanSleep = (min, max) => sleep(rand(min, max));

  const aria = (el, name) => el?.getAttribute(name);
  const isChecked = (cb) => aria(cb, "aria-checked") === "true";
  const isUnchecked = (cb) => aria(cb, "aria-checked") === "false";

  // ===== DOM selectors (language-agnostic) =====
  const SCROLLER_SEL = "div.Purf9b.THsa9b.zcLWac.eejsDc.lnJaGb";
  const scroller = document.querySelector(SCROLLER_SEL);
  if (!scroller) {
    console.error("Could not find the scrollable container:", SCROLLER_SEL);
    return;
  }

  // Photo card container in the picker/timeline grid
  const PHOTO_CARD_SEL = 'div.rtIMgb[jsname="NwW5ce"]';

  // Photo checkbox: any checkbox inside a photo card (avoid fragile classes)
  const getPhotoCheckbox = (card) => card.querySelector('div[role="checkbox"]');

  // ===== Start position =====
  const scrollToTop = async () => {
    scroller.scrollTop = 0;
    await humanSleep(1200, 2200);
  };

  const scrollToBottom = async () => {
    // Force a couple of attempts; some UIs lazy-load height gradually
    for (let i = 0; i < 3; i++) {
      scroller.scrollTop = scroller.scrollHeight;
      await humanSleep(1200, 2200);
    }
  };

  if (START_AT === "top") await scrollToTop();
  if (START_AT === "bottom") await scrollToBottom();

  // ===== Hide layer (CSS) =====
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;

  // Hide selected photo cards (requires :has support - works in modern Chrome/Edge)
  style.textContent = `
    ${PHOTO_CARD_SEL}:has(div[role="checkbox"][aria-checked="true"]) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // Observer: helps if the UI re-renders often
  const observer = new MutationObserver(() => {});
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["aria-checked", "class", "style"],
  });

  // ===== Stop handler (used by toggle OFF) =====
  window[FLAG] = {
    stop: () => {
      observer.disconnect();
      document.getElementById(STYLE_ID)?.remove();
      document.querySelectorAll(PHOTO_CARD_SEL).forEach((el) => (el.style.display = ""));
      delete window[FLAG];
    },
  };

  const waitForChecked = async (cb, timeoutMs = 5000, intervalMs = 150) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (!cb.isConnected) return { ok: false, reason: "detached" };
      if (isChecked(cb)) return { ok: true };
      await sleep(intervalMs);
    }
    return { ok: false, reason: "timeout" };
  };

  const scrollStepDown = () => {
    const amount = Math.floor(scroller.clientHeight * (1.3 + Math.random() * 0.6));
    const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
    scroller.scrollTop = Math.min(maxScrollTop, scroller.scrollTop + amount);
  };

  const scrollStepUp = () => {
    const amount = Math.floor(scroller.clientHeight * (1.3 + Math.random() * 0.6));
    scroller.scrollTop = Math.max(0, scroller.scrollTop - amount);
  };

  const doScrollStep = () => {
    if (SCROLL_MODE === "up") return scrollStepUp();
    return scrollStepDown();
  };

  // De-dup processing. aria-label may be missing, so we also fallback to a weak key.
  const processed = new Set();
  let clicks = 0;
  let idle = 0;

  console.log("🚀 Photo selector ON: selecting visible photos and hiding selected ones.");
  console.log("Start at:", START_AT, "| Scroll mode:", SCROLL_MODE);

  if (SAVE_CLICKS) window.__savedPhotoLabels = window.__savedPhotoLabels || [];

  while (true) {
    const beforeTop = scroller.scrollTop;
    const beforeH = scroller.scrollHeight;

    const cards = Array.from(document.querySelectorAll(PHOTO_CARD_SEL));
    if (DEBUG) console.log("Visible cards:", cards.length);

    for (const card of cards) {
      const cb = getPhotoCheckbox(card);
      if (!cb) continue;

      // Prefer aria-label as stable key (if present). Otherwise use a fallback signature.
      const label = aria(cb, "aria-label") || "";
      const r = card.getBoundingClientRect();
      const fallbackKey = label || `${r.top.toFixed(1)}|${r.left.toFixed(1)}`;

      if (processed.has(fallbackKey)) continue;

      if (isChecked(cb)) {
        processed.add(fallbackKey);
        continue;
      }

      if (!isUnchecked(cb)) {
        processed.add(fallbackKey);
        continue;
      }

      await humanSleep(180, 450);
      cb.click();

      const res = await waitForChecked(cb, 5000, 150);
      if (res.ok) {
        clicks++;
        if (clicks % 50 === 0) console.log(`✅ New selections: ${clicks}`);

        if (SAVE_CLICKS && label && !window.__savedPhotoLabels.includes(label)) {
          window.__savedPhotoLabels.push(label);
        }
      } else {
        console.warn("⚠️ Could not confirm selection, skipping:", {
          label: label || "(no-label)",
          reason: res.reason,
        });
      }

      processed.add(fallbackKey);
      await humanSleep(120, 300);
    }

    // Scroll (up or down)
    doScrollStep();
    await humanSleep(1700, 3200);

    const afterTop = scroller.scrollTop;
    const afterH = scroller.scrollHeight;

    const noMove = Math.abs(afterTop - beforeTop) < 2;
    const noGrowth = Math.abs(afterH - beforeH) < 2;

    // When scrolling UP, height may not grow; rely mostly on movement
    // When scrolling DOWN, movement and/or growth indicates progress
    if (noMove && (SCROLL_MODE === "up" ? true : noGrowth)) idle++;
    else idle = 0;

    if (idle >= MAX_IDLE_LOOPS) break;

    // Hard stop if we reached the end in the chosen direction
    if (SCROLL_MODE === "down" && scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 2) {
      // Might still lazy-load; idle logic will stop if nothing happens
      if (DEBUG) console.log("Reached bottom edge.");
    }
    if (SCROLL_MODE === "up" && scroller.scrollTop <= 2) {
      if (DEBUG) console.log("Reached top edge.");
    }
  }

  console.log("🎉 Done. New selections performed:", clicks);
  console.log("Run the script again to stop & restore UI.");
})();
