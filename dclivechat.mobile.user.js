// ==UserScript==
// @name         dclivechat Mobile Loader
// @namespace    https://github.com/goisbyhi/dclivechat
// @version      2.4.20-20260323-mobile1
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

    const loaderVersion = '2.4.20-20260323-mobile1';
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

    const sourceUrl = 'https://goisbyhi.github.io/dclivechat/min.mobile.js?v=2.4.17-20260323-mobile1';
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

        const GLOBAL_KEY = '__dclivechat_mobile_fm_dc_renderer__';
        const STYLE_ID = 'dclivechat-mobile-fm-dc-renderer-style';
        const SAMPLE_ID = 'dclivechat-mobile-dc-token-sample';
        const OVERLAY_ATTR = 'data-dclivechat-fm-overlay';
        const HIDDEN_ATTR = 'data-dclivechat-fm-hidden';
        const OVERLAY_CLASS = 'dclivechat-dc-renderer';
        const state = window[GLOBAL_KEY] || (window[GLOBAL_KEY] = {});

        if (state.initialized) {
            if (typeof state.scheduleRender === 'function') state.scheduleRender();
            return;
        }
        state.initialized = true;

        const escapeHtml = (text = '') => String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        const toText = (value) => (value?.textContent ?? '').replace(/\\s+/g, ' ').trim();
        const parseCount = (value) => {
            const match = String(value ?? '').match(/[0-9]+/);
            return match ? match[0] : '';
        };
        const setImportant = (node, name, value) => {
            if (!node?.style) return;
            node.style.setProperty(name, value, 'important');
        };
        const getMain = () => document.body?.querySelector(':scope > main') ?? document.querySelector('body > main');
        const getFmChatRoot = () => getMain()?.querySelector(':scope > .chat.fm')
            ?? document.querySelector('main.co > .chat.fm, body > main > .chat.fm');
        const getDcChatRoot = () => getMain()?.querySelector(':scope > .chat:not(.fm)')
            ?? document.querySelector('body > main > .chat:not(.fm)');
        const isOverlayNode = (node) => node instanceof Element && !!node.closest('[' + OVERLAY_ATTR + '="1"]');

        const createTokenSample = () => {
            let sample = document.getElementById(SAMPLE_ID);
            if (sample) return sample;

            sample = document.createElement('main');
            sample.id = SAMPLE_ID;
            sample.setAttribute('aria-hidden', 'true');
            sample.style.position = 'fixed';
            sample.style.left = '-99999px';
            sample.style.top = '0';
            sample.style.width = '360px';
            sample.style.visibility = 'hidden';
            sample.style.pointerEvents = 'none';
            sample.style.zIndex = '-1';
            sample.innerHTML = [
                '<div class="chat">',
                '  <div class="hd"><span class="h">생방송 채팅</span></div>',
                '  <div class="vp"><div class="page">',
                '    <div class="chl">',
                '      <div class="tt r">',
                '        <span>',
                '          <span class="name">닉네임</span>',
                '          <span>: </span>',
                '          <span class="sg">말머리</span>',
                '          <span class="tt">샘플 메시지입니다</span>',
                '          <span class="cm fr">↳ 2</span>',
                '        </span>',
                '      </div>',
                '    </div>',
                '  </div></div>',
                '</div>'
            ].join('');
            (document.body || document.documentElement).appendChild(sample);
            return sample;
        };

        const extractDcDesignTokens = () => {
            if (state.designTokens) return state.designTokens;

            const sample = createTokenSample();
            const chat = sample.querySelector('.chat');
            const header = sample.querySelector('.hd');
            const headerTitle = sample.querySelector('.hd .h');
            const page = sample.querySelector('.vp > .page');
            const line = sample.querySelector('.chl');
            const title = sample.querySelector('.chl > .tt');
            const inline = title?.querySelector(':scope > span');
            const name = inline?.querySelector('.name');
            const badge = inline?.querySelector('.sg');
            const text = inline?.querySelector('.tt');
            const reply = inline?.querySelector('.cm');
            const colonNode = inline?.children?.[1];

            const read = (node) => window.getComputedStyle(node);
            const chatStyle = read(chat);
            const headerStyle = read(header);
            const headerTitleStyle = read(headerTitle);
            const pageStyle = read(page);
            const lineStyle = read(line);
            const titleStyle = read(title);
            const inlineStyle = read(inline);
            const nameStyle = read(name);
            const badgeStyle = read(badge);
            const textStyle = read(text);
            const replyStyle = read(reply);
            const colonStyle = read(colonNode);

            state.designTokens = {
                chatBackground: chatStyle.backgroundColor,
                chatColor: chatStyle.color,
                headerBackground: headerStyle.backgroundColor,
                headerColor: headerTitleStyle.color,
                headerFontSize: headerTitleStyle.fontSize,
                headerFontWeight: headerTitleStyle.fontWeight,
                headerLineHeight: headerTitleStyle.lineHeight,
                headerPadding: headerStyle.padding,
                pageBackground: pageStyle.backgroundColor,
                pagePadding: pageStyle.padding,
                rowOuterPadding: lineStyle.padding,
                titleBackground: titleStyle.backgroundColor,
                titlePadding: titleStyle.padding,
                titleRadius: titleStyle.borderRadius,
                inlineGap: inlineStyle.gap || inlineStyle.columnGap || '6px',
                nameFontSize: nameStyle.fontSize,
                nameFontWeight: nameStyle.fontWeight,
                nameLineHeight: nameStyle.lineHeight,
                badgeFontSize: badgeStyle.fontSize,
                badgeFontWeight: badgeStyle.fontWeight,
                badgeLineHeight: badgeStyle.lineHeight,
                badgeColor: badgeStyle.color,
                badgeBackground: badgeStyle.backgroundColor,
                badgeRadius: badgeStyle.borderRadius,
                badgePadding: badgeStyle.padding,
                textFontSize: textStyle.fontSize,
                textFontWeight: textStyle.fontWeight,
                textLineHeight: textStyle.lineHeight,
                textColor: textStyle.color,
                replyFontSize: replyStyle.fontSize,
                replyFontWeight: replyStyle.fontWeight,
                replyLineHeight: replyStyle.lineHeight,
                replyColor: replyStyle.color,
                colonColor: colonStyle.color || textStyle.color,
                colonFontSize: colonStyle.fontSize || textStyle.fontSize,
                colonLineHeight: colonStyle.lineHeight || textStyle.lineHeight,
            };

            sample.remove();
            return state.designTokens;
        };

        const extractLineData = (line) => {
            if (!(line instanceof Element)) return null;
            const title = line.querySelector(':scope > .tt');
            const inline = title?.querySelector(':scope > span');
            if (!title || !inline) return null;

            const nameNode = inline.querySelector(':scope > .name');
            const badgeNode = inline.querySelector(':scope > .sg');
            const textNode = inline.querySelector(':scope > .tt');
            const replyNode = inline.querySelector(':scope > .cm');
            const timeNode = inline.querySelector(':scope > .time, :scope > .date, :scope > [data-time]');
            const nameColor = nameNode ? window.getComputedStyle(nameNode).color : '';

            return {
                key: line.id || line.getAttribute('data-no') || line.getAttribute('data-document-srl') || '',
                nickname: toText(nameNode),
                badge: toText(badgeNode),
                message: toText(textNode),
                replyCount: parseCount(toText(replyNode)),
                timestamp: toText(timeNode),
                nameColor,
            };
        };

        const extractDcData = (chatRoot = getDcChatRoot()) => {
            if (!chatRoot) return { title: '생방송 채팅', lines: [] };
            return {
                title: toText(chatRoot.querySelector(':scope > .hd .h')) || '생방송 채팅',
                lines: Array.from(chatRoot.querySelectorAll(':scope > .vp > .page > .chl'))
                    .map(extractLineData)
                    .filter((item) => item && (item.nickname || item.message || item.badge)),
            };
        };

        const extractFmData = (chatRoot = getFmChatRoot()) => {
            if (!chatRoot) return { title: '생방송 채팅', lines: [] };
            let rawLines = Array.from(chatRoot.querySelectorAll(':scope > .vp > .page > .chl'));
            if (!rawLines.length) rawLines = Array.from(chatRoot.querySelectorAll('.vp > .page > .chl'));
            if (!rawLines.length) rawLines = Array.from(chatRoot.querySelectorAll('.chl'));

            return {
                title: toText(chatRoot.querySelector(':scope > .hd .h')) || '생방송 채팅',
                lines: rawLines
                    .map(extractLineData)
                    .filter((item) => item && (item.nickname || item.message || item.badge)),
            };
        };

        const ensureRendererStyle = (tokens) => {
            let style = document.getElementById(STYLE_ID);
            if (!style) {
                style = document.createElement('style');
                style.id = STYLE_ID;
                (document.head || document.documentElement || document.body).appendChild(style);
            }
            style.textContent = [
                '[' + OVERLAY_ATTR + '="1"] {',
                '  display: flex !important;',
                '  flex-direction: column !important;',
                '  width: 100vw !important;',
                '  width: 100svw !important;',
                '  max-width: 100vw !important;',
                '  max-width: 100svw !important;',
                '  min-height: 100% !important;',
                '  background: ' + tokens.chatBackground + ' !important;',
                '  color: ' + tokens.chatColor + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__head {',
                '  padding: ' + tokens.headerPadding + ' !important;',
                '  background: ' + tokens.headerBackground + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__head-text {',
                '  color: ' + tokens.headerColor + ' !important;',
                '  font-size: ' + tokens.headerFontSize + ' !important;',
                '  font-weight: ' + tokens.headerFontWeight + ' !important;',
                '  line-height: ' + tokens.headerLineHeight + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__vp {',
                '  display: flex !important;',
                '  flex: 1 1 auto !important;',
                '  width: 100% !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__page {',
                '  width: 100% !important;',
                '  max-width: none !important;',
                '  margin: 0 !important;',
                '  padding: ' + tokens.pagePadding + ' !important;',
                '  background: ' + tokens.pageBackground + ' !important;',
                '  box-sizing: border-box !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__line {',
                '  display: flex !important;',
                '  width: calc(100% - 10px) !important;',
                '  padding: ' + tokens.rowOuterPadding + ' !important;',
                '  box-sizing: border-box !important;',
                '  align-self: stretch !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__title {',
                '  display: flex !important;',
                '  width: 100% !important;',
                '  padding: ' + tokens.titlePadding + ' !important;',
                '  background: ' + tokens.titleBackground + ' !important;',
                '  border-radius: ' + tokens.titleRadius + ' !important;',
                '  box-sizing: border-box !important;',
                '  text-align: left !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__inline {',
                '  display: flex !important;',
                '  flex-direction: row !important;',
                '  flex-wrap: nowrap !important;',
                '  width: 100% !important;',
                '  gap: ' + tokens.inlineGap + ' !important;',
                '  align-items: baseline !important;',
                '  justify-content: flex-start !important;',
                '  text-align: left !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__name {',
                '  flex: 0 0 auto !important;',
                '  white-space: nowrap !important;',
                '  font-size: ' + tokens.nameFontSize + ' !important;',
                '  font-weight: ' + tokens.nameFontWeight + ' !important;',
                '  line-height: ' + tokens.nameLineHeight + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__colon {',
                '  flex: 0 0 auto !important;',
                '  white-space: nowrap !important;',
                '  color: ' + tokens.colonColor + ' !important;',
                '  font-size: ' + tokens.colonFontSize + ' !important;',
                '  line-height: ' + tokens.colonLineHeight + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__badge {',
                '  flex: 0 0 auto !important;',
                '  display: inline-flex !important;',
                '  align-items: center !important;',
                '  white-space: nowrap !important;',
                '  font-size: ' + tokens.badgeFontSize + ' !important;',
                '  font-weight: ' + tokens.badgeFontWeight + ' !important;',
                '  line-height: ' + tokens.badgeLineHeight + ' !important;',
                '  color: ' + tokens.badgeColor + ' !important;',
                '  background: ' + tokens.badgeBackground + ' !important;',
                '  border-radius: ' + tokens.badgeRadius + ' !important;',
                '  padding: ' + tokens.badgePadding + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__text {',
                '  display: block !important;',
                '  flex: 1 1 0 !important;',
                '  min-width: 0 !important;',
                '  white-space: nowrap !important;',
                '  overflow: hidden !important;',
                '  text-overflow: ellipsis !important;',
                '  word-break: keep-all !important;',
                '  overflow-wrap: normal !important;',
                '  color: ' + tokens.textColor + ' !important;',
                '  font-size: ' + tokens.textFontSize + ' !important;',
                '  font-weight: ' + tokens.textFontWeight + ' !important;',
                '  line-height: ' + tokens.textLineHeight + ' !important;',
                '}',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__reply,',
                '[' + OVERLAY_ATTR + '="1"] .' + OVERLAY_CLASS + '__time {',
                '  flex: 0 0 auto !important;',
                '  white-space: nowrap !important;',
                '  color: ' + tokens.replyColor + ' !important;',
                '  font-size: ' + tokens.replyFontSize + ' !important;',
                '  font-weight: ' + tokens.replyFontWeight + ' !important;',
                '  line-height: ' + tokens.replyLineHeight + ' !important;',
                '}'
            ].join('\\n');
        };

        const ensureOverlayRoot = (chatRoot) => {
            let overlay = chatRoot.querySelector(':scope > [' + OVERLAY_ATTR + '="1"]');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = OVERLAY_CLASS;
                overlay.setAttribute(OVERLAY_ATTR, '1');
                chatRoot.appendChild(overlay);
            }
            return overlay;
        };

        const hideOriginalFmUi = (chatRoot, overlay) => {
            for (const child of Array.from(chatRoot.children)) {
                if (child === overlay) continue;
                setImportant(child, 'display', 'none');
                setImportant(child, 'visibility', 'collapse');
                child.setAttribute(HIDDEN_ATTR, '1');
            }
            setImportant(chatRoot, 'padding', '0');
            setImportant(chatRoot, 'overflow', 'hidden');
        };

        const renderLineHtml = (line, tokens) => {
            const nameStyle = line.nameColor ? ' style="color:' + escapeHtml(line.nameColor) + ' !important;"' : '';
            const badgeHtml = line.badge ? '<span class="' + OVERLAY_CLASS + '__badge">' + escapeHtml(line.badge) + '</span>' : '';
            const replyHtml = line.replyCount ? '<span class="' + OVERLAY_CLASS + '__reply">↳ ' + escapeHtml(line.replyCount) + '</span>' : '';
            const timeHtml = line.timestamp ? '<span class="' + OVERLAY_CLASS + '__time">' + escapeHtml(line.timestamp) + '</span>' : '';
            return [
                '<div class="' + OVERLAY_CLASS + '__line" data-key="' + escapeHtml(line.key || '') + '">',
                '  <div class="' + OVERLAY_CLASS + '__title">',
                '    <span class="' + OVERLAY_CLASS + '__inline">',
                line.nickname ? '      <span class="' + OVERLAY_CLASS + '__name"' + nameStyle + '>' + escapeHtml(line.nickname) + '</span>' : '',
                line.nickname ? '      <span class="' + OVERLAY_CLASS + '__colon">: </span>' : '',
                '      ' + badgeHtml,
                '      <span class="' + OVERLAY_CLASS + '__text">' + escapeHtml(line.message || '') + '</span>',
                '      ' + replyHtml,
                '      ' + timeHtml,
                '    </span>',
                '  </div>',
                '</div>'
            ].filter(Boolean).join('');
        };

        const renderDcStyleChat = (data, designTokens) => {
            const chatRoot = getFmChatRoot();
            if (!chatRoot) return;

            ensureRendererStyle(designTokens);
            const overlay = ensureOverlayRoot(chatRoot);
            hideOriginalFmUi(chatRoot, overlay);

            overlay.innerHTML = [
                '<div class="' + OVERLAY_CLASS + '__head"><span class="' + OVERLAY_CLASS + '__head-text">' + escapeHtml(data.title || '생방송 채팅') + '</span></div>',
                '<div class="' + OVERLAY_CLASS + '__vp"><div class="' + OVERLAY_CLASS + '__page">',
                data.lines.map((line) => renderLineHtml(line, designTokens)).join(''),
                '</div></div>'
            ].join('');
        };

        const render = () => {
            const fmChatRoot = getFmChatRoot();
            if (!fmChatRoot) return;

            const designTokens = extractDcDesignTokens();
            const data = extractFmData(fmChatRoot);
            renderDcStyleChat(data, designTokens);
        };

        let scheduled = false;
        const scheduleRender = () => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                render();
            });
        };

        state.extractDcData = extractDcData;
        state.extractFmData = extractFmData;
        state.extractDcDesignTokens = extractDcDesignTokens;
        state.renderDcStyleChat = renderDcStyleChat;
        state.scheduleRender = scheduleRender;

        if (!state.observer) {
            state.observer = new MutationObserver((mutations) => {
                let shouldRender = false;
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;
                    if (isOverlayNode(mutation.target)) continue;
                    if (Array.from(mutation.addedNodes).some((node) => !isOverlayNode(node)) || Array.from(mutation.removedNodes).some((node) => !isOverlayNode(node))) {
                        shouldRender = true;
                        break;
                    }
                }
                if (shouldRender) scheduleRender();
            });
            state.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        }

        if (!state.resizeHandler) {
            state.resizeHandler = () => scheduleRender();
            window.addEventListener('resize', state.resizeHandler, { passive: true });
            window.addEventListener('orientationchange', state.resizeHandler, { passive: true });
        }

        scheduleRender();
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
