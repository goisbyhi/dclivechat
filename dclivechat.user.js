// ==UserScript==
// @name         DCLiveChat
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.6.20260325
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

  fetch(scriptUrl, { cache: "no-store" })
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
