// ==UserScript==
// @name         dclivechat Mobile Loader
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.8-20260323-mobile1
// @description  Load the mobile-safe dclivechat build on supported DCInside and FMKorea pages.
// @homepageURL  https://github.com/goisbyhi/dclivechat
// @supportURL   https://github.com/goisbyhi/dclivechat/issues
// @updateURL    https://goisbyhi.github.io/dclivechat/dclivechat.mobile.user.js
// @downloadURL  https://goisbyhi.github.io/dclivechat/dclivechat.mobile.user.js
// @match        https://www.fmkorea.com/*
// @match        https://m.fmkorea.com/*
// @match        https://gall.dcinside.com/*
// @match        https://m.dcinside.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      goisbyhi.github.io
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const page = typeof unsafeWindow === 'object' && unsafeWindow ? unsafeWindow : window;
    if (page.__dclivechat_loader_running__ || page.__dclivechat_mobile_loader_running__) return;
    page.__dclivechat_loader_running__ = true;
    page.__dclivechat_mobile_loader_running__ = true;

    if (/^m\.fmkorea\./.test(location.host)) {
        location.replace(location.href.replace('//m.', '//www.'));
        return;
    }

    if (location.host === 'm.dcinside.com') {
        const pathMatch = location.pathname.match(/^\/(board|mini)\/([A-Za-z0-9_]+)/);
        if (pathMatch) {
            let gallTypePath = '';
            if (pathMatch[1] === 'mini') gallTypePath = '/mini';
            else if (document.getElementsByClassName('micon').length > 0) gallTypePath = '/mgallery';
            location.replace(`https://gall.dcinside.com${gallTypePath}/board/lists?id=${pathMatch[2]}`);
            return;
        }
    }

    const sourceUrl = 'https://goisbyhi.github.io/dclivechat/min.mobile.js?v=2.4.8-20260323-mobile1';
    const fail = () => alert('dclivechat 모바일 로더를 불러오지 못했습니다');
    const inject = (code) => {
        const root = document.head || document.documentElement || document.body;
        if (!root) throw new Error('no injection root');
        const script = document.createElement('script');
        script.textContent = code;
        root.appendChild(script);
        script.remove();
    };
    const run = (code) => {
        try {
            if (typeof unsafeWindow === 'object' && unsafeWindow && typeof unsafeWindow.eval === 'function') {
                unsafeWindow.eval(code);
                return;
            }
            inject(code);
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
