// ==UserScript==
// @name         dclivechat Mobile Loader
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.20-20260324-mobile1
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

    const loaderVersion = '2.4.20-20260324-mobile1';
    const page = typeof unsafeWindow === 'object' && unsafeWindow ? unsafeWindow : window;
    const currentLoaderVersion = page.__dclivechat_mobile_loader_version__ || '';
    if ((page.__dclivechat_loader_running__ || page.__dclivechat_mobile_loader_running__) && currentLoaderVersion === loaderVersion) return;
    page.__dclivechat_loader_running__ = true;
    page.__dclivechat_mobile_loader_running__ = true;
    page.__dclivechat_mobile_loader_version__ = loaderVersion;

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

    const sourceUrl = 'https://goisbyhi.github.io/dclivechat/min.mobile.js?v=2.4.20-20260324-mobile1';
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
    const buildFmPostPatchCode = () => `(() => {
        'use strict';

        if (!/(^|\\.)fmkorea\\./.test(location.host)) return;

        const globalKey = '__dclivechat_mobile_fm_post_patch__';
        const state = window[globalKey] || (window[globalKey] = {});
        if (state.initialized) {
            if (typeof state.scheduleApply === 'function') state.scheduleApply();
            return;
        }
        state.initialized = true;

        const STYLE_ID = 'dclivechat-mobile-fm-patch-style';
        const LINE_MARK = 'data-dclivechat-fm-line-patched';

        const setImportant = (element, property, value) => {
            if (!element || !element.style) return;
            element.style.setProperty(property, value, 'important');
        };

        const getCompactDeviceFlag = () => {
            const widthCandidates = [
                window.innerWidth,
                window.innerHeight,
                window.visualViewport && window.visualViewport.width,
                window.visualViewport && window.visualViewport.height,
                window.screen && window.screen.width,
                window.screen && window.screen.height,
            ].filter((value) => Number.isFinite(value) && value > 0);
            const shortSide = widthCandidates.length ? Math.min(...widthCandidates) : 0;
            return shortSide > 0 && shortSide <= 430;
        };

        const updateCompactDeviceFlag = () => {
            document.documentElement.dataset.dclivechatCompactDevice = getCompactDeviceFlag() ? '1' : '0';
        };

        const ensureViewportMeta = () => {
            let meta = document.querySelector('meta[name="viewport"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'viewport';
                (document.head || document.documentElement || document.body).appendChild(meta);
            }
            meta.setAttribute('content', 'width=device-width, initial-scale=1');
        };

        const ensureStyle = () => {
            if (document.getElementById(STYLE_ID)) return;
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = [
                "html { text-size-adjust: 175% !important; -webkit-text-size-adjust: 175% !important; }",
                "body { zoom: 1.28 !important; }",
                "main.co > .chat.fm > .hd .h {",
                "  font-size: 18px !important;",
                "}",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm > .hd .h {",
                "  font-size: 19px !important;",
                "}",
                "main.co > .chat.fm .chl > .tt > span .name,",
                "main.co > .chat.fm .chl > .tt > span .tt {",
                "  font-size: 19px !important;",
                "  line-height: 1.72 !important;",
                "}",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm .chl > .tt > span .name,",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm .chl > .tt > span .tt {",
                "  font-size: 20px !important;",
                "  line-height: 1.76 !important;",
                "}",
                "main.co > .chat.fm .chl > .tt > span .ip,",
                "main.co > .chat.fm .chl > .tt > span .sg,",
                "main.co > .chat.fm .chl > .tt > span .cm {",
                "  font-size: 14px !important;",
                "  line-height: 1.52 !important;",
                "}",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm .chl > .tt > span .ip,",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm .chl > .tt > span .sg,",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm .chl > .tt > span .cm {",
                "  font-size: 15px !important;",
                "}",
                "main.co > .chat.fm > .fm-tabs .fm-tab { font-size: 16px !important; }",
                "html[data-dclivechat-compact-device=\\"1\\"] main.co > .chat.fm > .fm-tabs .fm-tab { font-size: 17px !important; }"
            ].join('\\n');
            (document.head || document.documentElement || document.body).appendChild(style);
        };

        const applyMinimumTextSize = () => {
            const elements = Array.from(document.querySelectorAll('body *'));
            for (const element of elements) {
                const hasText = Array.from(element.childNodes).some(
                    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
                );
                if (!hasText) continue;

                const style = window.getComputedStyle(element);
                const size = parseFloat(style.fontSize || '0');
                if (!Number.isNaN(size) && size > 0 && size < 16) {
                    setImportant(element, 'font-size', '19px');
                    setImportant(element, 'line-height', '1.56');
                }
            }
        };

        const getChatRoot = () => document.querySelector('main.co > .chat.fm') || document.querySelector('body > main > .chat.fm');

        const applyInlineFontSizing = (inline, compact) => {
            const content = inline.querySelector('.tt');
            const name = inline.querySelector('.name');
            const ip = inline.querySelector('.ip');
            const sg = inline.querySelector('.sg');
            const cm = inline.querySelector('.cm');
            const contentFont = compact ? '20px' : '19px';
            const contentLineHeight = compact ? '1.76' : '1.72';
            const metaFont = compact ? '15px' : '14px';

            if (name) {
                setImportant(name, 'font-size', contentFont);
                setImportant(name, 'line-height', contentLineHeight);
            }
            if (content) {
                setImportant(content, 'font-size', contentFont);
                setImportant(content, 'line-height', contentLineHeight);
            }
            [ip, sg, cm].forEach((node) => {
                if (!node) return;
                setImportant(node, 'font-size', metaFont);
                setImportant(node, 'line-height', '1.52');
            });
        };

        const applyFmLinePatch = (line) => {
            if (!(line instanceof HTMLElement) || !line.classList.contains('chl')) return;

            const title = line.querySelector(':scope > .tt');
            const inline = title ? title.querySelector(':scope > span') : null;
            if (!title || !inline) return;

            const compact = document.documentElement.dataset.dclivechatCompactDevice === '1';

            line.setAttribute(LINE_MARK, '1');
            setImportant(line, 'display', 'flex');
            setImportant(line, 'flex-direction', 'row');
            setImportant(line, 'align-items', 'flex-start');

            setImportant(title, 'display', 'flex');
            setImportant(title, 'width', '100%');
            setImportant(title, 'text-align', 'left');
            setImportant(title, 'flex-direction', 'row');
            setImportant(title, 'align-items', 'baseline');
            setImportant(title, 'justify-content', 'flex-start');
            setImportant(title, 'min-width', '0');

            setImportant(inline, 'display', 'flex');
            setImportant(inline, 'flex-direction', 'row');
            setImportant(inline, 'flex-wrap', 'wrap');
            setImportant(inline, 'justify-content', 'flex-start');
            setImportant(inline, 'align-items', 'baseline');
            setImportant(inline, 'align-content', 'flex-start');
            setImportant(inline, 'row-gap', '2px');
            setImportant(inline, 'column-gap', '6px');
            setImportant(inline, 'width', '100%');

            applyInlineFontSizing(inline, compact);

            Array.from(inline.children).forEach((child) => {
                if (!(child instanceof HTMLElement)) return;
                if (child.classList.contains('tt')) {
                    setImportant(child, 'display', 'block');
                    setImportant(child, 'flex', '1 1 100%');
                    setImportant(child, 'min-width', '0');
                    setImportant(child, 'white-space', 'normal');
                    setImportant(child, 'overflow', 'visible');
                    setImportant(child, 'text-overflow', 'clip');
                    setImportant(child, 'overflow-wrap', 'anywhere');
                    setImportant(child, 'word-break', 'break-word');
                    setImportant(child, 'line-height', compact ? '1.68' : '1.65');
                } else {
                    setImportant(child, 'flex', '0 0 auto');
                    setImportant(child, 'white-space', 'nowrap');
                    setImportant(child, 'align-self', 'baseline');
                }
            });
        };

        const applyTabsPatch = () => {
            const compact = document.documentElement.dataset.dclivechatCompactDevice === '1';
            document.querySelectorAll('main.co > .chat.fm > .fm-tabs .fm-tab').forEach((tab) => {
                setImportant(tab, 'font-size', compact ? '17px' : '16px');
            });
        };

        const applyAllFmLinePatches = () => {
            const root = getChatRoot();
            if (!root) return;
            root.querySelectorAll('.chl').forEach(applyFmLinePatch);
            applyTabsPatch();
        };

        const logFirstLineStyles = () => {
            const root = getChatRoot();
            if (!root) return;
            const firstText = root.querySelector('.chl > .tt > span .tt');
            if (!(firstText instanceof HTMLElement)) return;
            const style = window.getComputedStyle(firstText);
            console.log('[dclivechat mobile fm patch]', {
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                whiteSpace: style.whiteSpace,
                textOverflow: style.textOverflow,
            });
        };

        let scheduled = false;
        const scheduleApply = () => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                updateCompactDeviceFlag();
                ensureViewportMeta();
                ensureStyle();
                applyMinimumTextSize();
                applyAllFmLinePatches();
                logFirstLineStyles();
            });
        };

        state.scheduleApply = scheduleApply;

        const observeRoot = () => {
            if (state.observer) return;
            state.observer = new MutationObserver((mutations) => {
                let shouldApply = false;
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;
                    if (mutation.addedNodes.length || mutation.removedNodes.length) {
                        shouldApply = true;
                        break;
                    }
                }
                if (shouldApply) scheduleApply();
            });
            state.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        };

        if (!state.resizeHandler) {
            state.resizeHandler = () => scheduleApply();
            window.addEventListener('resize', state.resizeHandler, { passive: true });
            window.addEventListener('orientationchange', state.resizeHandler, { passive: true });
        }

        updateCompactDeviceFlag();
        ensureViewportMeta();
        ensureStyle();
        applyMinimumTextSize();
        observeRoot();
        scheduleApply();
    })();`;
    const runFmPostPatch = () => {
        if (!/(^|\.)fmkorea\./.test(location.host)) return;
        try {
            run(buildFmPostPatchCode());
        } catch (error) {
            console.error(error);
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
                runFmPostPatch();
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
        .then((code) => {
            run(code);
            runFmPostPatch();
        })
        .catch((error) => {
            console.error(error);
            fail();
        });
})();
