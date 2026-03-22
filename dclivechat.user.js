// ==UserScript==
// @name         dclivechat Loader
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.6-20260323
// @description  Load the latest dclivechat build on supported DCInside and FMKorea pages.
// @homepageURL  https://github.com/goisbyhi/dclivechat
// @supportURL   https://github.com/goisbyhi/dclivechat/issues
// @updateURL    https://goisbyhi.github.io/dclivechat/dclivechat.user.js
// @downloadURL  https://goisbyhi.github.io/dclivechat/dclivechat.user.js
// @match        https://www.fmkorea.com/*
// @match        https://m.fmkorea.com/*
// @match        https://gall.dcinside.com/*
// @match        https://m.dcinside.com/*
// @grant        GM_xmlhttpRequest
// @connect      goisbyhi.github.io
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (window.__dclivechat_loader_running__) return;
    window.__dclivechat_loader_running__ = true;

    const sourceUrl = 'https://goisbyhi.github.io/dclivechat/min.js?v=2.4.6-20260323';
    const fail = () => alert('dclivechat 불러오기에 실패했습니다');
    const run = (code) => {
        try {
            (0, eval)(code);
        } catch (error) {
            console.error(error);
            fail();
        }
    };

    if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
            method: 'GET',
            url: sourceUrl,
            onload: (response) => {
                if (!response || response.status < 200 || response.status >= 300 || !response.responseText) {
                    fail();
                    return;
                }
                run(response.responseText);
            },
            onerror: fail,
            ontimeout: fail,
        });
        return;
    }

    fetch(sourceUrl)
        .then((response) => response.text())
        .then(run)
        .catch(fail);
})();
