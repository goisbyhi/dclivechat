// ==UserScript==
// @name         dclivechat Mobile Reborn Loader
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      3.0.1-20260324-mobile1
// @description  Load the rebuilt mobile dclivechat on supported DCInside and FMKorea pages.
// @homepageURL  https://github.com/goisbyhi/dclivechat
// @supportURL   https://github.com/goisbyhi/dclivechat/issues
// @updateURL    https://raw.githubusercontent.com/goisbyhi/dclivechat/main/dclivechat.mobile.reborn.user.js
// @downloadURL  https://raw.githubusercontent.com/goisbyhi/dclivechat/main/dclivechat.mobile.reborn.user.js
// @match        https://www.fmkorea.com/*
// @match        https://m.fmkorea.com/*
// @match        https://gall.dcinside.com/*
// @match        https://m.dcinside.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      goisbyhi.github.io
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const loaderVersion = '3.0.1-20260324-mobile1';
    const page = typeof unsafeWindow === 'object' && unsafeWindow ? unsafeWindow : window;
    const currentLoaderVersion = page.__dclivechat_mobile_reborn_loader_version__ || '';
    if (page.__dclivechat_mobile_reborn_loader_running__ && currentLoaderVersion === loaderVersion) return;
    page.__dclivechat_mobile_reborn_loader_running__ = true;
    page.__dclivechat_mobile_reborn_loader_version__ = loaderVersion;

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

    const sourceUrl = 'https://raw.githubusercontent.com/goisbyhi/dclivechat/main/min.mobile.reborn.js?v=3.0.1-20260324-mobile1';
    const fail = () => alert('새 모바일 dclivechat 불러오기에 실패했습니다');
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
        .then((response) => {
            if (!response.ok) throw new Error(`load failed: ${response.status}`);
            return response.text();
        })
        .then(run)
        .catch((error) => {
            console.error(error);
            fail();
        });
})();
