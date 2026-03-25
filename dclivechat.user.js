// ==UserScript==
// @name         DCLiveChat
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.11.20260325
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
  const fmSiteModeClass = "dclivechat-fm-site-mode";
  const fmModeSwitchClass = "dclivechat-fm-mode-switch";
  const fmModeButtonClass = "dclivechat-fm-mode-button";
  const fmSiteFrameClass = "dclivechat-fm-site-frame";

  function isMobileDevice() {
    const mobileUserAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasMatchMedia = typeof window.matchMedia === "function";
    const coarsePointer = hasMatchMedia && window.matchMedia("(pointer: coarse)").matches;
    const noHover = hasMatchMedia && window.matchMedia("(hover: none)").matches;
    const narrowViewport = hasMatchMedia && window.matchMedia("(max-width: 900px)").matches;

    return mobileUserAgent || coarsePointer || noHover || narrowViewport;
  }

  function patchFmMobileMinScript(scriptText) {
    if (!isMobile || window.location.hostname !== "m.fmkorea.com") {
      return scriptText;
    }

    let patchedText = scriptText.replace(
      "),cr)return Al(v),Dr()?location.href=fi():void 0;",
      "),cr&&Dr())return Al(v),location.href=fi();"
    );

    const fmBranchStart = patchedText.indexOf('if("fmkorea"==b){');
    const fmBranchEnd = patchedText.indexOf("let q=await r(t);", fmBranchStart);

    if (fmBranchStart === -1 || fmBranchEnd === -1) {
      return patchedText;
    }

    const enhancedFmBranch = `if("fmkorea"==b){let r=Date.now();if(r<C)return;let o=await i(t),c=o.text;if(!o.ok||A.test(c)){L++;let t=o.retryAfter;if(!t){let e=429==o.status||430==o.status?60:15;t=Math.min(e*L,300)}return C=r+1e3*t,void e("fm update paused",o.status,t)}if(L=0,C=0,!c)return;c=c.replace(/(\\n|\\r|\\t)/g,"");let s=(e,t)=>{let r=l[e.num]??0;return t&&(e.count=t),!(e.num<=m())||(t!=r&&a(e.num,t),!1)},M=e=>w(((e??"").replace(/<script[\\s\\S]*?<\\/script>/gi," ").replace(/<style[\\s\\S]*?<\\/style>/gi," ").replace(/<[^>]+>/g," "))).replace(/\\s+/g," ").trim(),d=c.match(/<li\\b[^>]*class=(["'])[^"'<>]*\\bclear\\b[^"'<>]*\\1[^>]*>[\\s\\S]*?<\\/li>/gi)??[];if(d.length){for(let e of d){let t=e.match(/<h3[^>]*>[\\s\\S]*?<a[^>]+href=(["'])([^"']+)\\1[^>]*>([\\s\\S]*?)<\\/a>/i);if(!t)continue;let r=x(t[2]);if(!r)continue;let i={num:r,subject:"",title:M(t[3]).replace(/\\s*\\[[0-9]+\\]\\s*$/,""),nickname:"",id:"",ip:"",date:0,img:"",fix:!1,count:0};let o=e.match(/<span[^>]*class=(["'])[^"'<>]*\\bcomment_count\\b[^"'<>]*\\1[^>]*>\\[([0-9]+)\\]<\\/span>/i);if(o&&(i.count=f(o[2])),!s(i,i.count))continue;let n=e.match(/<div[^>]*class=(["'])[^"'<>]*\\binfo\\b[^"'<>]*\\1[^>]*>([\\s\\S]*?)<\\/div>/i);if(n){let e=[...n[2].matchAll(/<span[^>]*>([\\s\\S]*?)<\\/span>/gi)].map(e=>M(e[1]));i.subject=e[1]??"",i.nickname=e[2]??""}i.subject!=g&&v.push(i)}return void await n(v)}d=c.match(/<tr\\b[^>]*>.*?<\\/tr>/gi)??[];for(let e of d){if(/<th\\b/i.test(e)||I(e))continue;let t=_(e);if(!t.href)continue;let r=x(t.href);if(!r)continue;let i={num:r,subject:y(e),title:t.title,nickname:"",id:"",ip:"",date:0,img:"",fix:!1,count:0};if(!s(i,k(e)))continue;let l=O(e);i.nickname=l.name,i.id=l.id,i.img=l.img,i.fix=l.fix,i.subject!=g&&v.push(i)}return void await n(v)}`;

    patchedText =
      patchedText.slice(0, fmBranchStart) +
      enhancedFmBranch +
      patchedText.slice(fmBranchEnd);

    return patchedText;
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

      html.${mobileFixClass}.${fmFixClass} main .chat.fm .fm-tabs {
        display: block !important;
        width: auto !important;
        margin: 0 8px !important;
        padding: 8px 2px 10px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        max-height: none !important;
        box-sizing: border-box !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        text-align: left !important;
      }

      html.${mobileFixClass}.${fmFixClass} main .chat.fm .fm-tabs::-webkit-scrollbar {
        display: none !important;
      }

      html.${mobileFixClass}.${fmFixClass} main .chat.fm .fm-tabs-wrap {
        display: inline-flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
        gap: 6px !important;
        width: max-content !important;
        min-width: max-content !important;
        max-width: none !important;
        padding: 0 2px !important;
        box-sizing: border-box !important;
      }

      html.${mobileFixClass}.${fmFixClass} main .chat.fm .fm-tab {
        flex: 0 0 auto !important;
      }

      html.${mobileFixClass}.${fmFixClass} main .chat.fm .fm-tab-label {
        white-space: nowrap !important;
      }

      body > .${fmModeSwitchClass} {
        position: fixed !important;
        left: 50% !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 14px) !important;
        transform: translateX(-50%) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        gap: 4px !important;
        padding: 4px !important;
        border-radius: 999px !important;
        background: rgba(17, 24, 39, 0.92) !important;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28) !important;
        backdrop-filter: blur(8px) !important;
      }

      body > .${fmModeSwitchClass} > .${fmModeButtonClass} {
        border: 0 !important;
        border-radius: 999px !important;
        padding: 8px 14px !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        background: transparent !important;
        color: rgba(255, 255, 255, 0.72) !important;
        appearance: none !important;
        -webkit-appearance: none !important;
      }

      body > .${fmModeSwitchClass} > .${fmModeButtonClass}.is-active {
        background: #ffffff !important;
        color: #111827 !important;
      }

      body > .${fmSiteFrameClass} {
        position: fixed !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border: 0 !important;
        display: none !important;
        background: #ffffff !important;
        z-index: 2147483646 !important;
      }

      html.${mobileFixClass}.${fmFixClass}.${fmSiteModeClass} body {
        overflow: hidden !important;
      }

      html.${mobileFixClass}.${fmFixClass}.${fmSiteModeClass} body > *:not(script):not(.${fmModeSwitchClass}):not(.${fmSiteFrameClass}) {
        display: none !important;
      }

      html.${mobileFixClass}.${fmFixClass}.${fmSiteModeClass} body > .${fmSiteFrameClass} {
        display: block !important;
      }
    `;

    document.head.appendChild(style);
  }

  function normalizeUrl(url) {
    try {
      return new URL(url, window.location.href).href;
    } catch {
      return "";
    }
  }

  function getFmMode() {
    return document.documentElement.classList.contains(fmSiteModeClass) ? "site" : "chat";
  }

  function getFmSiteFrame() {
    return document.querySelector(`body > .${fmSiteFrameClass}`);
  }

  function ensureFmSiteFrame() {
    let frame = getFmSiteFrame();

    if (frame) {
      return frame;
    }

    frame = document.createElement("iframe");
    frame.className = fmSiteFrameClass;
    frame.src = window.location.href;
    frame.title = "FM 일반 화면";
    frame.setAttribute("loading", "eager");
    document.body.appendChild(frame);
    return frame;
  }

  function getFmSiteFrameUrl() {
    const frame = getFmSiteFrame();

    if (!frame) {
      return window.location.href;
    }

    try {
      return frame.contentWindow?.location?.href || frame.src || window.location.href;
    } catch {
      return frame.src || window.location.href;
    }
  }

  function syncFmModeButtons() {
    const currentMode = getFmMode();
    const buttons = document.querySelectorAll(
      `body > .${fmModeSwitchClass} > .${fmModeButtonClass}`
    );

    for (const button of buttons) {
      const isActive = button.dataset.mode === currentMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function setFmMode(mode) {
    if (!isMobile || !isFm || !document.body) {
      return;
    }

    const nextMode = mode === "site" ? "site" : "chat";

    if (nextMode === "site") {
      ensureFmSiteFrame();
      document.documentElement.classList.add(fmSiteModeClass);
      syncFmModeButtons();
      return;
    }

    const frameUrl = normalizeUrl(getFmSiteFrameUrl());
    const currentUrl = normalizeUrl(window.location.href);

    document.documentElement.classList.remove(fmSiteModeClass);
    syncFmModeButtons();

    if (frameUrl && currentUrl && frameUrl !== currentUrl) {
      window.location.href = frameUrl;
    }
  }

  function ensureFmModeSwitch() {
    if (!isMobile || !isFm || !document.body) {
      return;
    }

    let switcher = document.querySelector(`body > .${fmModeSwitchClass}`);

    if (!switcher) {
      switcher = document.createElement("div");
      switcher.className = fmModeSwitchClass;

      for (const [mode, label] of [
        ["chat", "채팅"],
        ["site", "일반"],
      ]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = fmModeButtonClass;
        button.dataset.mode = mode;
        button.textContent = label;
        button.addEventListener("click", () => {
          setFmMode(mode);
        });
        switcher.appendChild(button);
      }

      document.body.appendChild(switcher);
    }

    syncFmModeButtons();
  }

  function initFmMobileUi() {
    if (!isMobile || !isFm) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 40;
    const attachUi = () => {
      attempts += 1;
      ensureFmModeSwitch();

      if (attempts >= maxAttempts) {
        window.clearInterval(timerId);
      }
    };

    const timerId = window.setInterval(attachUi, 500);
    attachUi();

    window.addEventListener("pageshow", () => {
      window.setTimeout(attachUi, 300);
    });
  }

  const isMobile = isMobileDevice();
  const isDc = /(^|\.)dcinside\.com$/.test(window.location.hostname);
  const isFm = /(^|\.)fmkorea\.com$/.test(window.location.hostname);

  if (isMobile) {
    injectMobileOverrides(isDc, isFm);
  }

  fetch(scriptUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((scriptText) => {
      const finalScriptText = patchFmMobileMinScript(scriptText);
      (0, eval)(finalScriptText);

      if (isMobile && isFm) {
        initFmMobileUi();
      }
    })
    .catch((error) => {
      console.error("DCLiveChat 로드 실패", error);
      alert("DCLiveChat 불러오기에 실패했습니다.");
    });
})();
