// ==UserScript==
// @name         DCLiveChat
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.8.20260325
// @description  모바일 Tampermonkey 설치용 DCLiveChat 로더
// @author       goisbyhi
// @match        *://gall.dcinside.com/*
// @match        *://m.dcinside.com/*
// @match        *://www.fmkorea.com/*
// @match        *://m.fmkorea.com/*
// @run-at       document-idle
// @grant        none
// @noframes
// @homepageURL  https://github.com/goisbyhi/dclivechat
// @downloadURL  https://goisbyhi.github.io/dclivechat/dclivechat.user.js
// @updateURL    https://goisbyhi.github.io/dclivechat/dclivechat.user.js
// ==/UserScript==

(function () {
  "use strict";

  const scriptUrl = "https://goisbyhi.github.io/dclivechat/min.js";
  const mobileFixClass = "dclivechat-mobile-fix";
  const dcFixClass = "dclivechat-mobile-dc";
  const fmFixClass = "dclivechat-mobile-fm";

  function isMobileDevice() {
    const mobileUserAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasMatchMedia = typeof window.matchMedia === "function";
    const coarsePointer = hasMatchMedia && window.matchMedia("(pointer: coarse)").matches;
    const noHover = hasMatchMedia && window.matchMedia("(hover: none)").matches;
    const narrowViewport = hasMatchMedia && window.matchMedia("(max-width: 900px)").matches;

    return mobileUserAgent || coarsePointer || noHover || narrowViewport;
  }

  function redirectMobileFmToDesktop() {
    if (window.location.hostname !== "m.fmkorea.com") {
      return false;
    }

    const targetUrl = new URL(window.location.href);
    const boardMid = getFmBoardMid();
    targetUrl.protocol = "https:";
    targetUrl.hostname = "www.fmkorea.com";

    if (boardMid) {
      targetUrl.searchParams.set("mid", boardMid);
    }

    window.location.replace(targetUrl.toString());
    return true;
  }

  function getFmBoardMid() {
    const currentUrl = new URL(window.location.href);
    const path = currentUrl.pathname.replace(/^\/+/, "");

    return (
      currentUrl.searchParams.get("mid") ||
      window.currentBoardMid ||
      window.current_mid ||
      (/^[A-Za-z0-9_]+$/.test(path) ? path : "")
    );
  }

  function normalizeDesktopFmUrl() {
    if (window.location.hostname !== "www.fmkorea.com") {
      return;
    }

    const boardMid = getFmBoardMid();

    if (!boardMid) {
      return;
    }

    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get("mid") === boardMid) {
      return;
    }

    currentUrl.searchParams.set("mid", boardMid);
    window.history.replaceState(null, "", currentUrl.toString());
  }

  async function waitForFmContext() {
    if (!isMobile || !isFm || window.location.hostname !== "www.fmkorea.com") {
      return;
    }

    const startedAt = Date.now();

    while (Date.now() - startedAt < 4000) {
      const boardMid = getFmBoardMid();

      if (boardMid) {
        normalizeDesktopFmUrl();
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 200));
    }
  }

  function injectMobileOverrides(isDc, isFm) {
    document.documentElement.classList.add(mobileFixClass);

    if (isDc) {
      document.documentElement.classList.add(dcFixClass);
    }

    if (isFm) {
      document.documentElement.classList.add(fmFixClass);
    }

    const style = document.createElement("style");
    style.textContent = `
      html.${mobileFixClass} main .chat > .li-c,
      html.${mobileFixClass} main .chat > .ri-c {
        display: none !important;
        visibility: collapse !important;
      }

      html.${mobileFixClass} main .chat > .ci-c {
        padding-bottom: 12px !important;
      }

      html.${mobileFixClass} main .chat > .ci-c > .f {
        width: 100% !important;
        justify-content: flex-end !important;
      }

      html.${mobileFixClass} main .chat > .ci-c > .f > .i,
      html.${mobileFixClass} main .chat > .ci-c > .f > .d,
      html.${mobileFixClass} main .chat > .ci-c > .f > .up,
      html.${mobileFixClass} main .chat > .ci-c > .f > .sb {
        display: none !important;
        visibility: collapse !important;
      }

      html.${mobileFixClass} main .chat > .ci-c > .f > .sc {
        margin-left: auto !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span {
        justify-content: flex-start !important;
        align-items: center !important;
        text-align: left !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl {
        align-self: stretch !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt {
        width: calc(100% - 12px) !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 6px !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        line-break: auto !important;
        overflow-wrap: normal !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span > * {
        flex: 0 0 auto !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span > .tt {
        display: block !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        text-align: left !important;
      }

      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span .name,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span .ip,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span .sg,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span .tt,
      html.${mobileFixClass}.${dcFixClass} main .chat:not(.fm) .chl > .tt > span * {
        text-align: left !important;
      }
    `;

    document.head.appendChild(style);
  }

  const isMobile = isMobileDevice();
  const isDc = /(^|\.)dcinside\.com$/.test(window.location.hostname);
  const isFm = /(^|\.)fmkorea\.com$/.test(window.location.hostname);

  if (isMobile && isFm && redirectMobileFmToDesktop()) {
    return;
  }

  if (isMobile) {
    injectMobileOverrides(isDc, isFm);
  }

  if (isMobile && isFm) {
    normalizeDesktopFmUrl();
  }

  Promise.resolve()
    .then(() => waitForFmContext())
    .then(() => fetch(scriptUrl, { cache: "no-store" }))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((scriptText) => {
      (0, eval)(scriptText);
    })
    .catch((error) => {
      console.error("DCLiveChat 로드 실패", error);
      alert("DCLiveChat 불러오기에 실패했습니다.");
    });
})();
