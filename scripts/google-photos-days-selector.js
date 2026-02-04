(async () => {
  /**
   * ACTION MODE:
   * - "newer"  => scroll UP to load/select newer days
   * - "older"  => scroll DOWN to load/select older days
   * - "both"   => try current view, then alternate when stuck
   */
  const ACTION_MODE = "older"; // <-- choose: "newer" | "older" | "both"
  const DAYS_TO_SELECT = 5;
  // If true, every time we click a day-checkbox, we store its aria-label in window.__savedDayLabels
  // Printing the result at the end, so you can replay later if needed.
  const SAVE_CLICKS = true;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(min + Math.random() * (max - min));
  const humanSleep = (min, max) => sleep(rand(min, max));

  const DAY_GROUP_SEL = "div.I9QCXd.fCu40c";

  // ✅ More robust than dynamic classes like .K0a18:
  // Google Photos exposes a stable role + aria-label pattern we can leverage.
  const DAY_CHECKBOX_SEL = 'div[role="checkbox"][aria-label^="Seleccionar todas las fotos"]';

  // ✅ Scrollable container
  const SCROLLER_SEL = "div.Purf9b.THsa9b.zcLWac.eejsDc.lnJaGb";
  const scroller = document.querySelector(SCROLLER_SEL);

  if (!scroller) {
    console.error("Could not find the scrollable container:", SCROLLER_SEL);
    return;
  }

  const aria = (el, name) => el?.getAttribute(name);
  const isChecked = (cb) => aria(cb, "aria-checked") === "true";
  const isUnchecked = (cb) => aria(cb, "aria-checked") === "false";

  const getDayGroups = () => Array.from(document.querySelectorAll(DAY_GROUP_SEL));

  const getDayCheckbox = (dayEl) => {
    // Primary: robust selector
    const cb = dayEl.querySelector(DAY_CHECKBOX_SEL);
    if (cb) return cb;

    // Fallback: any checkbox inside the day group (last resort)
    return dayEl.querySelector('div[role="checkbox"]');
  };

  const getDayIdText = (dayEl) => {
    const dateEl =
      dayEl.querySelector('div.xA0gfb[jsname="gElRsf"]') ||
      dayEl.querySelector("div.xA0gfb");
    return (dateEl?.textContent || "").trim() || "(no-date)";
  };

  // Save clicked aria-labels (for replay/debugging)
  const saveClickLabel = (cb) => {
    if (!SAVE_CLICKS || !cb) return;
    const label = aria(cb, "aria-label");
    if (!label) return;

    window.__savedDayLabels = window.__savedDayLabels || [];
    if (!window.__savedDayLabels.includes(label)) {
      window.__savedDayLabels.push(label);
      console.log("💾 Saved click label:", label);
      // Tip: run `copy(window.__savedDayLabels)` to copy to clipboard.
    }
  };

  // Wait up to 10s for THIS day's checkbox to become checked
  const waitForCheckedInSameDay = async (dayEl, timeoutMs = 10000, intervalMs = 250) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (!dayEl.isConnected) return { ok: false, reason: "dayEl-detached" };
      const cbNow = getDayCheckbox(dayEl);
      if (cbNow && isChecked(cbNow)) return { ok: true };
      await sleep(intervalMs);
    }
    return { ok: false, reason: "timeout" };
  };

  // Wait until at least one NEW day appears after a scroll
  const waitForNewDays = async (knownIds, timeoutMs = 10000, intervalMs = 300) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const dayEls = getDayGroups();
      for (const d of dayEls) {
        const id = getDayIdText(d);
        if (id && !knownIds.has(id)) return true;
      }
      await sleep(intervalMs);
    }
    return false;
  };

  // Scroll UP inside the container (loads newer days)
  const scrollUpForNewer = async () => {
    const amount = Math.floor(scroller.clientHeight * (1.2 + Math.random() * 0.6));
    scroller.scrollTop = Math.max(0, scroller.scrollTop - amount);
  };

  // Scroll DOWN inside the container (loads older days)
  const scrollDownForOlder = async () => {
    const amount = Math.floor(scroller.clientHeight * (1.2 + Math.random() * 0.6));
    const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
    scroller.scrollTop = Math.min(maxScrollTop, scroller.scrollTop + amount);
  };

  const doScrollByMode = async (mode) => {
    if (mode === "newer") return scrollUpForNewer();
    if (mode === "older") return scrollDownForOlder();
  };

  let selected = 0;
  const processedDayIds = new Set();

  console.log("🚀 Day selection using internal scroller.");
  console.log("Mode:", ACTION_MODE, "| Target days:", DAYS_TO_SELECT);
  if (SAVE_CLICKS) console.log("💾 Click saving is ON (window.__savedDayLabels).");

  // Used only when ACTION_MODE === "both"
  let bothModePhase = "newer"; // alternates between "newer" and "older"

  while (selected < DAYS_TO_SELECT) {
    const days = getDayGroups();

    // Process what's currently visible (no scroll yet)
    for (const dayEl of days) {
      if (selected >= DAYS_TO_SELECT) break;

      const dayId = getDayIdText(dayEl);
      if (!dayId || processedDayIds.has(dayId)) continue;

      const cb = getDayCheckbox(dayEl);
      if (!cb) continue;

      // If already selected, don't touch it
      if (isChecked(cb)) {
        processedDayIds.add(dayId);
        continue;
      }

      // Only proceed if clearly unchecked
      if (!isUnchecked(cb)) {
        console.warn("⚠️ Weird checkbox state, skipping:", { dayId, aria: aria(cb, "aria-checked") });
        processedDayIds.add(dayId);
        continue;
      }

      await humanSleep(900, 1600);

      // Re-check within the same day block
      const cb2 = getDayCheckbox(dayEl);
      if (!cb2 || isChecked(cb2) || !isUnchecked(cb2)) {
        processedDayIds.add(dayId);
        continue;
      }

      // Save what we're about to click (aria-label), so you can replay later
      saveClickLabel(cb2);

      cb2.click();

      const res = await waitForCheckedInSameDay(dayEl, 10000, 250);
      if (res.ok) {
        selected++;
        console.log(`✅ Day selected (${selected}/${DAYS_TO_SELECT}): ${dayId}`);
      } else {
        console.warn("⏳ Not confirmed in 10s; skipping to avoid toggle:", { dayId, reason: res.reason });
      }

      processedDayIds.add(dayId);
      await humanSleep(1200, 2200);
    }

    if (selected >= DAYS_TO_SELECT) break;

    // Decide what direction to scroll based on ACTION_MODE
    let modeToUse = ACTION_MODE;
    if (ACTION_MODE === "both") modeToUse = bothModePhase;

    await doScrollByMode(modeToUse);
    await humanSleep(3000, 5200);

    const gotNew = await waitForNewDays(processedDayIds, 10000, 300);
    if (!gotNew) {
      console.warn("⚠️ No new days appeared after scrolling. You might be at the end or loading is slow.");
      await humanSleep(4000, 6500);

      // If in both-mode, flip direction when stuck
      if (ACTION_MODE === "both") {
        bothModePhase = bothModePhase === "newer" ? "older" : "newer";
        console.log("🔁 Switching scroll direction (both-mode):", bothModePhase);
      }
    }
  }

  console.log("🎉 Done. Days selected:", selected);

  if (SAVE_CLICKS) {
    console.log("💾 Saved day labels (for replay):", window.__savedDayLabels || []);
    console.log("Tip: `copy(window.__savedDayLabels)` to copy them to clipboard.");
  }
})();
