(() => {
    let ua = navigator.userAgent || '';
    let isAndroid = /Android/i.test(ua);
    let isFm = /(?:^|\.)fmkorea\.(?:com|net|co\.kr)$/i.test(location.hostname);
    let fmBlockedPattern = /에펨코리아 보안 시스템|잠시 기다리면 사이트에 자동으로 접속됩니다|비정상적인 접근|자동으로 접속/i;
    let mobileStyle = `
body {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
}

main {
    --cw: 100vw !important;
    --cw: 100svw !important;
}

main > .video {
    display: none !important;
    visibility: collapse !important;
}

main > .chat {
    width: 100vw !important;
    width: 100svw !important;
    height: 100vh !important;
    height: 100svh !important;
    top: 0 !important;
}

main > .chat > * {
    width: 100vw !important;
    width: 100svw !important;
}

main > .chat > .hd {
    display: flex !important;
    visibility: visible !important;
}

main > .chat .f > .i > textarea {
    width: calc(100vw - 100px) !important;
    width: calc(100svw - 100px) !important;
}

main > .chat > .vp > .page {
    width: 100%;
    max-width: 100%;
    padding: 10px 0 calc(24px + env(safe-area-inset-bottom));
    align-items: stretch;
    box-sizing: border-box;
}

main > .chat .chl,
main > .chat .chl > .tt,
main > .chat .cml {
    width: calc(100% - 10px);
}

main > .chat .chl {
    display: flex !important;
    align-self: stretch;
    padding: 0 5px;
    box-sizing: border-box;
}

main > .chat .chl > .tt {
    display: flex !important;
    width: 100%;
    padding: 9px 10px;
    box-sizing: border-box;
}

main > .chat:not(.fm) .chl {
    align-items: flex-start !important;
    align-self: stretch !important;
}

main > .chat:not(.fm) > .li-c,
main > .chat:not(.fm) > .ri-c,
main > .chat:not(.fm) > .ci-c {
    display: none !important;
    visibility: collapse !important;
}

main > .chat:not(.fm) .chl > .tt {
    display: flex !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main > .chat:not(.fm) .chl > .tt > span {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    width: 100%;
    gap: 6px;
    align-items: baseline !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    text-align: left !important;
}

main > .chat:not(.fm) .chl > .tt > span .name,
main > .chat:not(.fm) .chl > .tt > span .ip,
main > .chat:not(.fm) .chl > .tt > span .sg,
main > .chat:not(.fm) .chl > .tt > span .cm {
    flex: 0 0 auto;
}

main > .chat:not(.fm) .chl > .tt > span .tt {
    display: block !important;
    flex: 1 1 auto;
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
}

main > .chat:not(.fm) .chl > .tt > span > img.nikcon {
    flex: 0 0 auto;
}

main > .chat:not(.fm) .chl > .tt > span * {
    text-align: left !important;
}

main > .chat:not(.fm) > .vp > .page {
    max-width: none !important;
    margin: 0 !important;
}

main > .chat:not(.fm) .chl > .tt > span .name,
main > .chat:not(.fm) .chl > .tt > span .ip,
main > .chat:not(.fm) .chl > .tt > span .sg,
main > .chat:not(.fm) .chl > .tt > span .tt {
    line-height: 1.5 !important;
}

main > .chat > .ci-c {
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 10px calc(12px + env(safe-area-inset-bottom));
    box-sizing: border-box;
}

main > .chat > .ci-c > .sc {
    margin-left: auto;
}

main > .chat > .ci-c .b.gray {
    margin: 0;
    min-width: 44px;
    min-height: 44px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .34);
}

main > .chat > .cb-c > a {
    min-width: 40px;
    min-height: 40px;
    border-radius: 999px;
}

main > .chat > .cb-c > .pd,
main > .chat > .cb-c > .right {
    bottom: calc(10px + env(safe-area-inset-bottom));
}

main > .chat.fm {
    width: 100vw !important;
    width: 100svw !important;
    max-width: 100vw !important;
    max-width: 100svw !important;
}

main.co > .chat.fm > .hd {
    padding: 0 12px;
    box-sizing: border-box;
}

main.co > .chat.fm > .hd .h {
    font-size: 13px;
    letter-spacing: .03em;
}

main.co > .chat.fm > .fm-tabs {
    padding: 10px 10px 8px;
    max-height: min(18svh, 148px);
    overflow-y: auto;
    overscroll-behavior: contain;
    background: rgba(16, 16, 18, .94);
    backdrop-filter: blur(12px);
}

main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
    gap: 8px;
}

main.co > .chat.fm > .fm-tabs .fm-tab {
    min-height: 34px;
    padding: 6px 11px;
    font-size: 12px;
}

main.co > .chat.fm > .fm-tabs .fm-tab-box {
    width: 16px;
    height: 16px;
    margin-top: 0;
}

main.co > .chat.fm .chl,
main.co > .chat.fm .chl > .tt,
main.co > .chat.fm .cml {
    width: calc(100% - 10px);
}

main.co > .chat.fm .chl {
    align-self: stretch;
    padding: 0 5px;
    box-sizing: border-box;
}

main.co > .chat.fm .chl > .tt {
    width: 100%;
    padding: 7px 10px;
    box-sizing: border-box;
}

main.co > .chat.fm .chl > .tt > span {
    display: flex;
    width: 100%;
    gap: 8px;
    align-items: flex-start;
    justify-content: flex-start;
}

main.co > .chat.fm .chl > .tt > span .name {
    flex: 0 0 auto;
    font-weight: 700;
}

main.co > .chat.fm .chl > .tt > span .tt {
    flex: 1 1 auto;
    min-width: 0;
}

main.co > .chat.fm .chl > .tt > span .sg {
    flex: 0 0 auto;
}

main.co > .chat.fm > .vp > .page,
main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
    max-width: none !important;
    margin: 0 !important;
}

@media (max-width: 520px) {
    main.co > .chat.fm > .hd {
        height: 46px;
        padding: 0 10px;
    }

    main.co > .chat.fm > .hd .h {
        font-size: 12px;
    }

    main.co > .chat.fm > .fm-tabs {
        padding: 8px 8px 6px;
        max-height: min(16svh, 112px);
    }

    main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
        gap: 6px;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab {
        min-height: 30px;
        padding: 5px 10px;
        font-size: 12px;
    }

    main.co > .chat.fm .chl > .tt {
        padding: 6px 9px;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab-box {
        width: 14px;
        height: 14px;
    }

    main > .chat > .vp > .page {
        padding-bottom: calc(18px + env(safe-area-inset-bottom));
    }

    main > .chat .chl,
    main > .chat .chl > .tt,
    main > .chat .cml {
        width: calc(100% - 8px);
    }

    main > .chat .chl {
        padding: 0 4px;
    }

    main > .chat .chl > .tt {
        padding: 8px 9px;
    }

    main > .chat .chl > .tt > span {
        gap: 6px;
    }

    main > .chat .chl > .tt > span .name,
    main > .chat .chl > .tt > span .tt {
        font-size: 14px;
    }

    main > .chat .chl > .tt > span .sg {
        font-size: 10px;
    }
}

@media (min-width: 521px) and (max-width: 980px) {
    main.co > .chat.fm > .hd {
        padding: 0 18px;
    }

    main.co > .chat.fm > .hd .h {
        font-size: 14px;
    }

    main.co > .chat.fm > .fm-tabs {
        padding: 12px 14px 10px;
        max-height: min(19svh, 136px);
    }

    main.co > .chat.fm > .fm-tabs .fm-tabs-wrap,
    main > .chat > .vp > .page {
        max-width: 860px;
        margin: 0 auto;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab {
        min-height: 34px;
        padding: 6px 12px;
        font-size: 13px;
    }

    main.co > .chat.fm .chl,
    main.co > .chat.fm .chl > .tt,
    main.co > .chat.fm .cml {
        width: calc(100% - 18px);
    }

    main.co > .chat.fm .chl {
        padding: 0 9px;
    }

    main.co > .chat.fm .chl > .tt {
        padding: 8px 12px;
    }

    main.co > .chat.fm .chl > .tt > span .name,
    main.co > .chat.fm .chl > .tt > span .tt {
        font-size: 15px;
    }
}

@media (max-height: 540px) {
    main.co > .chat.fm > .fm-tabs {
        max-height: 96px;
    }

    main.co > .chat.fm > .ci-c {
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
    }
}
`;
    let currentDocumentHtml = () => document.documentElement?.outerHTML ?? '';
    let parseHtml = (html = '') => {
        try {
            return new DOMParser().parseFromString(html, 'text/html');
        } catch {
            let page = document.implementation.createHTMLDocument('');
            page.documentElement.innerHTML = html;
            return page;
        }
    };
    let getNodeText = (node) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();
    let escapeHtml = (text = '') => text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    let escapeAttr = (text = '') => escapeHtml(text);
    let looksLikeFmBoardHtml = (html = '') =>
        (
            /<tr\b/i.test(html)
            && /(class=(["'])[^"'<>]*\btitle\b[^"'<>]*\2|<td[^>]*class=(["'])[^"'<>]*\btitle\b[^"'<>]*\3)/i.test(html)
        )
        || /data-dclivechat-fm-normalized=/.test(html);
    let convertMobileFmListHtml = (html = '', baseUrl = location.href) => {
        if (!html || /data-dclivechat-fm-normalized=/.test(html)) return html;
        if (/<tr\b/i.test(html) && /(class=(["'])[^"'<>]*\btitle\b[^"'<>]*\2|<td[^>]*class=(["'])[^"'<>]*\btitle\b[^"'<>]*\3)/i.test(html)) {
            return html;
        }

        let page = parseHtml(html);
        let board = page.querySelector('ol.bd_lst, ol.bd_m_lst, .bd_lst.bd_m_lst');
        if (!board) return html;

        let items = Array.from(board.children).filter((node) => node?.tagName == 'LI');
        if (!items.length) return html;

        let rows = [];
        for (let item of items) {
            let titleLink = item.querySelector('h3 a[href*="document_srl"], a.hx[href*="document_srl"], a[href*="document_srl"]');
            let href = titleLink?.getAttribute('href') ?? '';
            let numMatch = href.match(/document_srl=([0-9]+)/);
            let num = numMatch?.[1] ?? '';
            if (!num) continue;

            let title = getNodeText(item.querySelector('h3 a[href*="document_srl"]'))
                || getNodeText(item.querySelector('a.hx .blind'))
                || getNodeText(titleLink);
            if (!title) continue;

            let infoSpans = Array.from(item.querySelectorAll('.info > span'));
            let subject = getNodeText(
                infoSpans.find((span) => span.querySelector('.fa-bars'))?.querySelector('b')
                ?? item.querySelector('.info .fa-bars + b')
            );
            let author = getNodeText(
                infoSpans.find((span) => span.querySelector('.fa-user'))
            ).replace(/^.*?fa-user/i, '').trim();
            if (!author) {
                author = getNodeText(item.querySelector('.info .fa-user')?.parentElement);
            }
            let replyCount = getNodeText(item.querySelector('.replyNum, .comment_count')).match(/[0-9]+/)?.[0] ?? '';
            let rowClass = (item.className || '').trim() || 'clear';
            let titleHref = href;
            try {
                titleHref = new URL(href, baseUrl).href;
            } catch {}

            rows.push(
                `<tr class="${escapeAttr(rowClass)}" data-document-srl="${escapeAttr(num)}">`
                + `<td class="cate"><a>${escapeHtml(subject)}</a></td>`
                + `<td class="title"><a href="${escapeAttr(titleHref)}">${escapeHtml(title)}</a>${replyCount ? `<a class="replyNum">[${escapeHtml(replyCount)}]</a>` : ''}</td>`
                + `<td class="author"><a class="member">${escapeHtml(author)}</a></td>`
                + `</tr>`
            );
        }

        if (!rows.length) return html;
        return `${html}<table data-dclivechat-fm-normalized="1"><tbody>${rows.join('')}</tbody></table>`;
    };
    let normalizeFmBoardHtml = (html = '', baseUrl = location.href) => convertMobileFmListHtml(html, baseUrl);
    let createHtmlResponse = (html, status = 200) => new Response(html, {
        status,
        headers: {
            'content-type': 'text/html; charset=utf-8',
        },
    });
    let loadHtmlByFrame = (url) => new Promise((resolve) => {
        let root = document.body || document.documentElement || document.head;
        if (!root) return resolve(createHtmlResponse(document.documentElement?.outerHTML ?? '', 200));

        let frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;
        frame.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;border:0;visibility:hidden;';

        let settled = false;
        let finish = (response) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            frame.remove();
            resolve(response);
        };
        let timer = setTimeout(() => {
            finish(createHtmlResponse(currentDocumentHtml(), 200));
        }, 15000);

        frame.onload = () => {
            try {
                let html = frame.contentDocument?.documentElement?.outerHTML ?? '';
                if (!html) html = currentDocumentHtml();
                finish(createHtmlResponse(normalizeFmBoardHtml(html, url), 200));
            } catch {
                finish(createHtmlResponse(normalizeFmBoardHtml(currentDocumentHtml(), url), 200));
            }
        };
        frame.onerror = () => {
            finish(createHtmlResponse(normalizeFmBoardHtml(currentDocumentHtml(), url), 502));
        };

        root.appendChild(frame);
        frame.src = url;
    });
    let injectStyle = () => {
        if (document.getElementById('dclivechat-mobile-style')) return;
        let root = document.head || document.documentElement || document.body;
        if (!root) return;
        let style = document.createElement('style');
        style.id = 'dclivechat-mobile-style';
        style.textContent = mobileStyle;
        root.appendChild(style);
    };

    if (!navigator.clipboard) {
        try {
            Object.defineProperty(navigator, 'clipboard', {
                value: {},
                configurable: true,
            });
        } catch {}
    }

    if (isAndroid) {
        try {
            Object.defineProperty(window, 'Worker', {
                value: undefined,
                configurable: true,
            });
        } catch {}
    }

    if (isFm && typeof window.fetch === 'function') {
        let nativeFetch = window.fetch.bind(window);
        window.fetch = async (input, init = {}) => {
            let requestUrl = typeof input === 'string' ? input : (input?.url ?? '');
            let method = (init?.method ?? input?.method ?? 'GET').toUpperCase();
            let resolvedUrl = '';
            try {
                resolvedUrl = new URL(requestUrl, location.href).href;
            } catch {
                resolvedUrl = requestUrl;
            }
            let sameOrigin = resolvedUrl.startsWith(location.origin + '/');
            if (!sameOrigin || method !== 'GET') return nativeFetch(input, init);

            try {
                let response = await nativeFetch(input, init);
                let text = await response.clone().text().catch(() => '');
                if (response.ok && text && !fmBlockedPattern.test(text)) {
                    let normalized = normalizeFmBoardHtml(text, resolvedUrl);
                    if (looksLikeFmBoardHtml(normalized)) {
                        return createHtmlResponse(normalized, response.status);
                    }
                }
            } catch {}

            if (/listStyle=list/i.test(resolvedUrl)) {
                let html = normalizeFmBoardHtml(currentDocumentHtml(), location.href);
                if (looksLikeFmBoardHtml(html)) {
                    return createHtmlResponse(html, 200);
                }
                return loadHtmlByFrame(resolvedUrl);
            }

            return loadHtmlByFrame(resolvedUrl);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(injectStyle, 0), { once: true });
    } else {
        setTimeout(injectStyle, 0);
    }
})();
