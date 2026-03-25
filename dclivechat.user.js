// ==UserScript==
// @name         DCLiveChat
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.9.20260325
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
    `;

    document.head.appendChild(style);
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
    })
    .catch((error) => {
      console.error("DCLiveChat 로드 실패", error);
      alert("DCLiveChat 불러오기에 실패했습니다.");
    });
})();
