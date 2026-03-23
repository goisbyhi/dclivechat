(() => {
    let ua = navigator.userAgent || '';
    let isAndroid = /Android/i.test(ua);
    let isFm = /(?:^|\.)fmkorea\.(?:com|net|co\.kr)$/i.test(location.hostname);
    let fmBlockedPattern = /에펨코리아 보안 시스템|잠시 기다리면 사이트에 자동으로 접속됩니다|비정상적인 접근|자동으로 접속/i;
    let mobileBuildVersion = '2.4.21-20260324-mobile1';
    let fmSnapshotHtml = '';
    let fmSnapshotUrl = '';
    let fmBlockedUntil = 0;
    let fmLastListFetchAt = 0;
    let fmMinListFetchInterval = 15000;
    let fmShortRetrySeconds = 15;
    let mobileLayoutObserverStarted = false;
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
main > .chat:not(.fm) > .ci-c,
main > .chat:not(.fm) > .cb-c {
    display: none !important;
    visibility: collapse !important;
}

main > .chat:not(.fm) .chl > .tt {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main > .chat:not(.fm) .chl > .tt > span {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    width: 100%;
    gap: 6px;
    align-items: baseline !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    text-align: left !important;
    align-self: stretch !important;
}

main > .chat:not(.fm) .chl > .tt > span .name,
main > .chat:not(.fm) .chl > .tt > span .ip,
main > .chat:not(.fm) .chl > .tt > span .sg,
main > .chat:not(.fm) .chl > .tt > span .cm {
    flex: 0 0 auto;
    align-self: baseline !important;
    white-space: nowrap !important;
}

main > .chat:not(.fm) .chl > .tt > span .tt {
    display: block !important;
    flex: 1 1 0;
    min-width: 0;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    word-break: keep-all !important;
    overflow-wrap: normal !important;
    line-break: auto !important;
    align-self: baseline !important;
}

main > .chat:not(.fm) .chl > .tt > span > img.nikcon {
    flex: 0 0 auto;
    align-self: baseline !important;
}

main > .chat:not(.fm) .chl > .tt > span * {
    text-align: left !important;
}

main > .chat:not(.fm) .cml,
main > .chat:not(.fm) .cml > .vp,
main > .chat:not(.fm) .cml > .vp > .page,
main > .chat:not(.fm) .cml > .vp > .page > .text {
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main > .chat:not(.fm) .cml .text {
    width: 100% !important;
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
    font-size: 16px;
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
    font-size: 15px;
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
    align-items: flex-start !important;
    align-self: stretch;
    padding: 0 5px;
    box-sizing: border-box;
}

main.co > .chat.fm .chl > .tt {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
    width: 100%;
    padding: 7px 10px;
    box-sizing: border-box;
}

main.co > .chat.fm .chl > .tt > span {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    width: 100%;
    gap: 6px;
    align-items: baseline !important;
    justify-content: flex-start !important;
    align-content: flex-start !important;
    text-align: left !important;
    align-self: stretch !important;
}

main.co > .chat.fm .chl > .tt > span .name,
main.co > .chat.fm .chl > .tt > span .ip,
main.co > .chat.fm .chl > .tt > span .sg,
main.co > .chat.fm .chl > .tt > span .cm {
    flex: 0 0 auto;
    align-self: baseline !important;
    white-space: nowrap !important;
}

main.co > .chat.fm .chl > .tt > span .name {
    font-weight: 700;
}

main.co > .chat.fm .chl > .tt > span .name,
main.co > .chat.fm .chl > .tt > span .tt {
    font-size: 18px !important;
    line-height: 1.68 !important;
}

main.co > .chat.fm .chl > .tt > span .ip,
main.co > .chat.fm .chl > .tt > span .sg,
main.co > .chat.fm .chl > .tt > span .cm {
    font-size: 13px !important;
    line-height: 1.5 !important;
}

main.co > .chat.fm .chl > .tt > span .tt {
    display: block !important;
    flex: 1 1 0;
    min-width: 0;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    word-break: keep-all !important;
    overflow-wrap: normal !important;
    line-break: auto !important;
    align-self: baseline !important;
}

main.co > .chat.fm > .vp > .page,
main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
    max-width: none !important;
    margin: 0 !important;
}

main.co > .chat.fm .chl > .tt > span > img.nikcon {
    flex: 0 0 auto;
    align-self: baseline !important;
}

main.co > .chat.fm .chl > .tt > span * {
    text-align: left !important;
}

main.co > .chat.fm .cml,
main.co > .chat.fm .cml > .vp,
main.co > .chat.fm .cml > .vp > .page,
main.co > .chat.fm .cml > .vp > .page > .text {
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main.co > .chat.fm .cml .text {
    width: 100% !important;
}

main.co > .chat.fm .chl > .tt > span .name,
main.co > .chat.fm .chl > .tt > span .tt {
    line-height: 1.68 !important;
}

main.co > .chat.fm .chl > .tt > span .ip,
main.co > .chat.fm .chl > .tt > span .sg,
main.co > .chat.fm .chl > .tt > span .cm {
    line-height: 1.5 !important;
}

main > .chat.fm > .li-c,
main > .chat.fm > .ri-c,
main > .chat.fm > .ci-c,
main > .chat.fm > .cb-c {
    display: none !important;
    visibility: collapse !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .hd {
    height: 50px !important;
    padding: 0 12px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .hd .h {
    font-size: 18px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .fm-tabs {
    padding: 10px 10px 8px !important;
    max-height: min(18svh, 148px) !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
    gap: 8px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .fm-tabs .fm-tab {
    min-height: 34px !important;
    padding: 6px 11px !important;
    font-size: 16px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl,
html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt,
html[data-dclivechat-compact-device="1"] main.co > .chat.fm .cml {
    width: calc(100% - 8px) !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl {
    padding: 0 4px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt {
    padding: 8px 9px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt > span .name,
html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt > span .tt {
    font-size: 19px !important;
    line-height: 1.72 !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt > span .ip,
html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt > span .sg,
html[data-dclivechat-compact-device="1"] main.co > .chat.fm .chl > .tt > span .cm {
    font-size: 14px !important;
    line-height: 1.55 !important;
}

@media (max-width: 520px) {
    main.co > .chat.fm > .hd {
        height: 48px;
        padding: 0 12px;
    }

    main.co > .chat.fm > .hd .h {
        font-size: 16px !important;
    }

    main.co > .chat.fm > .fm-tabs {
        padding: 10px 10px 8px;
        max-height: min(18svh, 148px);
    }

    main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
        gap: 8px;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab {
        min-height: 34px;
        padding: 6px 11px;
        font-size: 15px !important;
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

    main.co > .chat.fm .chl,
    main.co > .chat.fm .chl > .tt,
    main.co > .chat.fm .cml {
        width: calc(100% - 8px);
    }

    main.co > .chat.fm .chl {
        padding: 0 4px;
    }

    main.co > .chat.fm .chl > .tt {
        padding: 8px 9px;
    }

    main.co > .chat.fm .chl > .tt > span .name,
    main.co > .chat.fm .chl > .tt > span .tt {
        font-size: 18px !important;
    }

    main.co > .chat.fm .chl > .tt > span .ip,
    main.co > .chat.fm .chl > .tt > span .sg,
    main.co > .chat.fm .chl > .tt > span .cm {
        font-size: 12px !important;
    }
}

@media (min-width: 521px) and (max-width: 980px) {
    main.co > .chat.fm > .hd {
        padding: 0 18px;
    }

    main.co > .chat.fm > .hd .h {
        font-size: 17px;
    }

    main.co > .chat.fm > .fm-tabs {
        padding: 12px 14px 10px;
        max-height: min(19svh, 136px);
    }

    main > .chat:not(.fm) > .vp > .page {
        max-width: 860px;
        margin: 0 auto;
    }

    main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
        max-width: none !important;
        margin: 0 !important;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab {
        min-height: 34px;
        padding: 6px 12px;
        font-size: 15px;
    }

    main.co > .chat.fm .chl,
    main.co > .chat.fm .chl > .tt,
    main.co > .chat.fm .cml {
        width: calc(100% - 10px);
    }

    main.co > .chat.fm .chl {
        padding: 0 5px;
    }

    main.co > .chat.fm .chl > .tt {
        padding: 9px 10px;
    }

    main.co > .chat.fm .chl > .tt > span .name,
    main.co > .chat.fm .chl > .tt > span .tt {
        font-size: 18px;
        line-height: 1.7;
    }

    main.co > .chat.fm .chl > .tt > span .ip,
    main.co > .chat.fm .chl > .tt > span .sg,
    main.co > .chat.fm .chl > .tt > span .cm {
        font-size: 13px;
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
    let convertDesktopFmListHtml = (html = '', baseUrl = location.href) => {
        if (!html || /data-dclivechat-fm-normalized=/.test(html)) return html;

        let page = parseHtml(html);
        let rows = [];
        for (let item of page.querySelectorAll('tr.us-post[data-no], tr.notice[data-no], tr[class*="us-post"][data-no]')) {
            let num = (item.getAttribute('data-no') || '').trim();
            if (!num) continue;

            let subject = getNodeText(item.querySelector('td.gall_subject a, td.gall_subject, td.gall_num'));
            if (subject == '공지' || subject == 'AD') continue;

            let titleLink = item.querySelector('td.gall_tit a[href], td.title a[href], td.gall_tit > a[href]');
            let title = getNodeText(titleLink ?? item.querySelector('td.gall_tit, td.title'));
            if (!title) continue;

            let titleHref = titleLink?.getAttribute('href') ?? '';
            try {
                titleHref = new URL(titleHref, baseUrl).href;
            } catch {}

            let replyCount = getNodeText(item.querySelector('.reply_num, .replyNum, .comment_count')).match(/[0-9]+/)?.[0] ?? '';
            let writer = item.querySelector('td.gall_writer, td.author');
            let authorLink = writer?.querySelector('a');
            let authorClass = (authorLink?.className || '').trim();
            let author = getNodeText(authorLink ?? writer);
            let authorImg = authorLink?.querySelector('img')?.getAttribute('src') ?? '';
            let authorImgHtml = authorImg ? `<img src="${escapeAttr(authorImg)}">` : '';

            rows.push(
                `<tr class="us-post dclivechat-fm-row" data-dclivechat-fm-normalized="1" data-no="${escapeAttr(num)}">`
                + `<td class="cate"><a>${escapeHtml(subject)}</a></td>`
                + `<td class="title"><a href="${escapeAttr(titleHref)}">${escapeHtml(title)}</a>${replyCount ? `<a class="replyNum">[${escapeHtml(replyCount)}]</a>` : ''}</td>`
                + `<td class="author"><a class="${escapeAttr(authorClass || 'member')}" data-no="${escapeAttr(num)}">${authorImgHtml}${escapeHtml(author)}</a></td>`
                + `</tr>`
            );
        }

        if (!rows.length) return html;
        return `${html}<table data-dclivechat-fm-normalized="1"><tbody>${rows.join('')}</tbody></table>`;
    };
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
    let normalizeFmBoardHtml = (html = '', baseUrl = location.href) => {
        let normalized = convertDesktopFmListHtml(html, baseUrl);
        return convertMobileFmListHtml(normalized, baseUrl);
    };
    let rememberFmBoardHtml = (html = '', baseUrl = location.href) => {
        let normalized = normalizeFmBoardHtml(html, baseUrl);
        if (looksLikeFmBoardHtml(normalized)) {
            fmSnapshotHtml = normalized;
            fmSnapshotUrl = baseUrl;
        }
        return normalized;
    };
    let sanitizeResponseStatus = (status = 200) => {
        let numeric = Number.parseInt(status, 10) || 0;
        if (numeric < 200 || numeric > 599) return 502;
        return numeric;
    };
    let createHtmlResponse = (html, status = 200, extraHeaders = {}) => new Response(html, {
        status: sanitizeResponseStatus(status),
        headers: {
            'content-type': 'text/html; charset=utf-8',
            ...extraHeaders,
        },
    });
    let createBlockedResponse = (html = '', status = 430, retryAfter = 0) => {
        let headers = {};
        if (retryAfter > 0) headers['retry-after'] = String(retryAfter);
        return createHtmlResponse(html || '에펨코리아 보안 시스템', status, headers);
    };
    let getRetryAfterSeconds = (response) => Number.parseInt(response?.headers?.get('retry-after') ?? '0', 10) || 0;
    let getRetryAfterHeaders = (seconds = 0) => seconds > 0 ? {
        'retry-after': String(seconds),
    } : {};
    let isFmListUrl = (url = '') => /(?:[?&])listStyle=list(?:$|[&#])/i.test(url);
    let normalizeFmRetryAfter = (seconds = 0) => {
        let value = Number.parseInt(seconds, 10) || 0;
        if (value <= 0) return fmShortRetrySeconds;
        return value;
    };
    let holdFmRequests = (seconds = 0) => {
        let waitSeconds = normalizeFmRetryAfter(seconds);
        fmBlockedUntil = Math.max(fmBlockedUntil, Date.now() + (waitSeconds * 1000));
        return waitSeconds;
    };
    let clearFmRequestHold = () => {
        fmBlockedUntil = 0;
    };
    let createFmBlockedResponse = (html = '', status = 430, retryAfter = 0) => {
        let waitSeconds = holdFmRequests(retryAfter);
        return createBlockedResponse(html, status, waitSeconds);
    };
    let loadHtmlByFrame = (url) => new Promise((resolve) => {
        let root = document.body || document.documentElement || document.head;
        if (!root) return resolve(createHtmlResponse('', 502));

        let frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;
        frame.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;border:0;visibility:hidden;';

        let settled = false;
        let lastHtml = '';
        let lastBlockedHtml = '';
        let finish = (response) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            clearInterval(probe);
            frame.remove();
            resolve(response);
        };
        let inspect = () => {
            try {
                let html = frame.contentDocument?.documentElement?.outerHTML ?? '';
                if (!html) return;
                lastHtml = html;
                let normalized = rememberFmBoardHtml(html, url);
                if (looksLikeFmBoardHtml(normalized)) {
                    if (isFmListUrl(url)) {
                        fmLastListFetchAt = Date.now();
                        clearFmRequestHold();
                    }
                    finish(createHtmlResponse(normalized, 200));
                    return;
                }
                if (fmBlockedPattern.test(html)) lastBlockedHtml = html;
            } catch {}
        };
        let timer = setTimeout(() => {
            if (lastBlockedHtml) {
                finish(createFmBlockedResponse(lastBlockedHtml, 430, fmShortRetrySeconds));
                return;
            }
            if (lastHtml) {
                finish(createHtmlResponse(lastHtml, 502));
                return;
            }
            finish(createHtmlResponse('', 502));
        }, 8000);
        let probe = setInterval(inspect, 500);

        frame.onload = () => {
            inspect();
        };
        frame.onerror = () => {
            if (lastBlockedHtml) {
                finish(createFmBlockedResponse(lastBlockedHtml, 430, fmShortRetrySeconds));
                return;
            }
            if (lastHtml) {
                finish(createHtmlResponse(lastHtml, 502));
                return;
            }
            finish(createHtmlResponse('', 502));
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
    let setImportantStyle = (node, name, value) => {
        if (!node?.style) return;
        node.style.setProperty(name, value, 'important');
    };
    let updateCompactDeviceFlag = () => {
        let sizes = [];
        let addSize = (value) => {
            let numeric = Number.parseFloat(value);
            if (Number.isFinite(numeric) && numeric > 0) sizes.push(numeric);
        };
        addSize(window.screen?.width);
        addSize(window.screen?.height);
        addSize(window.visualViewport?.width);
        addSize(window.visualViewport?.height);
        let shortSide = sizes.length ? Math.min(...sizes) : 0;
        if (document.documentElement) {
            document.documentElement.dataset.dclivechatCompactDevice = shortSide > 0 && shortSide <= 460 ? '1' : '0';
        }
    };
    let hideChatControls = (chat) => {
        for (let selector of [':scope > .li-c', ':scope > .ri-c', ':scope > .ci-c', ':scope > .cb-c']) {
            let node = chat?.querySelector(selector);
            if (!node) continue;
            setImportantStyle(node, 'display', 'none');
            setImportantStyle(node, 'visibility', 'collapse');
        }
    };
    let widenChatPage = (chat) => {
        let page = chat?.querySelector(':scope > .vp > .page');
        if (!page) return;
        setImportantStyle(page, 'max-width', 'none');
        setImportantStyle(page, 'margin', '0');
    };
    let applyDcLineLayout = (line) => {
        let title = line?.querySelector(':scope > .tt');
        let inline = title?.querySelector(':scope > span');
        if (!title || !inline) return;

        setImportantStyle(line, 'display', 'flex');
        setImportantStyle(line, 'flex-direction', 'row');
        setImportantStyle(line, 'justify-content', 'flex-start');
        setImportantStyle(line, 'align-items', 'flex-start');
        setImportantStyle(line, 'align-self', 'stretch');
        setImportantStyle(title, 'display', 'flex');
        setImportantStyle(title, 'flex-direction', 'row');
        setImportantStyle(title, 'justify-content', 'flex-start');
        setImportantStyle(title, 'align-items', 'flex-start');
        setImportantStyle(title, 'text-align', 'left');
        setImportantStyle(inline, 'display', 'flex');
        setImportantStyle(inline, 'flex-direction', 'row');
        setImportantStyle(inline, 'flex-wrap', 'nowrap');
        setImportantStyle(inline, 'justify-content', 'flex-start');
        setImportantStyle(inline, 'align-items', 'baseline');
        setImportantStyle(inline, 'align-content', 'flex-start');
        setImportantStyle(inline, 'text-align', 'left');
        setImportantStyle(inline, 'align-self', 'stretch');

        for (let item of inline.children) {
            if (item.classList.contains('tt')) {
                setImportantStyle(item, 'display', 'block');
                setImportantStyle(item, 'flex', '1 1 0');
                setImportantStyle(item, 'min-width', '0');
                setImportantStyle(item, 'white-space', 'nowrap');
                setImportantStyle(item, 'overflow', 'hidden');
                setImportantStyle(item, 'text-overflow', 'ellipsis');
                setImportantStyle(item, 'word-break', 'keep-all');
                setImportantStyle(item, 'overflow-wrap', 'normal');
                setImportantStyle(item, 'line-break', 'auto');
            } else {
                setImportantStyle(item, 'flex', '0 0 auto');
                setImportantStyle(item, 'white-space', 'nowrap');
            }
            setImportantStyle(item, 'align-self', 'baseline');
            setImportantStyle(item, 'text-align', 'left');
        }
    };
    let applyDcMobileLayout = () => {
        if (isFm) return;
        let main = document.body?.querySelector(':scope > main') ?? document.querySelector('body > main');
        if (!main) return;
        let video = main.querySelector(':scope > .video');
        let chat = main.querySelector(':scope > .chat:not(.fm)');
        if (!chat) return;

        document.documentElement.dataset.dclivechatMobileBuild = mobileBuildVersion;
        main.classList.add('co');
        if (video) {
            setImportantStyle(video, 'display', 'none');
            setImportantStyle(video, 'visibility', 'collapse');
        }
        hideChatControls(chat);
        widenChatPage(chat);
        for (let line of chat.querySelectorAll('.chl')) applyDcLineLayout(line);
    };
    let applyFmMobileLayout = () => {
        if (!isFm) return;
        let main = document.body?.querySelector(':scope > main') ?? document.querySelector('body > main');
        if (!main) return;
        let chat = main.querySelector(':scope > .chat.fm');
        if (!chat) return;

        document.documentElement.dataset.dclivechatMobileBuild = mobileBuildVersion;
        main.classList.add('co');
        hideChatControls(chat);
        widenChatPage(chat);
        for (let line of chat.querySelectorAll('.chl')) applyDcLineLayout(line);
    };
    let queueDcMobileLayout = (() => {
        let queued = false;
        return () => {
            if (queued || isFm) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                applyDcMobileLayout();
            });
        };
    })();
    let queueFmMobileLayout = (() => {
        let queued = false;
        return () => {
            if (queued || !isFm) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                applyFmMobileLayout();
            });
        };
    })();
    let observeMobileLayout = () => {
        if (mobileLayoutObserverStarted) {
            if (isFm) queueFmMobileLayout();
            else queueDcMobileLayout();
            return;
        }
        mobileLayoutObserverStarted = true;
        if (isFm) queueFmMobileLayout();
        else queueDcMobileLayout();
        let observer = new MutationObserver(() => {
            if (isFm) queueFmMobileLayout();
            else queueDcMobileLayout();
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
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
        fmSnapshotHtml = rememberFmBoardHtml(currentDocumentHtml(), location.href);
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
            let listRequest = isFmListUrl(resolvedUrl);
            let now = Date.now();

            let sameSnapshotUrl = !!fmSnapshotUrl && fmSnapshotUrl == resolvedUrl;

            if (listRequest && sameSnapshotUrl && fmSnapshotHtml && fmLastListFetchAt && (now - fmLastListFetchAt) < fmMinListFetchInterval) {
                return createHtmlResponse(fmSnapshotHtml, 200);
            }
            if (listRequest && fmBlockedUntil > now) {
                let waitSeconds = Math.max(1, Math.ceil((fmBlockedUntil - now) / 1000));
                return createBlockedResponse((sameSnapshotUrl ? fmSnapshotHtml : '') || '에펨코리아 보안 시스템', 430, waitSeconds);
            }

            let nativeResponse = null;
            let nativeText = '';
            let nativeBlocked = false;
            let nativeRetryAfter = 0;
            try {
                nativeResponse = await nativeFetch(input, init);
                nativeText = await nativeResponse.clone().text().catch(() => '');
                nativeRetryAfter = getRetryAfterSeconds(nativeResponse);
                nativeBlocked = !!nativeText && fmBlockedPattern.test(nativeText);
                if (nativeResponse.ok && nativeText && !nativeBlocked) {
                    let normalized = rememberFmBoardHtml(nativeText, resolvedUrl);
                    if (looksLikeFmBoardHtml(normalized)) {
                        if (listRequest) {
                            fmLastListFetchAt = Date.now();
                            clearFmRequestHold();
                        }
                        return createHtmlResponse(normalized, nativeResponse.status);
                    }
                }
            } catch {}

            if (listRequest) {
                if (nativeResponse && (nativeBlocked || nativeResponse.status == 429 || nativeResponse.status == 430)) {
                    return createFmBlockedResponse(nativeText || (sameSnapshotUrl ? fmSnapshotHtml : ''), nativeResponse.status || 430, nativeRetryAfter);
                }
                if (nativeResponse && !nativeResponse.ok) {
                    return createHtmlResponse(nativeText, nativeResponse.status, getRetryAfterHeaders(nativeRetryAfter));
                }
                let frameResponse = await loadHtmlByFrame(resolvedUrl);
                let frameText = await frameResponse.clone().text().catch(() => '');
                let frameBlocked = !!frameText && fmBlockedPattern.test(frameText);
                if (frameResponse.ok && frameText && !frameBlocked) {
                    let normalized = rememberFmBoardHtml(frameText, resolvedUrl);
                    if (looksLikeFmBoardHtml(normalized)) {
                        fmLastListFetchAt = Date.now();
                        clearFmRequestHold();
                        return createHtmlResponse(normalized, frameResponse.status, getRetryAfterHeaders(getRetryAfterSeconds(frameResponse)));
                    }
                }
                if (nativeResponse) {
                    if (nativeBlocked) {
                        return createFmBlockedResponse(nativeText || (sameSnapshotUrl ? fmSnapshotHtml : ''), nativeResponse.status || 430, nativeRetryAfter);
                    }
                    if (!nativeResponse.ok) {
                        return createHtmlResponse(nativeText, nativeResponse.status, getRetryAfterHeaders(nativeRetryAfter));
                    }
                    if (nativeText) return createHtmlResponse(nativeText, 502);
                }
                if (frameBlocked || frameResponse.status == 429 || frameResponse.status == 430) {
                    return createFmBlockedResponse(frameText || nativeText || (sameSnapshotUrl ? fmSnapshotHtml : ''), frameResponse.status || 430, getRetryAfterSeconds(frameResponse));
                }
                if (!frameResponse.ok) return frameResponse;
                return createHtmlResponse(frameText, 502);
            }

            if (nativeResponse) {
                if (nativeBlocked) {
                    return createHtmlResponse(nativeText, nativeResponse.status, getRetryAfterHeaders(nativeRetryAfter));
                }
                return nativeResponse;
            }
            return loadHtmlByFrame(resolvedUrl);
        };
    }

    let startMobilePrelude = () => {
        if (document.documentElement) {
            document.documentElement.dataset.dclivechatMobileBuild = mobileBuildVersion;
        }
        updateCompactDeviceFlag();
        injectStyle();
        observeMobileLayout();
    };

    startMobilePrelude();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMobilePrelude, { once: true });
    }
    window.addEventListener('resize', updateCompactDeviceFlag);
    window.addEventListener('orientationchange', updateCompactDeviceFlag);
    window.visualViewport?.addEventListener?.('resize', updateCompactDeviceFlag);
})();
(async()=>{String.prototype.r=function(e,t){return this.replace(e,t)};let e=!1,t=new TextDecoder;function r(e){let r=atob(e.r(/-/g,"+").r(/_/g,"/").r(/\./g,"=")),i=new Uint8Array(r.length);for(let e=0;e<i.length;e++)i[e]=r.charCodeAt(e);return t.decode(i)}let i,l,a,o,c,s,d,p=r("REMg65287J2067iM7LGX"),u=r("7LWc6re8IOyCrOyaqQ.."),h=r("PHA-PGJyPjwvcD4."),g=r("64uJ64Sk7J6E7J2EIOyeheugpe2VmOyEuOyalC4."),f=r("67mE67CA67KI7Zi466W8IDLsnpDrpqwg7J207IOBIOyeheugpe2VmOyEuOyalC4."),m=r("64-E67CwIOuwqeyngCDsvZTrk5zrpbwg7J6F66Cl7ZWY7IS47JqULg.."),b=r("7J20IOq4sOuKpeydgCBEQ-yduOyCrOydtOuTnCDqsKTrn6zrpqzsl5DshJzrp4wg7IKs7Jqp7ZWgIOyImCDsnojsirXri4jri6Qu"),w=r("7J20IOq4sOuKpeydgCDquIAg66qp66GdIO2OmOydtOyngOyXkOyEnOunjCDsgqzsmqntlaAg7IiYIOyeiOyKteuLiOuLpC4."),v=r("UEPrsoTsoIQg7Y6Y7J207KeA7JeQ7IScIOuLpOyLnCDsi5zrj4TtlbTso7zshLjsmpQu"),x=r("66Gc6re47JWE7JuD"),y=r("7ZmV7J24"),_=r("7Leo7IaM"),k=r("64Sk"),O=r("7KO87IaM6rCAIOyYrOuwlOultOyngCDslYrsirXri4jri6Qu"),I=r("7J20IOuwqeyGoeydhCDsi5zssq3tlZjsi5zqsqDsirXri4jquYw_"),A=r("7IOIIOywveyXkOyEnCDsl7TquLA."),C=r("7IOd67Cp7IahIOyjvOyGjA.."),L=r("66mU7Iuc7KeAIOuztOuCtOq4sA.."),q=r("64u16riAIOyeheugpQ.."),T=r("64yT6riAIOyeheugpQ.."),z=r("7IOd67Cp7IahIOyxhO2MhQ.."),J=r("7Iqk7YGs66Gk7ZW07IScIOyxhO2MheydtCDrqYjst4TsirXri4jri6Q."),j=r("7IOIIOuplOyLnOyngCDrs7TquLA."),D=r("67O06riw"),E=r("MjDqsJwg7J207IOB"),S=r("6rCc"),K=r("7IOIIOuplOyLnOyngCA."),$=r("64uJ64Sk7J6E"),Y=r("67mE67CA67KI7Zi4"),M=r("7L2U65OcIOyeheugpQ.."),Z=r("7JeQ6rKMIOuLteq4gA.."),X=r("7JeQ6rKMIOuMk-q4gA.."),G=r("64yT6riAIOyTsOq4sA.."),N=r("7IOIIOuMk-q4gCDsk7DripQg7KSR"),Q=(r("66Gc65Sp7KSR7J6F64uI64ukLg.."),r("7LGE7YyFIOyEpOyglQ..")),P=r("64uk7KSRIO2ZlOuptCDsgqzsmqkgKOuniOuPhCk."),R=r("67aA65Oc65-s7Jq0IOyKpO2BrOuhpCDslaDri4jrqZTsnbTshZg."),U=r("7Y-w7Yq4IO2BrOq4sCDtmZXrjIA."),B=r("67CY6rOg64uJIOyVhOydtOuUlCDtkZzsi5w."),H=r("65SU7Iuc7L2YIO2BrOq4sCDspITsnbTquLA."),F=r("6riAIOuCtOyaqeyXkCDrp4Htgawg7LaU6rCA"),W=r("7Ken7J2AIOyxhO2MhSDsp4Dsl7Dsi5zqsIQ."),V=r("67Cp7IahIOyXhuydtCDssYTtjIXssL3rp4wg7IKs7Jqp"),ee=r("7Jyg64-ZIOuhnOq3uOyduCDsiKjquLDquLA."),te=r("64uk7YGsIOuqqOuTnA.."),re=r("7LGE7YyFIO2RnOyLnCDrsKnrspU."),ie=r("7J6Q64-Z7Kek67CpIOuwjyDqvKzrpqzrp5A."),le=r("7J6Q64-Z7Kek67CpIOyCrOyaqQ.."),ae=r("6rys66as66eQIOyImOyglQ.."),ne=r("64uJ64Sk7J6EIOyVhOydtOy9mCDtkZzsi5w."),oe=r("7LGE7YyF"),ce=r("7IKt7KCc65CY7JeI6rGw64KYIOyhtOyerO2VmOyngCDslYrripQg6rKM7Iuc66y87J6F64uI64ukLg.."),se=r("6rO17KeA"),de=r("7ISk66y4"),pe=r("7LGE7YyF67Cp7JeQIOyYpOyLoCDqsoPsnYQg7ZmY7JiB7ZWp64uI64ukIQ.."),ue=r("7LGE7YyF7LC97JeQIOuLpOyLnCDsl7DqsrDtlojsirXri4jri6Qu"),he=r("7JWMIOyImCDsl4bripQg7Jik66WY"),ge=r("7JWMIOyImCDsl4bripQg7Jik66WYIChibG9ja19rZXkp"),fe=r("7J6Y66q765CcIOyalOyyreyeheuLiOuLpC4."),me=r("7J2066-47KeA6rCAIOuEiOustCDtgb3ri4jri6Qu"),be=r("7J2066-47KeAIOyXheuhnOuTnOyXkCDsi6TtjKjtlojsirXri4jri6Qu"),we=r("7J2066-47KeAIOyCreygnOyXkCDsi6TtjKjtlojsirXri4jri6Qu"),ve=r("7JWE7KeBIOyXheuhnOuTnCDspJHsnbgg7J2066-47KeA6rCAIOyeiOyKteuLiOuLpC4."),xe=r("7J2066-47KeAIOyXhuydtCDsmKzrpqzsi5zqsqDsirXri4jquYw_"),ye=r("7JeF66Gc65Oc7JeQIOyLpO2MqO2VnCDsnbTrr7jsp4DqsIAg7J6I7Iq164uI64ukLg.."),_e=r("7LGE7YyF7J20IOu5hO2ZnOyEse2ZlOuQmOyXiOyKteuLiOuLpC4."),ke=r("7J2066-4IOyLpO2WieykkeyeheuLiOuLpC4."),Oe=r("7J2066-47KeAIOyyqOu2gA.."),Ie=r("65Oc656Y6re4IOyVpCDrk5zroa3snLzroZwg7J2066-47KeAIOyYrOumrOq4sA.."),Ae=r("7J2066-47KeA66eMIOyYrOumtCDsiJgg7J6I7Iq164uI64ukLg.."),Ce=r("7LGE7YyF7J20IOu5hO2ZnOyEse2ZlOuQnCDqsKTrn6zrpqzsnoXri4jri6Qu"),Le=r("4oCA4oCB4oCE4oCF4oCG4oCH4oCI4oCJ4oCK"),qe=r("64yT6riA7IiYIO2VmOydtOudvOydtO2KuA.."),Te=r("7JiB7IOBIOy2lOqwgA.."),ze=r("67Cw7LmYIOuwlOq-uOq4sA.."),Je=r("67Cw7LmYIOyZhOujjCE."),je=r("66qo67CU7J28IO2ZmOqyveyXkOyEnOuKlCDqtozsnqXtlZjsp4Ag7JWK7Iq164uI64ukLgrqt7jrnpjrj4Qg7IKs7Jqp7ZWY7Iuc6rKg7Iq164uI6rmMPw.."),De=r("7KCE7LK0IOuLq-q4sA.."),Ee=r("64uk7Jq066Gc65Oc"),Se=r("64ur6riw"),Ke=r("7J6Q64-Z7Kek67CpIOydtOuvuOyngOulvCDsgq3soJztlZjsi5zqsqDsirXri4jquYw_"),$e=r("7J2066-47KeAIOyXheuhnOuTnA.."),Ye=r("7J6Q64-Z7Kek67CpIOyXheuhnOuTnA.."),Me=r("67KE7KCEIOyXheuNsOydtO2KuOuQqA.."),Ze=r("7KCE7LK0IOuzgOqyveyCrO2VrSDrs7TquLA."),Xe=r("6rWs66ek7ZWY7KeAIOyViuydgCDrlJTsi5zsvZjsnoXri4jri6Qu"),Ge=r("7IKt7KCc"),Ne=r("7IKt7KCc7ZWY7Iuc6rKg7Iq164uI6rmMPw.."),Qe=r("7IKt7KCc65CcIOqyjOyLnOusvOydgCDrs7XqtaztlaAg7IiYIOyXhuyKteuLiOuLpC4."),Pe=r("VVJMIOuzteyCrA.."),Re=r("SUQg7LCo64uo"),Ue=r("SVAg7LCo64uo"),Be=r("64uJ64Sk7J6EIOywqOuLqA.."),He=r("64uk7J2MIOydtOyaqeyekOulvCDssKjri6jtlZjsi5zqsqDsirXri4jquYw_"),Fe=r("7YKk7JuM65OcIOywqOuLqA.."),We=r("7KCE7LK0IOywqOuLqA.."),Ve=r("6rCk65-s66asIOywqOuLqA.."),et=r("7LaU6rCA"),tt=r("7LCo64uoIOyEpOyglQ.."),rt=r("7J207KCcIOq4gOydhCDsmKTrpbjsqr0g7YG066at7ZWY66m0PGJyPuuLpOydjCDrqZTribTrpbwg7IKs7Jqp7ZWgIOyImCDsnojsirXri4jri6Qh"),it=document,lt=it.body,at=it.head,nt=localStorage??null,ot=window.Worker&&!0,ct=window.navigator.clipboard.read&&!0,st=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),dt=st&&/Safari/i.test(navigator.userAgent),pt=[5e3,3e3,1e3],ut="getElementsByClassName",ht="querySelector",gt="innerText",ft="placeholder",mt="onclick",bt="dclivechat",wt="onopenlink",vt="ondcconerror",xt="onimageclick",yt="hidden",_t="disabled",kt="div",Ot="span",It="g-recaptcha-response",At="6Lc-Fr0UAAAAAOdqLYqPy53MxlRMIXpNXFvBliwI",Ct="subdirectory_arrow_right",Lt="arrow_downward",qt=(e,t=!0)=>(e=e.r("?","\\?"),t?new RegExp(e,"g"):new RegExp(e)),Tt=/:([^,:]+), ([^,:]+):/g,zt=/dccon\.php\?no=([a-z0-9]+)/,Jt=/twitch.tv\/(\?channel=)?([A-Za-z0-9_-]+)/,jt=/href="(https?:\/\/)?(www.)?twitch.tv\/([^"]+)"/g,Dt=/youtu(.be\/|be.com\/watch\?v=|be.com\/v\/|be.com\/shorts\/|be.com\/live\/|be.com\/embed\/)([A-Za-z0-9_-]+)/,Et=/href="(https?:\/\/)?(www.)?youtu(.be\/|be.com\/watch\?v=|be.com\/v\/|be.com\/shorts\/|be.com\/live\/)([^"]+)"/g,St="https://",Kt="fmkorea",$t="dc",Yt="gall.dcinside.com/",Mt=St+Yt,Zt=St+"github.com/Joh1ah/dclivechat",Xt="/board/forms",Gt=Xt+"/article_submit",Nt=Xt+"/comment_submit",Qt="/dccon/insert_icon",Pt=Xt+"/delete_submit",Rt=Xt+"/delete_password_submit",Ut=Number.parseInt,Bt=requestAnimationFrame,Ht=setTimeout,Ft=encodeURIComponent,Wt=String.fromCharCode,Vt=Date.now,er=Vt(),tr="",rr="",ir="",lr="",ar="",nr=[],or=[],cr=!1,sr=!0,dr=!1,pr=!1,ur=!1,hr=!0,gr="",fr="",mr="",br=!1,wr=!1,vr=!1,xr=0,yr=0,_r="",kr=pt[0],Or=0,Ir=0,Ar=!0,Cr=!0,Lr=!1,qr=99999,Tr=!0,zr="",Jr=null,jr=null,Dr=()=>"dc"==$t,Er=()=>$t==Kt,Sr=()=>0==xr,Kr=()=>Sr()?wr:vr,$r=(...e)=>{let t="["+((Vt()-er)/1e3).toFixed(2)+"]";console.log(t,...e)},Yr=()=>{let e,t=new Promise(t=>e=t);return{r:e,p:t}},Mr=(e,t)=>{let r=t-e+1,i=Math.random()*r;return Math.min(e+Math.floor(i),t)},Zr=e=>{let t=e.matchAll(/&#x([0-9a-fA-F]+);/g);for(let r of t){let t=String.fromCodePoint("0x"+r[1]);e=e.replace(r[0],t)}return e},Xr=e=>e.r(/(\r|\t)/g,"").r(/[ ]{2,}/g," ");let Gr=(e,t)=>{let r=e.indexOf(t);-1!=r&&e.splice(r,1)},Nr=new TextEncoder,Qr=async e=>{let t=Nr.encode(e),r=function(e){return[...new Uint8Array(e)].map(e=>e.toString(16).padStart(2,"0")).join("")}(await crypto.subtle.digest("SHA-256",t).catch($r));return"#"+r.slice(0,6)};let Pr,Rr=Le.split(""),Ur=e=>{let t="";for(let r=0;r<e;r++)t+=Rr[Mr(0,Rr.length-1)];return t},Br=e=>e.split("||"),Hr=e=>{let t,r,i=it.cookie.split(";");for(let l=0;l<i.length;l++)if(t=i[l].substring(0,i[l].indexOf("=")),r=i[l].substring(i[l].indexOf("=")+1),t=t.r(/^\s+|\s+$/g,""),t==e)return r;return"undefined"},Fr=e=>{let t=e.split(".");return t[0]+"."+t[1]},Wr=(e,t)=>((e,t,r)=>e.style.setProperty(t,r))(it.documentElement,e,t),Vr=async()=>{let{r:e,p:t}=Yr();return ai("script",lt,{onload:()=>{if("undefined"==typeof grecaptcha)return $r("recaptcha is undefined");$r("recaptcha v3 loaded"),e()},type:"text/javascript",src:St+"www.google.com/recaptcha/api.js?render="+At}),await t},ei=async(e,t,r)=>{if("v3"==e)return t["g-recaptcha-token"]=await(async e=>{"undefined"==typeof grecaptcha&&await Vr();let{r:t,p:r}=Yr();return grecaptcha.ready(()=>grecaptcha.execute(At,{action:e}).then(t).catch(e=>{$r(e),t("")})),await r})(r);$r("recaptcha",e,"is not supported")},ti=async(e,t,r,i)=>{let l,a=0,n=async()=>{if(a>1)return l;if(a+=1,l=await e(...t,r),!l)return fc(fe);let o=Br(l);if("false"==o[0]){if(1==o.length)return fc(l);if("captcha"==o[1])return await ei(o[2],r,i),await n()}return l};return await n()},ri=1024,ii="B.KB.MB.GB.TB.PB".split("."),li=e=>{let t=0,r=1,i=ri;for(;t<ii.length;){if(e<i){let i=e/r,l=10,a=2;for(;;){if(i<l)return i.toFixed(a)+ii[t];l*=10}}r*=ri,i*=ri,t++}},ai=(e,t,r,...i)=>{let l=it.createElement(e);if(r)if("object"==typeof r)for(let e in r)l[e]=r[e];else"string"==typeof r&&i.push(r);for(let e of i){if(!e)continue;let t=e.split(".").filter(e=>e);t.length&&l.classList.add(...t)}return t&&t.appendChild&&t.appendChild(l),l},ni=(e,t,...r)=>ai(Ot,e,{[gt]:t},"material-symbols-outlined.icon",...r),oi=e=>{for(;e.lastChild;)e.removeChild(e.lastChild)},ci=(e,...t)=>(e.classList.add(...t),e),si=(e,...t)=>(e.classList.remove(...t),e),di=()=>scrollTo(0,0),pi=!1,ui=(e,t,r=!1,i=!1)=>{e.onkeypress=l=>{!i&&pi||"Enter"==l.key&&(st&&r||!st&&r&&l.shiftKey||(l.preventDefault(),t.click(),e.oninput?.()))}},hi=()=>Er()?Mt:Mt+(sr?"mgallery/":dr?"mini/":"")+"board/",gi=()=>Er()?Mt:Mt+"board/",fi=()=>Er()?Mt+"index.php?mid="+tr+"&listStyle=list":hi()+"lists?id="+tr,mi=()=>Er()?Mt+"index.php?mid="+tr+"&act=dispBoardWrite":hi()+"write/?id="+tr,bi=e=>Er()?Mt+e:hi()+"view/?id="+tr+"&no="+e,wi=(...e)=>{let t="";for(let r of e)for(let e in r){let i=r[e];null==i&&(i="undefined"),t+="&"+e+"="+i}return t.substring(1)},vi=e=>{let t=e.match(/var _r = _d\('([A-Za-z0-9+=\/]+)'\)/);return t?(e=>{let t,r,i,l,a,n,o,c="yL/M=zNa0bcPQdReSfTgUhViWjXkYIZmnpo+qArOBslCt2D3uE4Fv5G6wH178xJ9K",s="",d=0;for(e=e.r(/[^A-Za-z0-9+/=]/g,"");d<e.length;)l=c.indexOf(e.charAt(d++)),a=c.indexOf(e.charAt(d++)),n=c.indexOf(e.charAt(d++)),o=c.indexOf(e.charAt(d++)),t=l<<2|a>>4,r=(15&a)<<4|n>>2,i=(3&n)<<6|o,s+=Wt(t),64!=n&&(s+=Wt(r)),64!=o&&(s+=Wt(i));return s})(t[1]):""},xi=(e,t)=>{let r=(t=(e=>{let t=Ut(e.substring(0,1));return t=t>5?t-5:t+4,e.r(/^./,t)})(t??Pr)).split(","),i="";for(n=0;n<r.length;n++)i+=Wt(2*(r[n]-n-1)/(13-n-1));return e.r(/(.{10})$/,i)},yi=()=>{let e;try{e=$r}catch{e=console.log}let t={},r=(e,t,r)=>{let l=i(e,t,r);return l?l[0]:""},i=(e,r,i)=>{let l,a=r+i;if(void 0!==t[a])l=t[a];else{l=new RegExp(`<${r}[^>]*class=["'][^"]*${i}[^"]*["'][^>]*(/?)>`,"g"),t[a]=l}let n=e.matchAll(l);if(!n)return null;let o=[];for(match of n){if(match[1]){o.push([match[0],""]);continue}let t=match.index,i=0,l=e.substring(t),a=0,n=l.matchAll(new RegExp(`<(/?)${r}[^>]*(/?)>`,"g"));for(let e of n)if(e[1]){if(a-=1,0==a){t=e.index,i=e[0].length;break}}else e[2]||(a+=1);o.push([l.substring(0,t+i),l.substring(match[0].length,t)])}return o},l=(e,t,i)=>{let l=r(e,t,i);return l?l[1]:""},a=e=>{let t="";for(let r of e.matchAll(/(>|$)(.*?)(<|^)/g))t+=r[2].trim();return t},n={},o=(e,t)=>{let r;void 0!==n[t]?r=n[t]:(r=new RegExp(`${t}="([^"]+)"`),n[t]=r);let i=e.match(r);return i?i[1]:null};return{_IH:l,_OH:(e,t,i)=>{let l=r(e,t,i);return l?l[0]:""},_OHA:(e,t,r)=>{let l=[],a=i(e,t,r);if(!a)return"";for(let e of a)l.push(e[0]);return l},_IT:(e,t,r)=>{let i=l(e,t,r);return i?a(i):""},_AT:(e,t,r,i)=>{let l=o(e,t);null!=l&&(r[i]=l)},_A:o,_TF:e=>/fix/.test(e),_DEBUG:e,_IO:a}},{_IH:_i,_OH:ki,_OHA:Oi,_IT:Ii,_AT:Ai,_A:Ci,_TF:Li,_DEBUG:qi,_IO:Ti}=yi(),zi={},Ji=(e,t)=>{let r;zi[t]?r=zi[t]:(r=new RegExp(`<[^>]+(id|name)=["']${t}["'][^>]+value=["']([^"']+)["']`),zi[t]=r);let i=e.match(r);return i?i[2]:""},ji=(e,t,r)=>{let i=new RegExp(`<form[^>]+id=["']${t}["'][^>]*>.*?</form>`),l=e.match(i);return!!l&&(hl(l[0],r),!0)},Di=()=>{let e;try{e=_DEBUG}catch{e=$r}let t=async(t,r={})=>{r.credentials||(r.credentials="include");let i=await fetch(t,r).catch(e);if(!i)return{ok:!1,status:0,retryAfter:0,text:""};let l=Number.parseInt(i.headers.get("retry-after")??"0")||0,a=(await i.text().catch(e)??"").replace(/(\n|\r|\t)/g,"");return{ok:i.ok,status:i.status,retryAfter:l,text:a}};return{_TEXT:async(e,r={})=>{let i=await t(e,r);return i.ok?i.text:""},_RESP:t}},{_TEXT:Ei,_RESP:Si}=Di(),Ki=async(e,t={},r="")=>{t.credentials||(t.credentials="include"),t.method||(t.method="POST"),t.mode||(t.mode="cors"),t.body||(t.body=r);let i=await fetch(e,t).catch($r);return i&&i.ok?await i.text().catch($r):""},$i={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},Yi=async(e,...t)=>{let r=wi(...t),i={headers:$i,referrer:mi()};return Ki(e,i,r).catch($r)},Mi=async(e,t="")=>{let r=await Ei((e=>Er()?"":hi()+"delete/?id="+tr+"&no="+e)(e));if(!r)return fc("not available");let i={[It]:"",_GALLTYPE_:rr};if(!ji(r,"delete",i))return fc("no form");let l=vi(r);if(!l)return fc("no secret");i.service_code=xi(i.service_code,l);let a=r.match(/formData \+= "&([0-9a-z]+)=([0-9a-z]+)&/);if(!a)return fc("not valid");if(i[a[1]]=a[2],t&&(i.password=t),a=r.match(/dcc_key_v1 = document.getElementById\(["']([^"']+)["']\).getAttribute\(["']([^"']+)["']/),a){let e=r.match(new RegExp(`<input[^>]+id=["']${a[1]}["'][^>]*>`));e&&(i.dcc_key_v1=Ci(e[0],a[2]))}return await ti(Yi,[t?Rt:Pt],i,"delete_submit")},Zi=async(e,t,...r)=>{let i=wi(...r),l={headers:$i,referrer:bi(e)};return Ki(t,l,i).catch($r)},Xi=async(e,{num:t,id:r,value:i,vCurT:l},a="")=>{let n={ci_t:Hr("ci_c"),id:tr,re_no:e,mode:"del",[It]:"",_GALLTYPE_:rr};return a&&(n[r]=i,n.no=t,n.re_password=a,n.v_cur_t=l),await ti(Zi,[e,"/board/comment/comment_delete_submit"],n,"comment_delete_submit")},Gi=async e=>{let t={r_key:ir,gall_id:tr,gall_no:lr,post_no:"",upload_ing:"N",_GALLTYPE_:rr};try{let r=((e,t)=>{let r=ai("form",null,{entype:"multipart/formdata"}),i=new FormData(r);for(let t in e)i.append(t,e[t]);return t&&t.name&&i.append("files[]",t,t.name),i})(t,e),i={credentials:"same-origin",referrer:Mt,referrerPolicy:"strict-origin-when-cross-origin"},l=St+"upimg.dcinside.com/upimg_file.php?id="+tr+"&r_key="+ir,a=await Ki(l,i,r).catch($r);return a?JSON.parse(a).files[0]??null:null}catch(e){return $r(e),null}},Ni=e=>{let t=wi({id:tr,r_key:ir,temp_no:e}),r={headers:$i,credentials:"same-origin",referrer:Mt+"/upload/image?xssDomain=dcinside.com",referrerPolicy:"strict-origin-when-cross-origin"},i=gi()+"temp/upimg_pop_del";Ki(i,r,t).catch($r).then(e=>"true"!=e&&Hl(we))},Qi={},Pi=[],Ri=!1,Ui=[],Bi=async()=>{if(!Ui.length)return Ri=!1;let e=Ui.shift(),t=e[0],r=e[1];if(null!=Qi[t])return r(Qi[t]),Ht(Bi,1);let i=await(async e=>{let t=Mt+"dccon/package_detail",r={headers:$i},i=wi({ci_t:Hr("ci_c"),package_idx:"",code:e}),l=await Ki(t,r,i).catch($r);if(!l)return null;try{return JSON.parse(l)}catch(e){return $r(e),null}})(t).catch($r);if(!i)return r();let l=i.info.title,a=i.info.package_idx,n=[];for(let e of i.detail)n.push({title:e.title,buy:!1,package_idx:a,package_title:l,code:e.path});let o={title:l,idx:a,buy:!1,code:i.info.list_img_path,detail:n};Fi(o),r(Qi[t]),Ht(Bi,1)},Hi=e=>{let{r:t,p:r}=Yr();return Ui.push([e,t]),Ri||(Ri=!0,Bi()),r},Fi=e=>{let t=Jl("dccon-pk")??{};if(null!=t[e.idx]){let r=t[e.idx];if(r.buy||!e.buy)return;r.detail=e.detail,r.buy=!0}else t[e.idx]=e;zl("dccon-pk",t)},Wi=(e,t)=>{let r=(e=>{let t=Jl("dccon-pk");if(!t)return null;for(let r in t)if(t[r].title==e)return t[r];return null})(e);if(!r||!r.detail)return null;for(let e of r.detail)if(e.title==t)return e;return null},Vi=(e,t)=>{let r=Wi(e,t);return r?el(r.code):null},el=e=>St+"dcimg5.dcinside.com/dccon.php?no="+e,tl=async(e,t)=>{let r,i=await Yi(Mt+"dccon/lists",{ci_t:Hr("ci_c"),target:e,page:t}).catch($r);if(!i)return 0;if("not_login"==i)return 0;if("{"!=i.substring(0,1))return 0;try{r=JSON.parse(i)}catch(e){return $r(e),{}}let l=r.list,a=1;if("recent"==e){let e=[];for(let t of l){let r=t.list_img.match(zt);r&&e.push({package_title:u,package_idx:t.package_idx,idx:t.idx,code:r[1],title:t.title})}eo({title:u,idx:-1,detail:e})}else if("icon"==e){a=r.max_page;for(let e of l){let t=e.title,r=e.package_idx,i=e.main_img_url.match(zt);if(!i)continue;let l=[];for(let i of e.detail){let e=i.list_img.match(zt);e&&l.push({package_title:t,package_idx:r,idx:i.detail_idx,buy:!0,code:e[1],title:i.title})}let a={title:t,idx:r,buy:!0,code:i[1],detail:l};eo(a),Fi(a)}}return a},rl=async e=>{if(!e.buy)return Hl(Xe);let t=e.package_idx,r=e.idx,i={id:tr,no:void 0,package_idx:t,detail_idx:r,ci_t:Hr("ci_c"),input_type:"write",t_vch2:void 0,t_vch2_chk:void 0,c_gall_id:tr,c_gall_no:void 0,[It]:"",check_6:void 0,check_7:void 0,check_8:void 0,_GALLTYPE_:rr};await ti(Yi,[Qt],i,"insert_icon"),to("recent").catch($r)},il=async(e,t)=>{if(!e.buy)return Hl(Xe);let r=e.package_idx,i=e.idx,l=Dn();if(!l.length)return Hl(g);let n=tc[t],o={id:tr,no:t,package_idx:r,detail_idx:i,name:l,ci_t:Hr("ci_c"),input_type:"comment",t_vch2:n.t_vch2,t_vch2_chk:n.t_vch2_chk,c_gall_id:tr,c_gall_no:t,[It]:"",check_6:n.check_6,check_7:n.check_7,check_8:n.check_8,_GALLTYPE_:rr},c={};if(!pr){let e=En();if(e.length<2)return Hl(f);c.password=e}if(Kr()){let e=Sn();if(!e.length)return Hl(m);c.code=e}yr&&(c.c_no=yr);let s=await Yi(Qt,o,c);"ok"==s&&(fn[t](-1,!0),a(0)),Ht(Jn,500),to("recent")},ll=(e,t,r)=>{let i=`<img class="dccon" src="${r}">`;e.innerHTML=e.innerHTML.r(t,i)},al=0,nl=e=>{let t=(e=e.r(/onmousedown="[^"]+"/g,"").r(/class="written_dccon[^"]*"/g,'class="d"')).matchAll(/onerror="[^"]+"/g);for(let r of t){al++;let t="error-"+al;e=e.r(r[0],`id="${t}" onerror="window.postMessage(JSON.stringify({type:'${vt}',id:'${t}' }),'*')"`)}return e},ol=e=>`onclick="window.postMessage(JSON.stringify({type:'${wt}',url:'${e}' }),'*')"`,cl=(t,r)=>{let i=t.match(r);if(i){e;for(let e of i)t=t.r(qt(e),ol(Ft(e.split('"')[1])));e}return t},sl=e=>(e=cl(e,jt),e=cl(e,Et)),dl=e=>"https://image.dcinside.com/viewimage.php?id=&no="+e,pl=e=>{kr=pt[e],jr&&jr.postMessage({type:"iv",iv:kr})},ul=(e,t)=>{for(let r in t){let i=Ji(e,r);i&&(t[r]=i)}!rr&&uc._GALLTYPE_&&(rr=uc._GALLTYPE_),!lr&&uc.gallery_no&&(lr=uc.gallery_no),uc.r_key&&(ir=uc.r_key)},hl=(e,t)=>{let r=e.matchAll(/<input[^>]+name=["']([^"']+)["'][^>]+value=["']([^"']*)["']/g);if(r)for(let e of r)t[e[1]]=e[2]},gl=e=>(new DOMParser).parseFromString(e,"text/html"),fl=e=>(e?.textContent??"").r(/\s+/g," ").trim(),ml=(e="")=>{try{return Zr(decodeURIComponent(e))}catch{return Zr(e)}},bl=(e,t)=>{let r=(e??"").split(" ").filter(e=>e);return r.includes(t)||r.push(t),r.join(" ")},wl=e=>{if(!e)return"";try{return new URL(e,location.origin).href}catch{return e}},vl=e=>`window.postMessage(JSON.stringify({type:'${wt}',url:'${e}' }),'*')`,xl=(e,t)=>`window.postMessage(JSON.stringify({type:'${xt}',src:'${e}',id:'${t}'}))`,yl=(e,t)=>{if(Dr())return((e,t)=>{let r=e.matchAll(/<(img|video)[^>]*src="[^">]+no=([0-9a-zA-Z]+)[^">]*"[^>]*>/g);for(let i of r){let r=i[0],l=r,a=i[2];if(/class="d"/.test(r))continue;let n=r.match(/class="([^"]+)"/);l=n?l.r(n[0],`class="${n[1]} img"`):l.r(">","")+' class="img">';let o=r.match(/on[Cc]lick="[^"]+no=([0-9a-zA-Z]+)[^"]*"/);l=o?l.r(o[0],`onclick="window.postMessage(JSON.stringify({type:'${xt}',src:'${dl(o[1])}',id:'${t}'}))" data-osrc="${dl(o[1])}"`):l.r(">","")+` onclick="window.postMessage(JSON.stringify({type:'${xt}',src:'${dl(a)}',id:'${t}'}))" data-osrc="${dl(a)}" draggable="false">`,e=e.r(r,l)}return e})(sl(Xr(nl(e))),t);let r=gl('<div id="fm-content-root">'+e+"</div>")[ht]("#fm-content-root");if(!r)return Xr(e);for(let e of r.querySelectorAll("a[href]")){let t=wl(e.getAttribute("href"));e.setAttribute("href","javascript:;"),e.setAttribute("target","_blank"),e.setAttribute("onclick",vl(Ft(t)))}for(let e of r.querySelectorAll("img")){let r=wl(e.getAttribute("src")||e.getAttribute("data-src"));r&&(e.setAttribute("src",r),e.setAttribute("data-osrc",r),e.setAttribute("draggable","false"),e.setAttribute("onclick",xl(r,t)),e.setAttribute("class",bl(e.getAttribute("class"),"img")))}for(let e of r.querySelectorAll("video")){let t=e.getAttribute("src");t&&e.setAttribute("src",wl(t));let r=e.getAttribute("poster");r&&e.setAttribute("poster",wl(r)),e.setAttribute("controls","controls"),e.setAttribute("playsinline","playsinline")}for(let e of r.querySelectorAll("source[src]"))e.setAttribute("src",wl(e.getAttribute("src")));return Xr(r.innerHTML)},_l=e=>{let t={id:"",name:"",img:"",fix:!1};if(!e)return t;t.name=fl(e);let r=(e.className??"").match(/member_([0-9]+)/);r&&(t.id=r[1]);let i=e[ht]("img");return i?.src&&(t.img=wl(i.src),t.fix=Li(t.img)),t},kl=()=>"fmkorea-tabs-"+tr,Ol=()=>or.filter(e=>e),Il=e=>{let t=[],r=e=>{(e=(e??"").trim())&&![se,"더보기","인기"].includes(e)&&(t.includes(e)||t.push(e))};for(let t of e.querySelectorAll('.bd_cnb a[data-category_srl], .bd_cnb a[href*="category="], .cnb_n_list .bd_cnb a[href*="category="]'))t.closest(".cnbMore")||r(fl(t));return t};let Al=e=>(alert(e),0);if(!(e=>{if(e.match(/^https?:\/\/((m|www)\.)?fmkorea\.(com|net|co\.kr)\/([^\n]*)$/)){$t=Kt,Yt=location.host+"/",Mt=location.origin+"/",sr=!1,dr=!1,ur=!0,cr=/^m\./.test(location.host);let e=location.pathname.r(/^\/+/,""),t=new URL(location.href).searchParams.get("mid")??"";return tr=t,tr||(tr=/^[A-Za-z0-9_]+$/.test(e)?e:window.currentBoardMid??window.current_mid??""),ar=window.currentBoardTitle??it.title.r(/ - 에펨코리아$/,"")??tr,tr?1:Al(w)}let t=e.match(/^https?:\/\/(gall|m).dcinside.com\/([^\n]+)$/);if(!t)return Al(b);let r=null;return"gall"==t[1]?(r=t[2].match(/id=([A-Za-z0-9_]+)($|\&|#)/),sr=/^mgallery/.test(t[2]),dr=/^mini/.test(t[2])):(cr=!0,r=t[2].match(/(board|mini)\/([A-Za-z0-9_]+)($|\?|\/|#)/),sr=it[ut]("micon").length>0,dr=it[ut]("mnicon").length>0),r&&r.length?(tr=cr?r[2]:r[1],1):Al(w)})(location.href))return;if(Er()&&(pt=[1e4,5e3,3e3],kr=pt[0]),Dr()&&(it.cookie="m_dcinside_web=done; path=/; domain=.dcinside.com"),ai("meta",at,{name:"viewport",content:"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"}),cr)return Al(v),Dr()?location.href=fi():void 0;if(it[bt])return it[bt]();it[bt]=()=>Hl(ke),it.title=p+" :: "+it.title;let Cl={},Ll={},ql=e=>{let t=JSON.stringify(e??Cl);nt?.setItem(bt,t)},Tl=(e,t)=>{Cl[e]=t,Ll[e]?.(t)},zl=(e,t)=>{Tl(e,t),ql()},Jl=e=>Cl[e]??null,jl=()=>{let e=nt?.getItem("block_all");return e?JSON.parse(e):{on:1,word:"",id:"",nick:"",ip:""}},Dl=()=>{let e=nt?.getItem("block_parts");return e?JSON.parse(e):{}},El=(e,t)=>Dl()[e]??{on:1,word:"",id:"",nick:"",ip:"",name:t},Sl=(e,t)=>!!t.on&&(Kl(e,"title",t,"word",!0)||Kl(e,"nickname",t,"nick")||Kl(e,"id",t,"id")||Kl(e,"ip",t,"ip")),Kl=(e,t,r,i,l=!1)=>{if(!r[i])return!1;let a=Br(r[i]);for(let r of a)if(l){if(e[t].includes(r))return!0}else if(e[t]==r)return!0;return!1},$l=e=>{e.on=1,(e=>{nt?.setItem("block_all",JSON.stringify(e))})(e);for(let t of un)Sl(t,e)?ci(t.chat,"block"):si(t.chat,"block")},Yl=(e,t)=>{e.on=1;let r=Dl();r[t]=e,(e=>{nt?.setItem("block_parts",JSON.stringify(e))})(r);for(let t of un)Sl(t,e)?ci(t.chat,"block"):si(t.chat,"block")},Ml=(e,t,r)=>{let i=Br(e[t]).filter(e=>""!=e);i.includes(r)||i.push(r),e[t]=i.join("||")},Zl=(e,t,r)=>{let i=Br(e[t]).filter(e=>""!=e);for(let e=0;e<i.length;e++){if(i[e]==r){i.splice(e,1);break}}e[t]=i.join("||")};(async()=>{let e=await Ei(fi()).catch($r);if(Er()){(e=>{let t=gl(e),r=Il(t);r.length||(r=Il(it)),nr=r})(e);let t=gl(e);pr=null!=t.querySelector('a[href*="dispMemberLogout"]'),ar||(ar=window.currentBoardTitle??fl(t.querySelector(".bd_cnb .home"))??tr),ar||(ar=tr)}else{let t=_i(e,kt,"login_box");if(t){let e=_i(t,"button","btn_inout");if(e&&e==x){pr=!0;let e=Ii(t,"strong","nickname");e&&(gr=e);let r=ki(t,"strong","writer_nikcon");if(r){let e=Ci(r,"onClick").match(/\/([a-zA-Z0-9_-]+)['"]/);e&&(fr=e[1]),e=r.match(/src=["']([^"']+)["']/),e&&(mr=e[1],br=Li(e[1]))}}}}i?.(),Dr()&&(ar=Ji(e,"gallery_name")),$o[gt]=Ve+" - "+ar})(),oi(lt),ci(lt,yt);for(var Xl=1;Xl<99999;Xl++)window.clearInterval(Xl);for(Xl=1;Xl<99999;Xl++)window.clearTimeout(Xl);let Gl='*{text-align:center;justify-content:center;align-items:center;vertical-align:middle;flex-direction:column;font-size:inherit;border:none;touch-action:manipulation;-webkit-touch-callout:none;margin:0;padding:0;word-break:keep-all;letter-spacing:inherit;color:rgb(var(--cf));line-height:160%;outline:0;scroll-behavior:var(--sb)}body,button,input,select,table,textarea,*{font-family:"Inter","Roobert","Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:-0.01em}.dc_series{background:rgba(0,0,0,0)}html{min-height:100vh;min-height:100svh;background:#000}body{--cs: black;--cbdr: 0, 0, 0;--cbd: 13, 13, 14;--cb: 27, 27, 29;--cbl: 51, 51, 51;--cfd: 165, 165, 165;--cf: 255, 255, 255;--cbo: #0d0d0e;--f: ;overflow:hidden;background:rgb(var(--cb));height:100vh;height:100svh;letter-spacing:.02em;font-size:var(--fs)}.light{--cs: #383838;--cbdr: 255, 255, 255;--cbd: 232, 232, 232;--cb: 255, 255, 255;--cbl: 220, 220, 220;--cfd: 0, 0, 0;--cf: 13, 13, 14;--cbo: white;--f: hue-rotate(-10deg) brightness(.8) contrast(1.1)}.f-white{color:#fff !important}div,main,a{display:flex}span{display:inline;text-align:left;align-self:center}*::placeholder{line-height:1.7em;font-size:var(--fs);color:rgb(var(--cfd))}a{cursor:pointer}a:link,a:visited,a:hover,a:active{text-decoration:none}.disabled{cursor:default !important;pointer-events:none !important;opacity:.2 !important}.abs,.abs-tr,.abs-r,.abs-tl,.o,.modal{position:absolute}.o,.abs-tr,.abs-tl{top:0}.abs-r,.abs-tr{right:0}.o,.abs-tl{left:0}.fix-tl{position:fixed;top:0;left:0}.fr,.tab,.opt,main,.sb,.b,.menu{flex-direction:row;float:none}.o{width:100vw;width:100svw;height:100vh;height:100svh;z-index:3;pointer-events:none;opacity:0;animation:fade-out .2s;background:rgba(0,0,0,0);transition:background-color .1s}.o.wait,.o.drag{animation:fade-in .2s;opacity:1;pointer-events:initial;background:rgba(var(--cbd), 0.8)}.o.drag{z-index:4}.o>.drop{pointer-events:none;font-size:30px;font-weight:bold}.o *{pointer-events:initial}.modal{box-shadow:rgb(var(--cbd)) 0 0 2px;background:rgb(var(--cb));padding:20px 30px;min-width:200px;animation:fade-in-grow .2s}.modal>.tt{font-weight:bold;padding:1em 40px}.modal>.desc{padding-bottom:2em}.modal>.opts{padding:0 10px}.modal>.opts>a{margin:0 4px}.modal>.opts>a>.progress{animation:rotate-cw 1s infinite;font-size:1.6em;padding:0}.modal>textarea,.modal>input{white-space:pre-wrap;height:3.2em;margin:18px}.modal>textarea.ft,.modal>input.ft{border-radius:4px 4px 0 0;padding-bottom:calc(10px + 1em);margin-bottom:0;color:rgb(var(--cfd))}.modal>textarea.nowrap,.modal>input.nowrap{height:1.6em}.modal .b-entry{width:260px;flex-wrap:wrap;justify-content:baseline}.modal .b-entry>.entry{margin:2px 4px}.ctx{z-index:3 !important;position:fixed;padding:4px 10px}.ctx>.b{width:100%;min-width:8em;margin:0;justify-content:flex-start}.ctx>.b>.icon{font-size:1em;margin-right:.2em}.ctx>hr{width:100%;height:1px;background:rgb(var(--cfd));margin:4px 0}.footer-static{position:relative;border-radius:0 0 4px 4px;margin-bottom:20px;width:calc(100% - 84px);color:rgb(var(--cfd));background:rgb(var(--cbl));padding:0 24px}.ipvs{width:100vw;width:100svw;height:100vh;height:100svh}.ipvs>.ipv{animation:fade-in-grow .2s;max-height:calc(90vh - 30px);max-height:calc(90svh - 30px);max-width:90vw;max-width:90svw}.ipvs>.ipv.fo{animation:fade-out-shrink .2s}.has-tooltip:hover .tooltip{opacity:1}.has-tooltip .tooltip{pointer-events:none;position:absolute;background:rgb(var(--cb));opacity:0;transition:opacity .2s;padding:2px 4px;box-shadow:var(--cs) 0 0 2px;z-index:1;font-weight:normal;white-space:nowrap}.has-tooltip .bt{top:calc(100% + 6px)}.has-tooltip .tp{bottom:calc(100% + 6px)}.w{width:100%;transition:height .5s;overflow:hidden;margin-bottom:auto}.w.zero{height:0}.w .post,.w .cm{width:calc(100% - 20px)}.w .cm>.vp{overflow:visible}.w .post{margin:10px 0}.w .post,.w .pc{overflow:visible}.w .pc,.w .pc *{font-size:var(--fs)}.w .img{cursor:pointer;scale:1;transition:scale .2s}.w .img:hover{scale:1.02}.w .sm,.w .ic{color:rgb(var(--cf));min-height:50px}.w .sm{width:calc(100% - 10px);color:rgb(var(--cfd));background:linear-gradient(rgb(var(--cb)), transparent);box-shadow:rgb(var(--cb)) 0 -2px 2px}.w .sm>*{color:rgb(var(--cfd))}.w .sm:hover{background:rgb(var(--cbl));box-shadow:rgb(var(--cb)) 0 0 2px}.w .cm{width:100%}.w .cml .text,.w .cml .text *{font-size:var(--fs)}.w .ic{display:flex;width:calc(100% - 10px);background:rgb(var(--cb));box-shadow:rgb(var(--cb)) 0 0 2px;font-weight:bold;margin-top:10px}.w .ic:hover{background:rgb(var(--cbl))}.sb{display:flex;margin:0 16px;padding:8px 12px;color:#fff}.sb>*{color:#fff}.sb{font-weight:bold;background:#7e4ca0}.sb:hover{background:#691f9c}.sb>.icon{font-size:1.4em;padding-right:.2em}.log{background:#000;position:fixed;top:0;z-index:4;width:100vw;width:100svw;align-items:flex-start}.log p{text-align:left;line-break:anywhere}input,textarea{font-size:var(--fs);height:1.6em;background:rgb(var(--cbl));color:rgb(var(--cf));text-align:left;padding:10px 24px;border:2px solid rgba(0,0,0,0);transition:border .2s,background-color .2s,color .2s;white-space:nowrap;line-break:anywhere}input:focus,textarea:focus{background:rgb(var(--cbdr));border:2px solid #7e4ca0}input,textarea,.b,.r,.p,.sb,.modal,.tooltip{border-radius:4px}.p{background:rgb(var(--cb));box-shadow:var(--cs) 0 0 10px;z-index:1;animation:fade-in-grow .2s}.p>.pc{width:calc(100% - 60px) !important;padding:30px}.p>.sb{margin:10px}.tab{display:flex;border-radius:4px 4px 0 0;z-index:1;min-height:1.2em}.tab>*{margin:0 2px}.tab .close{display:flex;padding:8px}.tab .close>.icon{font-size:inherit;color:rgb(var(--cfd))}.tab .close:hover>icon{color:rgb(var(--cf))}.fm-tabs{width:100%;padding:8px;overflow-x:hidden;overflow-y:auto;max-height:104px;background:rgba(0,0,0,.08);border-bottom:1px solid rgba(var(--cf), 0.2);box-sizing:border-box}.fm-tabs-wrap{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start;justify-content:flex-start;gap:6px;width:100%;min-width:0}.fm-tab{display:inline-flex;flex-direction:row;flex:0 0 auto;align-items:flex-start;justify-content:flex-start;gap:6px;max-width:100%;padding:6px 10px;border-radius:999px;background:rgb(var(--cbdr));color:rgb(var(--cfd));font-size:12px;line-height:1.35;text-align:left;border:1px solid rgba(0,0,0,0);transition:all .2s;box-sizing:border-box}.fm-tab:hover{background:rgb(var(--cbl));color:rgb(var(--cf))}.fm-tab.chk{background:rgba(255,196,0,.16);border-color:rgba(255,196,0,.4);color:#ffd46b}.fm-tabs .fm-tab{width:auto;min-height:0}.fm-tab-box{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-top:1px;border:1px solid hsla(0,0%,100%,.25);border-radius:4px;background:rgba(0,0,0,.16);color:rgba(0,0,0,0);font-size:10px;line-height:1;box-sizing:border-box}.fm-tab.chk .fm-tab-box{border-color:rgba(255,196,0,.45);background:rgba(255,196,0,.2);color:#ffd46b}.fm-tab-label{min-width:0;white-space:normal;word-break:keep-all;overflow-wrap:anywhere}.ex{display:flex;width:100%}.version{color:rgb(var(--cfd));margin:1em}.pc>*,.cml .text>*{max-width:calc(100% - 20px)}.pc *,.cml .text *{display:initial;text-align:left;max-width:100%;white-space:initial}.pc div,.cml .text div{display:block}.pc a,.cml .text a{color:#57abff}.pc a:hover,.cml .text a:hover{text-decoration:underline}.opts{height:calc(100% - 20px);width:calc(100% - 20px) !important;padding:10px}.opts>.opt{width:calc(100% - 20px);padding:6px 10px;justify-content:space-between;cursor:pointer}.opts>.opt .label>.icon{font-size:1em;margin-right:.8em}.opts>.opt .value{position:relative;height:20px;width:40px;background:rgb(var(--cbdr));border-radius:100px;border:2px solid rgb(var(--cfd));transition:all .2s}.opts>.opt .value::after{content:"";display:block;position:absolute;height:16px;width:16px;border-radius:100%;margin:2px;background:rgb(var(--cfd));transition:all .2s;left:0;top:0}.opts>.opt .value>span{font-size:22px;color:#7e4ca0}.opts>.opt.chk .value{border:2px solid #7e4ca0}.opts>.opt.chk .value::after{background:#7e4ca0;left:20px}.opts>.opt.r{position:relative}.opts>.opt.r:hover{background:rgb(var(--cbl))}.opts>.opt.hr{font-weight:bold}.chl,.chl>.tt,.cml{position:relative;width:calc(100% - 2em);line-height:1.5em;line-break:anywhere;transition:all .2s}.chl{align-items:baseline;align-self:center;border-radius:4px}.chl.filtered{display:none !important}.chl>.tt{cursor:pointer;width:calc(100% - 12px);padding:5px 6px}.chl>.tt>span{width:100%;display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px}.chl>.tt>span .sg{display:inline-flex;align-items:center;padding:1px 6px 0;border-radius:999px;background:hsla(0,0%,100%,.08);color:rgb(var(--cfd));font-size:11px;line-height:1.4;vertical-align:middle}.chl>.tt>span .cm{display:inline-flex;height:1em;animation:fade-in .2s}.chl>.tt>span .cm>*{color:rgb(var(--cfd));line-break:strict}.chl>.tt>span .cm>.icon{padding:0 4px}.chl>.tt>span .cm .nc *{color:var(--cc);filter:var(--f)}.chl>.tt *{font-size:var(--fs);color:rgb(var(--cf))}.chl.open{margin:.8em 1.5em;background:rgb(var(--cbl))}.chl:hover{background:rgb(var(--cbl))}.chl .ex.alt{min-height:40px}.chl.wr{opacity:1 !important}.chl.wr .ic{background:#7e4ca0}.chl.wr .ic:hover{background:#691f9c}.chl.wr.rp .ic{background:rgb(var(--cbd))}.chl.wr.rp .ic:hover{background:rgb(var(--cb))}.cml{cursor:pointer;display:flex;background:rgb(var(--cb));width:calc(100% - 20px);padding:6px;animation:fade-in .2s}.cml:hover{background:rgb(var(--cbl))}.cml{margin:.2em 0;margin-right:3px;box-shadow:rgb(var(--cb)) 0 0 2px;justify-content:flex-start;align-self:flex-end;align-items:flex-start}.cml *{text-align:left;position:initial}.cml .writer-dlc{display:inline;text-overflow:ellipsis;overflow:clip;white-space:nowrap;max-width:100%}.cml .text{align-items:flex-start;width:100%;text-align:left}.cml .vp>.page{align-items:center}.cml.re{width:calc(100% - 50px);position:relative}.cml .re-icon{position:absolute;left:-25px;top:7px}.cml .re-icon *{font-size:20px;color:rgb(var(--cfd))}.cml.rp{background:#7e4ca0}.cml.rp:hover{background:#691f9c}.vp{width:100%;height:100%;overflow-y:scroll;overscroll-behavior:none;justify-content:flex-start;align-items:flex-start}.vp>.page{min-width:calc(100% - 2px);max-width:calc(100% - 2px);padding:2px 0 12px 0;align-items:baseline}.vp>.page .notify .tt:hover{background:rgba(0,0,0,0)}.vp>.page .notify .tt *{color:rgb(var(--cfd))}.vp>.page.hu .id{display:none !important}video.d,img.d{width:var(--ds);height:var(--ds)}img.nikcon{width:1em;height:1em;margin-right:.2em}.ip{font-size:10px !important}.ip::before{display:inline;content:" ("}.ip::after{display:inline;content:")"}.name{font-weight:bold}*>.hover{display:none}*>.not-hover{display:flex}*:hover>.hover{display:flex}*:hover>.not-hover{display:none}.hd{font-weight:bold}.b{display:flex;padding:4px;margin:10px;font-weight:bold}.b:hover{background:rgba(var(--cf), 0.2)}.b.t{background:rgba(var(--cf), 0.2)}.b.t:hover{background:rgba(var(--cf), 0.4)}.gray{color:rgb(var(--cfd))}.gray *{color:rgb(var(--cfd))}.gray>span{color:rgb(var(--cfd));font-size:20px}.gray:hover{color:rgb(var(--cf))}.gray:hover>span{color:rgb(var(--cf))}.gray-div{color:rgb(var(--cfd))}.gray-div div{color:rgb(var(--cfd))}.go::after{content:"";display:block;position:absolute;width:100%;height:100%;background:rgba(var(--cbd), 0.8)}::-webkit-scrollbar{width:2px;height:2px}::-webkit-scrollbar-track{background:rgba(0,0,0,0)}::-webkit-scrollbar-thumb{border-radius:1px;background:#888}::-webkit-scrollbar-thumb:hover{background:#555}.hidden,.grecaptcha-badge,.hn img.nikcon,.chl.block{display:none !important;visibility:collapse !important}.material-symbols-outlined{font-variation-settings:"FILL" 0,"GRAD" 0,"wght" 400,"opsz" 48;user-select:none}.material-symbols-outlined.f{font-variation-settings:"FILL" 1,"GRAD" 200,"wght" 400,"opsz" 48}.icon{padding:0}.icon.sml{font-size:1em}main{justify-content:flex-start;--cw: 340px}main>*{position:relative;height:100vh;height:100svh}.video{background:rgb(var(--cbd));width:calc(100% - var(--cw))}.video>div{width:100%}.main{height:100%}.main>div{position:absolute;transition:all .2s}.main>div.p{left:calc(50% - 180px);height:130px;width:360px}.main>div.p>.src{width:200px;margin:10px;overflow-y:hidden}.main>div.p>.ph{visibility:hidden;margin-right:calc(-1em - 20px);margin-left:20px;z-index:1}.main>div.p.blank>.src{text-indent:14px}.main>div.p.blank>.ph{visibility:visible}.r1{width:calc(100%/var(--rw1));top:0;height:var(--r2t)}.r1.c2{left:calc(100%/var(--rw1))}.r1.c3{left:calc(200%/var(--rw1))}.r1.c4{left:calc(300%/var(--rw1))}.r1{height:var(--r2t)}.c1{left:0}.r2{width:calc(100%/var(--rw2));top:var(--r2t)}.r2.c2{left:calc(100%/var(--rw2))}.r2.c3{left:calc(200%/var(--rw2))}.r2.c4{left:calc(300%/var(--rw2))}.r2{height:calc(100% - var(--r2t))}.max{height:100%}iframe{width:100%;height:100%;transition:all .2s}.drg{z-index:3;transition:none !important;left:var(--mx) !important;top:var(--my) !important;pointer-events:none !important}.grab{display:none;position:absolute;background:rgba(var(--cbl), 0.8);width:100%;height:100%}.rlc{cursor:grab}.rlc .grab{display:flex}.menu{overflow:hidden;justify-content:flex-end;height:50px;background:rgba(var(--cbl), 0.8);position:absolute;top:0;z-index:1;transition:top .2s}.menu.e{top:-50px}.menu span{white-space:nowrap}.menu>.stretch{cursor:pointer;width:100%;height:100%}.chat{display:grid;grid-template-rows:auto 1fr 0;width:var(--cw);background:rgb(var(--cb))}.chat>*{position:relative;width:var(--cw)}.chat>.vp.r .chl{opacity:.2}main.co{--cw: 100vw}main.co>.video{display:none !important;visibility:collapse !important}main.co>.chat{height:100vh;height:100svh;top:0}main.co .f>.i>textarea{width:calc(100vw - 100px);width:calc(100svw - 100px)}.chat.fm{grid-template-rows:auto auto 1fr 0 0 auto}.chat.fm>.fm-tabs{grid-row:2}.chat.fm>.vp{grid-row:3;min-height:0}.chat.fm>.cb-c{grid-row:4}.chat.fm>.li-c,.chat.fm>.ri-c{grid-row:5}.chat.fm>.ci-c{grid-row:6;padding-bottom:12px;box-sizing:border-box}.chat.fm .chl{align-items:flex-start}.chat.fm .chl>.tt{justify-content:flex-start;align-items:flex-start}.chat.fm .chl>.tt>span{flex-direction:row;justify-content:flex-start;align-items:center}.chat.fm .chl>.tt>span *{text-align:left}.li-c,.ci-c{z-index:2}.hd{grid-row:1;height:50px;border-bottom:rgb(var(--cbl)) 1px solid}.hd .h{font-weight:bold}.hd .help{position:absolute}.hd .help>span{color:rgb(var(--cbl))}.hd .help:hover>span{color:rgb(var(--cf))}.vp{grid-row:2}.fade{opacity:0}.right{right:0;border-radius:100px 0 0 100px}.cb-c{grid-row:3}.cb-c>a{position:absolute;background:rgba(var(--cbd), 0.8)}.cb-c>a:hover{background:rgba(var(--cbl), 0.8)}.cb-c>.pd{bottom:8px;min-width:200px;border:rgb(var(--cbl)) 1px solid;padding:6px 12px;z-index:1}.cb-c>.pd>div{flex-direction:row}.cb-c>.pd.m{border-radius:100px;padding:6px;min-width:0}.cb-c>.right{margin:0;padding:6px 12px 6px 6px;transition:all .2s}.cb-c>.right.sd{right:-50px}.ca{bottom:105px}.nt{bottom:150px}.nt>.cnt{background-color:#d42727}.cnt{width:12px;height:12px;border-radius:12px;transition:all .2s;display:flex;font-size:8px}.li-c{grid-row:4}.li-c .ex>.icon{font-size:12px}.li-c .ex:hover{background:linear-gradient(rgb(var(--cbl)) 60%, transparent)}.li-c input{height:10px;padding:6px 12px;margin:4px}.li-c>div{width:100%}.li-c>div>*{position:relative;width:130px}.li-c>div>a{position:relative;height:30px;margin:4px 18px;background:rgb(var(--cfd))}.li-c>div img{height:100%;width:100%}.ri-c{grid-row:5}.ri-c>div{width:100%;padding:6px 0;background:#7e4ca0}.ri-c>div *{color:#fff}.ci-c{grid-row:6}.ci-c>.p{width:90%;position:absolute;bottom:calc(100% + 10px)}.ci-c>.p>div{width:100%}.ci-c.wr{background:linear-gradient(#7e4ca0, rgb(var(--cb)) 80%)}.f{position:relative}.f>.i{min-height:var(--ih)}.f>.i textarea{overflow:hidden;margin:4px 0;width:240px;height:20px;padding:10px 40px;white-space:pre-wrap}.f .d,.f .b.up{position:absolute;margin:10px 5px;transition:all .02s linear}.f .d,.f .d *,.f .b.up,.f .b.up *{color:rgb(var(--cfd))}.f .d:hover,.f .d:hover *,.f .b.up:hover,.f .b.up:hover *{color:rgb(var(--cf))}.f .d>.icon.pv,.f .b.up>.icon.pv{position:absolute;width:100%;height:100%}.f .d{bottom:0;right:0}.sc{align-self:flex-end;margin-right:8px}.sc .sb{margin:0}.p-dccon{max-height:50vh;max-height:50svh;height:400px;display:grid;grid-template-columns:1fr 40px}.p-dccon>*{grid-row:1;height:100%;max-height:50vh;max-height:50svh;width:100%}.dcl{grid-column:2}.dcl *{max-width:100%}.dcl a{width:100%;min-height:30px}.dcl a .dm{width:100%;height:100%;animation:glow 1s infinite}.dcl .vp{height:350px}.dcc{grid-column:1}.dcc div{width:100%}.dcc .vp{width:calc(100% - 10px);height:350px}.dcc .hd{border:none;background:rgb(var(--cbd));margin:10px 0}.dcc .flex{flex-wrap:wrap;gap:4px;justify-content:flex-start}.dcc .dm{height:100px}.dcc .d{cursor:pointer}.p.up{background:rgb(var(--cbl));bottom:100%;top:auto;box-shadow:rgb(var(--cbd)) 0 0 4px;left:0;width:calc(100% - 20px);margin:0;padding:10px}.pv-vp{height:auto}.pv-vp>.page{height:200px;max-width:none;align-items:center;padding:0}.pv{position:relative;background:rgb(var(--cb));height:180px;width:180px;margin:10px;padding:0;box-shadow:rgb(var(--cbd)) 0 0 2px}.pv>.image{position:relative;height:140px;width:140px}.pv>.image>img{max-height:100%;max-width:100%;margin:10px;filter:grayscale(100%)}.pv>.image>.error{color:#d42727}.pv>.image>.pending{animation:glow-color 1s infinite}.pv>.desc{width:calc(100% - 20px);padding:.2em 0}.pv>.desc>.file-name{max-width:100%;text-overflow:ellipsis;overflow:clip;white-space:nowrap}.pv>.desc>.size{color:rgb(var(--cfd))}.pv>.close{margin:-4px;background:rgb(var(--cb));box-shadow:rgb(var(--cbd)) 0 0 2px}.pv>.close:hover{background:rgb(var(--cbl))}.pv.error>.image>img{filter:blur(4px)}.pv.up>.image>img{filter:none}.o-f{order:-1}.o-l{order:1}@media(max-aspect-ratio: 3/4)or (max-width: 700px){main{flex-direction:column;align-items:flex-start}.video{height:60vw;height:60svw;width:100vw;width:100svw;position:fixed;top:0}.chat{height:calc(100vh - 60vw);height:calc(100svh - 60svw);min-height:0;width:100vw;width:100svw;position:fixed;top:60vw;top:60svw}.chat>*{width:100vw;width:100svw}.chat>.hd{display:none !important;visibility:collapse !important}main.co>.chat>.hd{display:flex !important;visibility:visible !important}.ci-c{flex-direction:row}.sc{margin-right:0px;align-self:center}.f>.i>textarea{width:calc(100vw - 200px) !important;width:calc(100svw - 200px) !important}}.nc{display:grid;grid-template-columns:.6em .6em .6em;height:1em !important;overflow:hidden;position:relative}.nc>div{grid-row:1;display:grid;grid-template-rows:1em 1em;top:-1em;position:absolute}.nc>div>span{grid-column:1;height:100%;max-width:1em;padding:0;line-height:1.2em !important}.nc>div>.old{grid-row:1}.nc>div>.new{grid-row:2}.nc>div.changed{animation:num-change .2s}.nc>.num-0{grid-column:3}.nc>.num-1{grid-column:2}.nc>.num-2{grid-column:1}@keyframes num-change{from{top:0}to{top:-1em}}.hl{transition:all .3s .1s;background:#7e4ca0}.hl-alt{animation:blink .5s}@keyframes glow{0%{background-color:rgba(var(--cfd), 0.8)}50%{background-color:rgba(0,0,0,0)}100%{background-color:rgba(var(--cfd), 0.8)}}@keyframes glow-color{0%{color:rgb(var(--cf))}50%{color:rgb(var(--cfd))}100%{color:rgb(var(--cf))}}@keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes fade-out{from{opacity:1}to{opacity:0}}@keyframes fade-in-grow{0%{scale:.6;opacity:0}50%{scale:1.02}100%{scale:1;opacity:1}}@keyframes fade-out-shrink{from{scale:1;opacity:1}to{scale:.6;opacity:0}}@keyframes blink{0%{opacity:1}25%{opacity:.5}50%{opacity:1}75%{opacity:.5}100%{opacity:1}}.rotate-ccw-half{animation:rotate-ccw-half .8s}@keyframes rotate-ccw-half{0%{rotate:180deg}100%{rotate:0deg}}@keyframes rotate-cw{0%{rotate:0deg}100%{rotate:360deg}}'.r(/_w/g,"width").r(/_h/g,"height").r(/_b/g,"background").r(/_m/g,"margin").r(/_p/g,"padding").r(/_d/g,"display").r(/_i/g,"!important").r(/_P/g,"position").r(/_T/g,"top").r(/_B/g,"bottom").r(/_L/g,"left").r(/_R/g,"right").r(/_r/g,"relative").r(/_a/g,"absolute").r(/_o/g,"overflow").r(/_f/g,"flex").r(/_F/g,"font").r(/_j/g,"justify-content").r(/_g/g,"grid-").r(/_c/g,"calc").r(/_x/g,"100%");Gl=dt?Gl.r(/_s/g,""):Gl.r(/_s/g," or (max-width:700px)"),ai("style",at,{[gt]:Gl}),ai("link",at,{rel:"stylesheet",href:St+"fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"}),st&&Vr(),d=ai(kt,lt,"log",yt),di();let Nl=ai(kt,lt,"o");ai(kt,Nl,{[gt]:Ie},"drop");let Ql=ai(kt,lt,"o"),Pl=(e=!1)=>{e&&1==Ql.childNodes.length||!Ql.lastChild?si(Ql,"wait"):ci(Ql,"wait"),pi=0!==Ql.childNodes.length},Rl=!0;it.addEventListener("keyup",e=>{"Enter"==e.key&&(Rl=!0)}),it.addEventListener("keypress",e=>{Rl&&"Enter"===e.key&&pi&&(Ql.lastChild&&Ql.lastChild.enter?.(),Rl=!1)});let Ul,Bl=({title:e,desc:t,options:r,close:i,html:l,input:a,nowrap:n})=>{r||(r=[{text:y,[mt]:e=>e()}]);let o=ai(kt,Ql,"modal");e&&ai(kt,o,{[gt]:e},"tt");let c=ai(kt,o,"desc");o.content=c,t&&(l?c.innerHTML=t:c[gt]=t);let s=()=>{ci(o,yt),o.remove(),Pl()};i&&ni(ai("a",o,{[mt]:s},"b.close.abs-tr"),"close"),void 0!==a&&(o.input=n?ai("input",o,{type:"password",value:a},"nowrap"):ai("textarea",o,{value:a}));let d=ai(kt,o,"opts.fr");1===r.length&&(r[0].enter=!0);for(let e of r){let t=()=>{i[gt]="",ni(i,"progress_activity","progress")},r=null!=e.icon,i=ai("a",d,{[gt]:r?"":e.text??e,[mt]:e.onclick?()=>e.onclick(s,t):s},"sb.r");r&&(ni(i,e.icon),ai(Ot,i,{[gt]:e.text})),e.enter&&Ht(()=>{o.enter=()=>i.click(),n&&ui(o.input,i,!1,!0)},100)}return Pl(),o},Hl=e=>Bl({desc:e}),Fl=(e,{text:t,top:r=!1},...i)=>{ci(e,"has-tooltip");let l=ai(kt,e,"tooltip",r?"tp":"bt",...i);return ai(Ot,l,{innerText:t}),l},Wl=(e,t=[])=>{e.oncontextmenu=e=>{e.preventDefault();let r=e.clientX,i=e.clientY;for(option of(Ul&&Ul.remove(),Ul=ai(kt,lt,"p.ctx"),Ul.style.left=r+"px",Ul.style.top=i+"px",t)){if(option.hr){ai("hr",Ul);continue}let e=ai("a",Ul,"fr.b");option.icon&&ni(e,option.icon),option.text&&ai(Ot,e,{[gt]:option.text}),option[mt]&&(e[mt]=option[mt])}return Ul}};it.addEventListener("click",()=>{Ul&&Ul.remove(),Ul=null});let Vl=ai("main",lt);let ea,ta=ai(kt,Vl,"video"),ra=ai(kt,ta,"menu"),ia=ai(kt,ta,"main"),la=!0,aa=e=>{la="boolean"==typeof e?e:!la,la?(si(ra,"e"),ea[gt]="expand_less"):(oa&&ca.click(),ci(ra,"e"),ea[gt]="expand_more")};ai(kt,ra,{[mt]:aa},"stretch");let na=ai("a",ra,{[mt]:()=>{ci(ia,"go"),si(ua,yt)}},"b");ni(na,"add"),ai(Ot,na,{[gt]:Te});let oa=!1,ca=ai("a",ra,"b",_t),sa=ni(ca,"pan_tool"),da=ai(Ot,ca,{[gt]:ze});ca.onclick=()=>{oa=!oa,oa?(ci(ca,".t"),sa[gt]="check",da[gt]=Je,ci(ia,"rlc")):(si(ca,".t"),sa[gt]="pan_tool",da[gt]=ze,si(ia,"rlc"))};let pa=ai("a",ra,"b",_t);ni(pa,"close"),ai(Ot,pa,{[gt]:De}),ea=ni(ai("a",ra,{[mt]:aa},"b.fix-tl"),"expand_less");let ua=ai(kt,ia,"p.fr.blank"),ha=ai("a",ua,{[mt]:()=>{si(ia,"go"),ci(ua,yt)}},"b.abs-tr",yt);ni(ha,"close"),ni(ua,"link","ph").onclick=()=>fa.focus();let ga=()=>{""!==fa.value?si(ua,"blank"):ci(ua,"blank")},fa=ai("textarea",ua,{[ft]:C,oninput:ga,onchange:ga},"src"),ma=ai("a",ua,{[mt]:()=>ya(fa.value)},"sb");ai(Ot,ma,{[gt]:y}),ui(fa,ma);let ba=[],wa=[],va=()=>{if(Er())return ci(ra,yt),ci(ta,yt),ci(ua,yt),ci(ha,yt),si(ia,"go"),void(oa&&ca.click());if(hr)si(ra,yt);else{let e=Math.min(wa.length,1);ci(ra,yt),ba.length=e;for(let e=1;e<wa.length;e++)wa[e]?.remove();wa.length=e,oa&&ca.click()}if(ci(ca,_t),si(ca,".t"),si(ia,"go"),!wa.length)return oa&&ca.click(),ci(pa,_t),ci(ha,yt),void si(ua,yt);si(pa,_t),si(ca,_t),si(ha,yt),ci(ua,yt),1==wa.length?Wr("--r2t","0px"):Wr("--r2t","50%");let e=(wa.length-1)/2,t=0,r=0;for(let i=0;i<wa.length;i++){let l=wa[i];si(l,..."r1.r2.c1.c2.c3.c4".split(".")),i<e?(ci(l,"r1"),t++,ci(l,"c"+t)):(ci(l,"r2"),r++,ci(l,"c"+r))}Wr("--rw1",t),Wr("--rw2",r)},xa=e=>{let t=e.match(Jt);if(t)return _a(t[2]);let r=e.match(Dt);if(r){let t=0,i=e.match(/t=([0-9]+)/);return i&&(t=i[1]),ka(r[2],t)}qa(e)},ya=e=>{if(!e)return Hl(O);if("show log"==e)return si(d,yt);if("clear options"==e)return ql({});if("show options"==e)return $r(Cl);if("refresh update"==e)return pc();let t=ba.length;if(!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(e))return Hl(O);/^[A-Za-z]+:\/\//.test(e)||(e="https://"+e),xa(e),0===t&&1===ba.length&&aa(!1),va()};onmessage=e=>{let t;t="object"==typeof e.data?e.data:JSON.parse(e.data),t&&(t.type==vt?(e=>{let t=it[ht]("#"+e).parentNode,r=t.classList.contains("d"),i=t.getAttribute("data-src"),l=ai("img",null,{src:i,draggable:!1},r?"d":"_");r||(l[mt]=()=>onImageClick(i)),t.insertAdjacentElement("beforebegin",l),ci(t,yt)})(t.id):t.type==wt?(e=>{let t=decodeURIComponent(e).r(/&amp;/g,"&");if(Er())return Bl({title:I,desc:t,options:[{text:A,icon:"open_in_new",[mt]:e=>{let r=ai("a",null,{href:t,target:"_blank"});r.click(),r.remove(),e()},enter:!0}],close:!0});Bl({title:I,desc:t,options:[{text:A,icon:"open_in_new",[mt]:e=>{let r=ai("a",null,{href:t,target:"_blank"});r.click(),r.remove(),e()}},{text:y,[mt]:e=>{ya(t),e()},enter:!0}],close:!0})})(t.url):t.type==xt&&((e,t)=>{let r=document[ht]("#"+t);if(!r)return;let i,l=r[ut]("img"),a=[],n=0;for(let t=0;t<l.length;t++){let r=l[t];if(r.classList.contains(yt))continue;if(r.classList.contains("d"))continue;let i=r.getAttribute("data-osrc");i==e&&(n=t),a.push(i)}let o=!1,c=ai(kt,Ql,{[mt]:()=>{o||(ci(i,"fo"),Ht(()=>{c.remove()},200),Pl(!0))}},"ipvs");i=ai("img",c,{src:a[n],draggable:!1,[mt]:()=>{o=!0,Bt(()=>o=!1)}},"ipv");let s=ai(kt,c,"fr"),d=ai("a",s,{[mt]:()=>{o=!0;let e=ai("a",null,{href:i.src,download:""});e.click(),e.remove(),Bt(()=>o=!1)}},"b");ni(d,"download"),ai(Ot,d,{innerText:Ee}),Pl()})(t.src,t.id))};let _a=e=>{qa(St+"player.twitch.tv/?channel="+e+"&parent=gall.dcinside.com")},ka=(e,t=0)=>{qa(St+"www.youtube.com/embed/"+e+"?start="+t,{allow:"autoplay; picture-in-picture"})},Oa=null,Ia="",Aa=!1,Ca=0,La=0,qa=(e,t={})=>{if(fa.value="",ba.includes(e)){let t=wa[ba.indexOf(e)];return ci(t,"hl-alt"),void Ht(()=>si(t,"hl-alt"),500)}let r;hr||(ba.length=0,wa[0]?.remove(),wa.length=0),ba.push(e),zl("videos-"+tr,ba);let i=ai(kt,ia);wa.push(i),r=()=>wa.indexOf(i);let l=(t,r)=>{Oa||(ci(i,"drg"),Ca=()=>i.getClientRects()[0].width/2,La=()=>i.getClientRects()[0].height/2+50,Wr("--mx",t-Ca()+"px"),Wr("--my",r-La()+"px"),Oa=i,Ia=e)},a=(e,t)=>{Bt(()=>{Wr("--mx",e-Ca()+"px"),Wr("--my",t-La()+"px")})},n=ai(kt,i,{onmousedown:e=>{l(e.clientX,e.clientY),onmouseup=()=>{si(i,"drg"),Oa=null,onmouseup=null,onmousemove=null},onmousemove=e=>a(e.clientX,e.clientY)},onmousemove:()=>{if(!Oa||Aa)return;let e=r(),t=wa.indexOf(Oa);e!=t&&(wa.splice(t,1),wa.splice(e,0,Oa),ba.splice(t,1),ba.splice(e,0,Ia),Aa=!0,ql(),Ht(()=>Aa=!1,200),va())},ontouchstart:e=>{l(e.touches[0].clientX,e.touches[0].clientY);let t=()=>{si(i,"drg"),Oa=null,ontouchend=null,ontouchcancel=null,ontouchmove=null};ontouchend=t,ontouchcancel=t,ontouchmove=e=>{a(e.touches[0].clientX,e.touches[0].clientY);let t=it.elementFromPoint(e.touches[0].pageX,e.touches[0].pageY);t?.onmousemove?.()}}},"grab.fr");ni(n,"drag_indicator"),t.sandbox="allow-same-origin allow-scripts";let o=ai("iframe",i,t);va(),o.src=e;let c=ai("a",i,{[mt]:()=>((e,t)=>{Gr(ba,e),Gr(wa,t),ql(),t.remove(),va()})(e,i)},"close.b.abs-tr");ni(c,"close"),Fl(c,{text:Se})};Ll["videos-"+tr]=e=>{if(!Er())for(let t of e)ba.includes(t)||xa(t)},pa[mt]=()=>{ba.length=0;for(let e of wa)e.remove();wa.length=0,ql(),va()};let Ta=[],za=ai(kt,Vl,"chat");Er()&&(ci(Vl,"co"),ci(za,"fm"));let Ja=ai(kt,za,"hd");ai(Ot,Ja,{[gt]:z},"h");let ja=!1,Da=ai("a",Ja,{[mt]:()=>{ja||(ja=!0,pc("button"),ci(Ea,"rotate-ccw-half"),Ht(()=>{ja=!1,si(Ea,"rotate-ccw-half")},800))}},"help.b.abs-tl"),Ea=ni(Da,"sync"),Sa=ai("a",Ja,{href:Zt,target:"_blank"},"help.b.abs-tr");ni(Sa,"help");let Ka=ai(kt,za,"fm-tabs",yt),$a=ai(kt,za,"vp"),Ya=ai(kt,$a,"page"),Ma=ai(kt,za,"cb-c"),Za=ai("a",Ma,{[mt]:()=>{for(;Ta.length;)Ta.shift().click()}},"r.b.ca.right.sd");ni(Za,"close");let Xa=()=>{Ta.length?si(Za,"sd"):ci(Za,"sd")},Ga={},Na={},Qa=[],Pa=ai("a",Ma,{[mt]:()=>{if(!Qa.length)return;let e=Qa.shift();for(let t of e[1])Ga[e[0]](t);let t=ai("a",null,{href:"#"+e[0]});t.click(),t.remove(),Ua()}},"r.b.nt.right.sd");ni(Pa,"notifications");let Ra=ai(Ot,Pa,"cnt.abs-tl.fade"),Ua=()=>{Qa.length?(si(Pa,"sd"),si(Ra,"fade"),Ra[gt]=Qa.length<10?Qa.length:"9+"):(ci(Pa,"sd"),ci(Ra,"fade"))},Ba=(e,t)=>"n"+e+"_"+t,Ha=(e,t,r=null)=>{if(!Na[e])return void 0;let i=Ba(e,t);if(!Ga[i])return void 0;let l=Qa.find(e=>e[0]==i);l||(l=[i,[]],Qa.push(l)),l[1].push(r),Ua()},Fa=(e,t,r)=>{Na[e]=!0,Ga[Ba(e,t)]=r},Wa=ai("a",Ma,{[mt]:()=>c(),onscroll:e=>e.preventDefault()},"r.pd.fr",st?"m":"_",yt),Va=ai(kt,Wa,"not-hover");ni(Va,st?Lt:"pause"),ai(Ot,Va,{[gt]:J},"text",st?yt:"_");let en=ai(kt,Wa,"hover");ni(en,Lt);let tn=ai(Ot,en,{[gt]:j},"text",st?yt:"_"),rn=0;$a.onscroll=()=>{let e=Math.abs(Ya.scrollHeight-$a.clientHeight-$a.scrollTop),t=rn-e;if(rn=e,e<2&&cn(),0!=t)return t<0&&Ar&&e>2?0==qr?c():void(qr=Math.max(qr-1,0)):void(!Ar&&e<2&&c())};let ln={},an=async(e,t,r,...i)=>{let l,a=((e,t,r)=>r?e+r:e+t)(e,t,r);null!=ln[a]?l=ln[a]:(l=await Qr(a).catch($r),ln[a]=l),l=function(e){let t=Ut(e.substring(1,7),16);return"hsl("+Math.floor(360*t/16777215)+",80%,60%)"}(l);for(let e of i)e&&(e.style.color=l)},nn=(e,t,r,i,l,a)=>{l&&ai("img",e,{src:l},"nikcon");let n=ai(Ot,e,{[gt]:t},"name"),o=null;r?a||(o=ai(Ot,e,{[gt]:r},"ip.id")):i&&(o=ai(Ot,e,{[gt]:i},"ip")),ai(Ot,e,{[gt]:": "}),an(t,r,i,n,o)},on=e=>{Ir=e;let t=D;0!=e&&(t=e>20?E:e+S),tn.innerText=K+t},cn=()=>{let e=Ya.childNodes;for(;e.length>80;){let t=e[0];sn(t)}},sn=e=>{for(let t=0;t<un.length;t++){if(un[t].chat==e){un.splice(t,1);break}}let t=e[ut]("removed");t&&t.length&&(t[0].value=!0),e.remove(),o(!0)};o=(e=!1)=>{if(qr=e?1:0,Ar)return $a.scrollTop=Ya.scrollHeight},c=()=>{Ar=!Ar,Ar?(ci(Wa,yt),on(0),o(!0)):si(Wa,yt)};let dn,pn,un=[],hn={},gn={},fn={},mn={},bn=e=>{e?.chat&&((e=>{if(!Er())return!0;let t=Ol();return!t.length||t.includes(e)})(e.subject??"")?si(e.chat,"filtered"):ci(e.chat,"filtered"))};pn=()=>{for(let e of un)bn(e);o(!0)},dn=()=>{if(!Er()||!nr.length)return void ci(Ka,yt);oi(Ka),si(Ka,yt);let e=ai(kt,Ka,"fm-tabs-wrap"),t=(t,r,i)=>{let l=ai("a",e,{[mt]:i,title:t},"fm-tab",r?"chk":"");return ai(Ot,l,{[gt]:r?"✓":""},"fm-tab-box"),ai(Ot,l,{[gt]:t},"fm-tab-label"),l};t("전체",0==Ol().length,()=>zl(kl(),""));for(let e of nr)t(e,Ol().includes(e),()=>{let t=Ol();t.includes(e)?Gr(t,e):t.push(e),zl(kl(),t.join("||"))})};let wn=e=>{si(e,yt),e.classList.contains("filtered")||(Ar||on(Ir+1),o(!0))},vn=async e=>{let t=e.num,r=ai(kt,Ya,"chl",yt),i=ai("input",r,{type:yt,value:!1},"removed"),l=ai(kt,r,"tt.r"),n=ai(Ot,l),s=e.nickname,d=e.ip,p=ml(e.title),u=ml(e.subject),h=e.id,g=e.img,m=e.fix,b=e.my??!1,w=jl(),v=El(tr,ar);(Sl(e,w)||Sl(e,v))&&ci(r,"block"),un.push({chat:r,title:p,subject:u,id:h,ip:d,nickname:s}),bn(un[un.length-1]),s?nn(n,s,h,d,g,m):ci(r,"notify"),u&&ai(Ot,n,{[gt]:u},"sg");let x,k=ai(Ot,n,{[gt]:p},"tt"),O=!1,I=[];for(let t of p.matchAll(Tt)){let r=t[0],i=t[1],l=t[2],a=Vi(i,l);a?(ll(k,r,a),o(!0)):(I.push([r,i,l]),O||(O=!0,(async()=>{let{write:t}=await rc(e.num).catch($r);if(!t)return;let r=Oi(t,"img","written_dccon");for(let e of r){let t=Ci(e,"src").match(zt);if(t)await Hi(t[1]).catch($r);else{let t=Ci(e,"data-src").match(zt);t&&await Hi(t[1]).catch($r)}}for(let e of I){let t=Vi(e[1],e[2]);t&&ll(k,qt(e[0]),t)}o(!0)})()))}if(t){l.id=Ba(t,0);let e=ai(kt,r,"w.zero");x=ai(kt,e,"vp.post");let s=ai(kt,x,{id:"pc-"+t},"page.pc"),p=!0;b&&Fa(t,0,()=>{p&&l.click()});let u=()=>{ci(r,"open"),si(e,"zero"),a(0),Ar&&c(),j(),Gr(Ta,l),Ta.push(l),Ta.length>5&&Ta.shift().click(),Xa(),rc(t).catch($r).then(({text:e})=>{const t=e.matchAll(/<iframe[^>]*id="movieIcon([^"]*)"[^>]*>[^<]*<\/iframe>/g);t?(async()=>{for(const r of t){const t=Mt+"board/movie/movie_view?no="+r[1],i=await Ei(t);if(!i)continue;const l=i.match(/<video[^>]*poster="([^"]*)"[^>]*>[^<]*<source[^>]*src="([^"]*)"[^>]*type="([^"]*)"[^>]*>/);if(!l)continue;const a=ai(kt,null,"v-container"),n=ai(kt,a,"video_wrap");ai("source",ai("video",ai(kt,n,"video_inbox"),{controls:!0,playsinline:!0,controlslist:"nodownload",poster:l[1],"data-no":r[1]},"dc_mv"),{src:l[2],type:l[3]}),e=e.r(r[0],a.outerHTML),a.remove()}s.innerHTML=e})():s.innerHTML=e})};l.onclick=()=>{if(p=!p,xr==t&&a(0),p){for(Gr(Ta,l),ci(e,"zero"),si(r,"open");s.lastChild;)s.lastChild.remove();return o(),void Xa()}u()};let h,g,m=ai(kt,e,"cm",yt),w=ai(kt,m,"vp"),v=ai(kt,w,"page"),k=ai("a",m,{[mt]:()=>h()},"ex.sm.r");ni(k,"more_vert");let O=ai("a",e,{[mt]:()=>{xr==t?a(0):a(t,r,I)}},"ic.r");Er()&&ci(O,yt);let I=ai(Ot,O,{[gt]:G}),A=ai("a",e,{[mt]:()=>l.click()},"ex.alt");ni(A,"expand_less");let C={},L=[],q=[],T=ai(kt,v,"w"),z=0,J=0,j=async()=>{if("false"!=i.value)return;let e=await lc(t).catch($r);if(!e)return;e.count?si(m,yt):ci(m,yt);let n=z;for(let i in e.comments){if(L.includes(i))continue;L.push(i),J>20&&(T=ai(kt,v,"w",yt),n++,J=0);let o=e.comments[i],c=ai(kt,null,"w"),s=ai("a",null,"cml.r");s.id=Ba(t,i);let u=o.text,h=o.target,g=o.name;if(h){let t=e.comments[h];t&&(g=t.name),ci(s,"re"),ni(ai(kt,s,"re-icon"),Ct)}let m=u.length>8&&u.substring(u.length-8)==_r;if(m?(_r="",Fa(t,h||i,e=>{p&&l.click(),ci(e,"hl"),Ht(()=>si(e,"hl"),500)})):Ha(t,h,s),Er()||(s.onclick=()=>a(t,r,I,s,h||o.num,o.name,g)),null==C[h])C[o.num]=c,c.appendChild(s),T.appendChild(c),q.length==n&&q.push(T);else{C[h].insertAdjacentElement("beforeend",s)}let w=ai(kt,s,"writer-dlc");nn(w,o.name,o.id,o.ip,o.img,o.fix),ai(kt,s,{innerHTML:u},"text"),J++;let x=[{text:Ge,icon:"delete",[mt]:async()=>{let e="",{delId:r,delValue:l,vCurT:a}=await rc(t).catch($r);if(d||o.ip){let{r:t,p:r}=Yr(),i=Bl({title:Y,input:e,nowrap:!0,options:[{text:y,[mt]:r=>{if(e=i.input.value,e.length<2)return Hl(f);r(),t(!0)}},{text:_,[mt]:e=>{e(),t(!1)}}]});if(!await r)return}let n=await Xi(i,{num:t,id:r,value:l,vCurT:a},e);n||Hl(he);let c=n.split("||");return"true"==c[0]?(s.remove(),j()):1==c.length?Hl(n):void Hl(he)}}];Dr()&&(b||d||m||o.ip||o.id==fr)&&Wl(s,x)}g(),o(!0)};h=()=>{z++;let e=q[z];e&&si(e,yt),g()},g=()=>{z+1==q.length?ci(k,yt):si(k,yt)};let D=ai(Ot,n,"cm.fr",yt);ni(D,Ct,"f");let E=ai(kt,D,"nc.gray-div"),S=ai(Ot,D,{[gt]:"+"}),K=[],$=[],M=[];for(let e=0;e<3;e++){let t=ai(kt,E,"num-"+e);$.push(ai(Ot,t,"old")),M.push(ai(Ot,t,"new")),K.push(t)}let Z=(e,t,r)=>{let i=3-t+e,l=M[i][gt];$[i][gt]=l,M[i][gt]=r,r!=l&&(ci(K[i],"changed"),Ht(()=>si(K[i],"changed"),500))},X=e=>(e+"").split("").reverse();fn[t]=(e=-1,r=!1)=>{if("false"!=i.value)return void delete fn[t];let l=()=>{-1==e&&(e=gn[t]+1),gn[t]=e;let r=X(e);r.length>3?(r="999".split(""),si(S,yt)):ci(S,yt);for(let e=0;e<r.length;e++)Z(e,r.length,r[e]);e?(si(D,yt),o(!0)):ci(D,yt),p&&!Na[t]||j().catch($r)};r?l():Ht(l,Mr(1,kr))}}if(e.date){let t=Vt()-e.date;(t>kr||!Lr)&&wn(r),Ht(()=>wn(r),kr-t)}else wn(r);Ar||cn();let C=[];Dr()&&(b||d||pr&&h==fr)&&C.push({text:Ge,icon:"delete",[mt]:()=>{Bl({title:Ne,desc:Qe,options:[{text:y,enter:!0,[mt]:async(e,i)=>{i();let l="";if(d){let{r:t,p:r}=Yr(),i=Bl({title:Y,input:l,nowrap:!0,options:[{text:y,enter:!0,[mt]:(e,r)=>{if(l=i.input.value,l.length<2)return Hl(f);t(!0),e()}},{text:_,[mt]:e=>{t(!1),e()}}]});if(!await r)return e()}let a=await Mi(t,l);e();let n=a.split("||");if("false"==n[0])return Hl(n[1]);sn(r)}},{text:_}]})}},{hr:!0}),t&&(C.push({text:A,icon:"open_in_new",[mt]:()=>{let e=ai("a",null,{href:bi(t),target:"_blank"});e.click(),e.remove()}},{text:Pe,[mt]:()=>{window.navigator.clipboard.writeText(bi(t))}}),b||!d&&h==fr||(C.push({hr:!0}),d?C.push({text:Ue,[mt]:()=>{Bl({title:He,desc:"IP: "+d,options:[{text:Ve,[mt]:e=>{let t=El(tr,ar);t.on=1,Ml(t,"ip",d),Yl(t,tr),e()}},{text:We,[mt]:e=>{let t=jl();t.on=1,Ml(t,"ip",d),$l(t),e()}},{text:_}]})}}):C.push({text:Re,[mt]:()=>{Bl({title:He,desc:"ID: "+h,options:[{text:Ve,[mt]:e=>{let t=El(tr,ar);t.on=1,Ml(t,"id",h),Yl(t,tr),e()}},{text:We,[mt]:e=>{let t=jl();t.on=1,Ml(t,"id",h),$l(t),e()}},{text:_}]})}}),C.push({text:Be,[mt]:()=>{Bl({title:He,desc:s,options:[{text:Ve,[mt]:e=>{let t=El(tr,ar);t.on=1,Ml(t,"nick",s),Yl(t,tr),e()}},{text:We,[mt]:e=>{let t=jl();t.on=1,Ml(t,"nick",s),$l(t),e()}},{text:_}]})}}))),C.length&&(Wl(l,C),Wl(x,C))};let xn=ai(kt,za,"li-c"),yn=ai("a",xn,{[mt]:()=>s()},yt,"ex.tab"),_n=ni(yn,"expand_more");s=()=>{Tr=!Tr,Tr?(_n.innerText="expand_more",si(On,yt)):(_n.innerText="expand_less",ci(On,yt)),o(!0)};let kn,On=ai(kt,xn,"fr",yt),In=ai("input",On,{type:"text",[ft]:$,maxlength:15,name:"name"}),An=ai("input",On,{type:"password",[ft]:Y,maxlength:20,name:"password"}),Cn=ai(kt,xn,"fr",yt),Ln=ai("a",Cn),qn=ai("img",Ln,{[mt]:()=>Jn()},"captcha"),Tn=ai("input",Cn,{type:"text",[ft]:M,maxlength:20}),zn=()=>{dr&&(zr?(In.value=zr,ci(In,_t)):si(In,_t))},Jn=async()=>{if(Tn.value="",Kr()){let e=Sr(),t={ci_t:Hr("ci_c"),gall_id:tr,kcaptcha_type:e?"write":"comment",_GALLTYPE_:rr},r=Mt+"kcaptcha/session";e?await Yi(r,t).catch($r):await Zi(xr,r,t).catch($r),qn.src=Mt+"kcaptcha/image/?gall_id="+tr+"&kcaptcha_type="+(e?"write":"comment")+"&time="+Vt()+"&_GALLTYPE_="+rr,si(Cn,yt)}else ci(Cn,yt)};i=()=>{if(Er())return ci(xn,yt),dn?.(),void kn?.();pr||Jl(ee)?ci(xn,yt):(si(On,yt),si(yn,yt),o(!0)),kn?.()};let jn=()=>In.value??"",Dn=()=>zr||(pr?gr:jn()),En=()=>An.value??"",Sn=()=>Tn.value??"",Kn=ai(kt,za,"ri-c",yt),$n=ai(kt,Kn,"tab"),Yn=ai(Ot,$n,"name"),Mn=ni($n,"more_horiz",yt),Zn=ai(Ot,$n,"name",yt),Xn=ai(Ot,$n,{[gt]:Z});let Gn=ai(kt,za,"ci-c"),Nn=ai(kt,Gn,"f"),Qn=ai(kt,Nn,"i"),Pn="--ih",Rn=ai("textarea",Qn,{[ft]:L,oninput:()=>{Wr(Pn,Rn.clientHeight+12+"px"),Rn.style.height=0,Rn.style.height=Rn.scrollHeight-19+"px",o(!0),Bt(()=>Wr(Pn,0))},onblur:di},_t),Un=null,Bn=null,Hn=null;a=(e,t,r,i=null,a=0,n="",c="")=>{if(null!=i&&i==Hn&&(e=0,a=0),Un&&Bn&&(Hn&&si(Hn,"rp"),si(Un,"wr"),si(Un,"rp"),Bn[gt]=G,si(Bn,"f-white"),ci(Kn,yt),si($a,"r"),ci(Mn,yt),ci(Zn,yt)),xr=e,yr=a,Sr())ur&&(ci(Rn,_t),ci(yo,_t),ci(lo,_t),ci(ec,_t),pr||ci(xn,yt)),si(Gn,"wr"),Rn[ft]=L,Un=null,Bn=null,Hn=null;else{if(ur&&(si(Rn,_t),si(yo,_t),si(lo,_t),si(ec,_t),pr||si(xn,yt)),ci(Gn,"wr"),ci(t,"wr"),i&&a)ci(i,"rp"),ci(t,"rp"),Rn[ft]=q,Yn[gt]=n,n!=c&&(Zn[gt]=c,si(Mn,yt),si(Zn,yt)),Xn[gt]=Z,r[gt]=_,si(r,"f-white");else{let t=hn[e];Yn[gt]=t.name,Rn[ft]=T,Xn[gt]=X,r[gt]=N,ci(r,"f-white")}si(Kn,yt),ci($a,"r"),Un=t,Bn=r,Hn=i??null,Rn.focus()}l(),Jn(),go(),zn(),o(!0)};let Fn=ai(kt,Gn,"p.p-dccon",yt),Wn=ai(kt,ai(kt,ai(kt,Fn,"dcl"),"vp"),"page"),Vn=ai(kt,ai(kt,ai(kt,Fn,"dcc"),"vp"),"page"),eo=e=>{let t=e.idx,r=e.title,i="dc"+t,l=ai(kt,null,"package"),a=it[ht]("#"+i);if(a)Vn.replaceChild(l,a);else{Vn.appendChild(l);let t=ai("a",Wn,{href:"#"+i,[mt]:()=>{Rn.focus(),di()}});r==u?ni(t,"history"):ai("img",t,{src:el(e.code)})}l.setAttribute("id",i),ai(Ot,ai(kt,l,"hd.r"),{[gt]:r});let n=ai(kt,l,"flex.fr");for(let t of e.detail){let e=t.code,i=t.title;t.package_title;ai("img",n,{loading:"lazy",src:el(e),[mt]:async()=>{let t=await Hi(e);if(Sr()){rl(t);let l=r;r==u&&(null!=Qi[e]||await Hi(e),l=Qi[e].package_title),Rn.focus(),Rn.value+=":"+l+", "+i+": "}else il(t,xr)}},"d")}},to=async e=>{await(async e=>{if("recent"==e&&await tl(e,0),"icon"==e){let t=Math.min(await tl(e,0),20);for(let r=1;t>=r;r++)await tl(e,r)}})(e).catch($r)};Ll["dccon-pk"]=e=>{for(let t in e){if(Pi.includes(t))continue;let r=e[t];for(let e of r.detail)Qi[e.code]=e;Pi.push(r.title)}};let ro=!0,io=!1,lo=ai("a",Nn,{onmousedown:()=>(ro=!ro,ro?(si(ao,"f"),ci(Fn,yt)):(Rn.focus(),ci(ao,"f"),si(Fn,yt),io||(io=!0,to("recent"),to("icon"))),void Bt(()=>Rn.focus()))},"d.b",_t),ao=ni(lo,"mood");let no=ai(kt,Nn,"p.up.abs.vp.pv-vp",yt),oo=ai(kt,no,"fr.page"),co=ai("a",oo,{[mt]:()=>xo.click()},"pv.r.b.o-l");ni(co,"add_photo_alternate"),ai(Ot,co,{[gt]:$e});let so=null,po=!1,uo=[],ho=!1,go=()=>{null!==so&&(Xo?(si(so.preview,yt),po?si(so.preview,"up"):ci(so.preview,"up")):ci(so.preview,yt)),Io[gt]=uo.length,0==uo.length?ci(Io,yt):si(Io,yt),ho&&Sr()?(si(no,yt),ci(Oo,"f")):(ci(no,yt),si(Oo,"f"))},fo=(e=null)=>{ho=null===e?!ho:e,go()},mo=(e,t)=>{let r=ai(kt,e,"pv.r"),i=ai(kt,r,"image"),l=ai("img",i),a=ai(kt,r,"desc"),n=ai(Ot,a,{[gt]:t.name},"file-name");return ai(Ot,a,{[gt]:"("+li(t.size)+")"},"size"),{p:r,c:i,i:l,n:n}},bo=e=>{let{p:t,c:r,i:i}=mo(oo,e),l=ni(r,"pending","pending.abs"),a=ni(r,"warning","error.abs",yt),n=new FileReader;n.onload=()=>i.src=n.result,n.readAsDataURL(e);let{r:o,p:c}=Yr(),s={preview:t,img:i,original:e.name,name:"",size:e.size,type:e.type,upload:!1,file:e,error:!1,num:0,url:"",close:async()=>{t.remove();for(let e=0;e<uo.length;e++){let t=uo[e];if(s===t){uo.splice(e,1);break}}go(),s.upload?Ni(s.num):(await c.catch($r),s.error||Ni(s.num))},p:c};uo.push(s);let d=ai("a",t,"close.abs-tr.b");ni(d,"delete","f"),d.onclick=()=>s.close();let p=(e,...r)=>{Hl(e),$r(e,...r),s.error=!0,ci(t,"error"),si(a,yt)};return Gi(e).catch($r).then(e=>(ci(l,yt),e?e.error?p(e.error,e):(s.upload=!0,ci(t,"up"),s.name=e.name,s.url=e.url,s.num=e.file_temp_no,void o()):p(be))),s},wo=(e=null)=>{if(null!==so&&so.close(),null===e)return so?.preview.remove(),zl("zzal",""),si(Zo,yt),void(so=null);so=e,ci(so.preview,"o-f","z");for(let t=0;t<uo.length;t++)uo[t]===e&&uo.splice(t,1);e.close=()=>{po=!0};let{p:t,i:r,n:i}=mo(zo,e);ci(t,"up","o-f"),ci(Zo,yt);let l=ai("a",t,"close.abs-tr.b");ni(l,"delete","f"),l.onclick=()=>{Bl({desc:Ke,options:[{text:k,[mt]:e=>{wo(null),t.remove(),e()},enter:!0},{text:_}]})};let a=()=>{r.src=e.img.src,i.innerText=e.name;let t=(e=>({name:e.name,size:e.size,type:e.type,url:e.url,src:e.img.src}))(e);zl("zzal",JSON.stringify(t))};e.upload?a():(async()=>{await e.p,a()})(),go()},vo=e=>e.size>2e7?Hl(me):ur?Hl(Ce):(bo(e),go(),void fo(!0)),xo=ai("input",null,{type:"file",accept:"image/*",multiple:"true",onchange:()=>{for(let e of xo.files)vo(e)}}),yo=ai("a",Nn,{[mt]:()=>fo()},"up.b.abs-tl",_t);Fl(yo,{text:Oe,top:!0}),ondragenter=async e=>{if(e.dataTransfer&&e.dataTransfer.files){let t=(e.dataTransfer.files.length>0?e.dataTransfer.files:e.dataTransfer.items)[0];if(!t.type||"image"!=t.type.split("/")[0])return;ci(Nl,"drag")}},Nl.ondragenter=e=>{e.preventDefault()},Nl.ondragover=e=>e.preventDefault(),Nl.ondragleave=()=>{Bt(()=>si(Nl,"drag"))},Nl.ondrop=e=>{if(e.preventDefault(),si(Nl,"drag"),e.dataTransfer.files){let t=!1;for(let r of e.dataTransfer.files)r.type&&"image"==r.type.split("/")[0]?vo(r):t=!0;t&&Hl(Ae)}},ct&&it.addEventListener("paste",async()=>{let e=await window.navigator.clipboard.read(),t=0;for(let r of e){$r(r);let e=null;for(let t of r.types)if(e=t.match(/image\/(.+)$/),$r(e),e)break;if($r(e),!e)continue;let i=await r.getType(e[0]),l=new File([i],`image_${t}.${e[1]}`);vo(l),t+=1}});let _o,ko,Oo=ni(yo,"add_circle"),Io=ai("span",yo,{[gt]:0},"cnt.abs-tr",yt);l=()=>{Sr()&&!ur?si(yo,_t):ci(yo,_t)};let Ao=ai(kt,Gn,"p.p-settings",yt);ai(Ot,ai(kt,Ao,"hd"),{[gt]:Q},"h"),ni(ai("a",Ao,{[mt]:()=>_o()},"b.abs-tr"),"close");let Co=ai("a",Ao,{[mt]:()=>ko()},"b.abs-tl",yt);ni(Co,"navigate_before");let Lo=ai(kt,Ao),qo=ai(kt,Lo,"opts"),To=ai(kt,Lo,"opts",yt),zo=ai(kt,Lo,"opts",yt),Jo=ai(kt,Lo,"opts",yt),jo=qo;ko=(e=qo)=>{ci(jo,yt),si(e,yt),jo=e,e==qo?ci(Co,yt):si(Co,yt)};let Do=(e,t,r,i,l=!1,a=qo)=>{let n=l,o=ai(kt,a,"opt");n&&ci(o,"chk");let c=ai(kt,o,"label.fr");t&&ni(c,t),ai(Ot,c,{[gt]:e});return ni(ai(Ot,o,"value"),"check_small"),o.onclick=()=>zl(e,!n),Ll[e]=e=>{n=e,n?(ci(o,"chk"),r?.()):(si(o,"chk"),i?.())},Tl(e,l),o},Eo=(e,t,r,i,l,a,n)=>Do(e,t,()=>Wr(r,i),()=>Wr(r,l),a,n),So=(e,t,r="")=>{let i=ai(kt,qo,{[mt]:()=>ko(t)},"opt.r"),l=ai(kt,i,"label.fr");return r&&ni(l,r),ai(Ot,l,{[gt]:e}),ni(i,"navigate_next","abs-r"),i};So(tt,To,"block");let Ko=(e,t,r,i)=>{let l=ai("a",t,{[mt]:()=>{let t=Bl({title:e,options:[],close:!0}).content,l=ai(kt,t,"b-entry.fr"),a=()=>{oi(l);let e=r?jl():El(tr,ar),t=e[i].split("||");for(let n of t){if(""==n)continue;let t=ai(kt,l,"entry.fr");ai(Ot,t,{[gt]:'"'+n+'"'});let o=ai("a",t,{[mt]:()=>{Zl(e,i,n),r?$l(e):Yl(e,tr),a()}});ni(o,"close","sml")}};a();let n=ai(kt,t,"b-wrap.fr"),o=ai("input",n,"nowrap"),c=ai("a",n,{[mt]:()=>{if(!o.value)return;let e=r?jl():El(tr,ar);Ml(e,i,o.value),r?$l(e):Yl(e,tr),a(),o.value=""},[gt]:et},"sb");ui(o,c,!1,!0)}},"opt.r"),a=ai(kt,l,"label.fr");ai(Ot,a,{[gt]:e}),ni(l,"navigate_next","abs-r")};ai(kt,To,{[gt]:We},"opt.hr"),Ko(Fe,To,!0,"word"),Ko(Re,To,!0,"id"),Ko(Ue,To,!0,"ip"),Ko(Be,To,!0,"nick");let $o=ai(kt,To,{[gt]:Ve},"opt.hr");Ko(Fe,To,!1,"word"),Ko(Re,To,!1,"id"),Ko(Ue,To,!1,"ip"),Ko(Be,To,!1,"nick");let Yo=So(ie,zo);Er()&&ci(Yo,yt);let Mo=ai("input",null,{type:"file",accept:"image/*",multiple:"true",onchange:()=>{if(0===Mo.files.length)return;let e=bo(Mo.files[0]);wo(e),Xo||Go.click()}}),Zo=ai("a",zo,{[mt]:()=>Mo.click()},"pv.r.b.o-f");ni(Zo,"add_photo_alternate"),ai(Ot,Zo,{[gt]:Ye});let Xo=!1,Go=Do(le,null,()=>{Xo=!0,null!==so&&si(so.preview,yt)},()=>{Xo=!1,null!==so&&ci(so.preview,yt)},!1,zo),No="",Qo=ai("a",zo,{[mt]:()=>{let e=Bl({title:ae,input:No,options:[{text:y,[mt]:t=>{No=e.input.value,zl("footer",No),t()}},{text:_}]}),t=e.input;ci(t,"ft");let r=ai(Ot,null,{[gt]:"- "+p,[mt]:()=>t.focus()},"footer-static");t.insertAdjacentElement("afterend",r)}},"opt.r");ai(Ot,Qo,{[gt]:ae},"label"),ni(Qo,"navigate_next","abs-r"),Do(te,"dark_mode",()=>si(lt,"light"),()=>ci(lt,"light"),!0);let Po=Do(P,"splitscreen",()=>{hr=!0,st&&!Jl("mado")?Bl({title:y,desc:je,options:[{text:k,[mt]:e=>{va(),zl("mado",!0),e()},enter:!0},{text:_,[mt]:e=>{Po.click(),e()}}]}):va()},()=>{hr=!1,va()},!st);Er()&&ci(Po,yt),So(re,Jo);let Ro=!0;Do(F,null,()=>Ro=!0,()=>Ro=!1,!0),Do(ee,null,()=>{ci(On,yt),ci(yn,yt)},()=>{pr||(si(On,yt),si(yn,yt))}),Do(W,null,()=>pl(1),()=>pl(0));let Uo=Do(V,null,()=>ci(Vl,"co"),()=>si(Vl,"co"));Er()&&ci(Uo,yt),Do(ne,null,()=>si(Ya,"hn"),()=>ci(Ya,"hn"),!1,Jo),Do(B,null,()=>{si(Ya,"hu"),o(!0)},()=>{ci(Ya,"hu"),o(!0)},!0,Jo);Eo(qe,null,"--cc","#fc5","var(--cf)",!0,Jo);Eo(R,null,"--sb","smooth","auto",!0,Jo);let Bo="--fs";Do(U,null,()=>{Wr(Bo,"15px"),o(!0)},()=>{Wr(Bo,"13px"),o(!0)},!1,Jo);Eo(H,null,"--ds","60px","80px",!1,Jo),ai(Ot,Ao,{[gt]:"version: 2.4.6-20260323"},"version"),Ll[kl()]=e=>{or=Br(e??"").filter(e=>e),dn?.(),pn?.()},Er()&&Tl(kl(),Jl(kl())??"");let Ho=!0;_o=()=>{Ho=!Ho,Ho?(si(Vo,"f"),ci(Ao,yt)):(ci(Vo,"f"),si(Ao,yt))};let Fo=ai(kt,Gn,"fr.sc"),Wo=ai("a",Fo,{[mt]:_o},"b.gray"),Vo=ni(Wo,"settings"),ec=ai("a",Fo,"sb",_t);ai(Ot,ec,{[gt]:oe}),ui(Rn,ec,!0);let tc={},rc=async(e,t=!1)=>{if(!t&&null!=hn[e])return hn[e];let r={num:e,name:"",text:ce,write:"",esno:"",string:"",delId:"",delValue:"",vCurT:""};if(Er()){let t=await Ei(bi(e)).catch($r);if(!t)return r;let i=gl(t),l=i.querySelector(".rd_hd .btm_area .side a.member_plate, .rd_hd a.member_plate"),a=i.querySelector(".rd_body article .xe_content, .rd_body .xe_content");if(!a)return r;let n=_l(l);return r.name=n.name,r.write=a.innerHTML,r.text=yl(a.innerHTML,"pc-"+e),hn[e]=r,r}let i=await Ei(bi(e)).catch($r),l=()=>r;vr=!!new RegExp(`id="code_${e}"`).test(i);let a=_i(i,kt,"write_div");if(!a)return l();let n=_i(i,kt,"gallview_head");if(!n)return l();let o=ki(n,kt,"gall_writer");if(!o)return l();r.name=Ci(o,"data-nick"),r.write=a,r.text=yl(a,"pc-"+e);let c=Ji(i,"e_s_n_o");c&&(r.esno=c),r.string=vi(i),hn[e]=r;let s={};if(ji(i,"_cmt_del_form_",s))for(let e in s)r.delId=e,r.delValue=s[e];let d=Ji(i,"v_cur_t");d&&(r.vCurT=d);let p={cur_t:"",check_6:"",check_7:"",check_8:"",check_9:"",check_10:"",recommend:"0",user_ip:"",t_vch2:"",t_vch2_chk:"",service_code:""};return ul(i,p),p.service_code=xi(p.service_code,r.string),tc[e]=p,l()},ic=async(e,t,r)=>{let i,l=await Zi(e,gi()+"comment/",t).catch($r);if(!l)return!1;try{i=JSON.parse(l)}catch(e){return $r(e,l),!1}let a=i.total_cnt;r.count=a;let n=i.comments;if(!n||!n.length)return!1;for(let e of n){let t=Ut(e.no);if(0==t)continue;let i={num:t,id:"",ip:"",name:"",img:"",fix:!1,text:"",target:0};if(null!=r.comments[t])continue;r.comments[t]=i,i.id=e.user_id,i.ip=e.ip,i.name=e.name,i.text=sl(nl(e.memo).r(/\n/g,"<br />"));let l=e.c_no;l&&(i.target=Ut(l));let a=e.gallog_icon.match(/\<img src='([^']+)'/);if(a){let e=a[1];i.img=e,i.fix=Li(e)}}return!0},lc=async e=>{if(Er()){let t=await Ei(bi(e)).catch($r),r=gn[e],i={count:r,num:0,comments:{}};if(!t)return i;let l=gl(t).querySelectorAll('.fdb_lst_ul > li[id^="comment_"]');i.count=l.length;for(let t of l){let r=Ut((t.id??"").r("comment_",""));if(!r)continue;let l=_l(t.querySelector(".meta a.member_plate"));i.comments[r]={num:r,id:l.id,ip:"",name:l.name,img:l.img,fix:!1,text:yl(t.querySelector(".comment-content .xe_content")?.innerHTML??"","pc-"+e),target:0}}return r!=i.count&&fn[e]?.(i.count,!0),mn[e]=i,i}let{esno:t}=await rc(e).catch($r),r=gn[e],i={count:r,num:0,comments:{}};null!=mn[e]&&(i=mn[e]);let l={id:tr,no:e,cmt_id:tr,cmt_no:e,focus_cno:"",focus_pno:"",e_s_n_o:t,comment_page:1,sort:"D",prevCnt:"0",board_type:"",_GALLTYPE_:rr},a=!0;for(;a;)a=await ic(e,l,i).catch($r),l.comment_page++;return r!=i.count&&fn[e](i.count,!0),mn[e]=i,i},ac=[],nc=async(e,t=!1)=>{if(0==e.length)return;Lr?Cr&&vn({title:ue}):t=!0,e=e.sort((e,t)=>e.num-t.num);let r=0;for(let i of e)ac.includes(i.num)||(await vn(i).catch($r),i.count&&fn[i.num]?.(i.count,t)),r=Math.max(r,i.num);Or=Math.max(Or,r),jr&&jr.postMessage({type:"ln",n:Or}),Lr||(vn({title:pe}),Lr=!0,ur&&vn({title:_e})),Cr=!1},oc=()=>{let e,t,r,i,l,a,n,o,c,s,d,p,u,h,g,f,m,b;try{e=_DEBUG,t=_URL,r=_TEXT,i=_RESP,l={},a=(e,t)=>{l[e]=t,self.postMessage({type:"cc",n:e,c:t})},n=async e=>self.postMessage({type:"pd",d:e}),o=_IT,c=_IH,s=_OH,d=_AT,p=_A,u=_TF,h=_SS,g=_SN,f=Number.parseInt,m=()=>_LN,b=_SM}catch{e=$r,t=fi(),r=Ei,i=Si,l=gn,a=(e,t)=>fn[e]?.(t,Cr),n=nc,o=Ii,c=_i,s=ki,d=Ai,p=Ci,u=Li,h=de,g=se,f=Ut,m=()=>Or,b=$t}let w=e=>e.replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#035;/g,"#").replace(/&#039;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"'),v=(e="")=>w(e.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim(),x=(e="")=>{let t=e.match(/(?:document_srl=|\/)([0-9]+)(?:$|[\/?#&])/);return t&&f(t[1])||0},y=e=>{let t=e.match(/<td[^>]*class=(["'])[^"'<>]*\bcate\b[^"'<>]*\1[^>]*>(.*?)<\/td>/i);return v(t?.[2]??"")},_=e=>{let t=(e.match(/<td[^>]*class=(["'])[^"'<>]*\btitle\b[^"'<>]*\1[^>]*>(.*?)<\/td>/i)?.[2]??"").matchAll(/<a[^>]+href=(["'])([^"']+)\1[^>]*>(.*?)<\/a>/gi);for(let e of t)if(!/\breplyNum\b/.test(e[0]))return{href:e[2],title:v(e[3])};return{href:"",title:""}},k=e=>{let t=e.match(/<a[^>]*class=(["'])[^"'<>]*\breplyNum\b[^"'<>]*\1[^>]*>(.*?)<\/a>/i)??e.match(/<[^>]*class=(["'])[^"'<>]*\bcomment_count\b[^"'<>]*\1[^>]*>(.*?)<\/[^>]+>/i),r=v(t?.[2]??"").match(/[0-9]+/);return r&&f(r[0])||0},O=e=>{let t={id:"",name:"",img:"",fix:!1},r=(e.match(/<td[^>]*class=(["'])[^"'<>]*\bauthor\b[^"'<>]*\1[^>]*>(.*?)<\/td>/i)?.[2]??"").match(/<a[^>]*class=(["'])(.*?)\1[^>]*>(.*?)<\/a>/i);if(!r)return t;let i=r[2]??"",l=r[3]??"",a=i.match(/member_([0-9]+)/);a&&(t.id=a[1]),t.name=v(l);let n=l.match(/<img[^>]*src=(["'])(.*?)\1/i);return n&&(t.img=((e="")=>{if(!e)return"";if(/^https?:\/\//i.test(e))return e;if(/^\/\//.test(e))return"https:"+e;try{return new URL(e,"https://www.fmkorea.com").href}catch{return e}})(n[2]),t.fix=u(t.img)),t},I=e=>/\bnotice\b/.test(((e,t)=>{let r=e.match(new RegExp(`${t}=(["'])(.*?)\\1`,"i"));return r?r[2]:""})(e,"class")),A=/에펨코리아 보안 시스템|잠시 기다리면 사이트에 자동으로 접속됩니다|비정상적인 접근|자동으로 접속/i,C=0,L=0;return{_UL:async()=>{try{let v=[];if("fmkorea"==b){let r=Date.now();if(r<C)return;let o=await i(t),c=o.text;if(!o.ok||A.test(c)){L++;let t=o.retryAfter;if(!t){let e=429==o.status||430==o.status?60:15;t=Math.min(e*L,300)}return C=r+1e3*t,void e("fm update paused",o.status,t)}if(L=0,C=0,!c)return;c=c.replace(/(\n|\r|\t)/g,"");let s=(e,t)=>{let r=l[e.num]??0;return t&&(e.count=t),!(e.num<=m())||(t!=r&&a(e.num,t),!1)},d=c.match(/<tr\b[^>]*>.*?<\/tr>/gi)??[];for(let e of d){if(/<th\b/i.test(e)||I(e))continue;let t=_(e);if(!t.href)continue;let r=x(t.href);if(!r)continue;let i={num:r,subject:y(e),title:t.title,nickname:"",id:"",ip:"",date:0,img:"",fix:!1,count:0};if(!s(i,k(e)))continue;let l=O(e);i.nickname=l.name,i.id=l.id,i.img=l.img,i.fix=l.fix,i.subject!=g&&v.push(i)}return void await n(v)}let q=await r(t);if(!q)return;q=q.replace(/(\n|\r|\t)/g,"");let T=q.matchAll(/<tr[^>]*class="[^"]*us-post[^"]*"[^>]*data-no="([^"]*)".+?<\/tr>/g);if(!T)return;for(let e of T){let t=e[0],r={num:0,subject:"",title:"",nickname:"",id:"",ip:"",date:0,img:"",fix:!1,count:0},i=f(e[1]);r.num=i;let n=t.match(/<span[^>]*class="[^"]*reply_num[^>]*"[^>]*>\[([0-9]+)\]<\/span>/),b=l[i]??0,x=0;if(n&&(x=f(n[1]),x&&(r.count=x)),i<=m()){x!=b&&a(i,x);continue}let y=o(t,"td","gall_tit");n&&(y=y.slice(0,y.length-n[1].length-2)),r.title=w(y);let _=c(t,"td","gall_num");if(_==h||_==g||"AD"==_)continue;let k=o(t,"td","gall_subject");if(r.subject=w(k),k==h||k==g||"AD"==k)continue;let O=s(t,"td","gall_writer");if(O){d(O,"data-nick",r,"nickname"),d(O,"data-uid",r,"id"),d(O,"data-ip",r,"ip");let e=O.match(/<img[^>]*src=["']([^"']+)["']/);if(e){let t=e[1];r.img=t,r.fix=u(t)}}let I=s(t,"td","gall_date"),A=p(I,"title");null!==A&&(r.date=Date.parse(A)),v.push(r)}await n(v)}catch(t){e(t)}}}},{_UL:cc}=oc(),sc=()=>{let e=async()=>{let t,r,i,l;try{t=_UL,r=_IV,i=()=>{},l=_DEBUG}catch{r=kr,t=cc,i=e=>Jr=e,l=$r}await t().catch(e=>{l(e),postMessage({type:"err"})}),i(setTimeout(e,r))};return{_UC:e}},{_UC:dc}=sc(),pc=(...e)=>{if($r("init update",...e),Cr=!0,ot){jr&&jr.terminate();let e=new Blob([`let _URL='${fi()}';`,`let _IV=${kr};`,`let _LN=${Or};`,`let _SM='${$t}';`,`let _SS='${de}';`,`let _SN='${se}';`,`let{_IH,_OH,_IT,_AT,_A,_TF,_DEBUG}=(${yi.toString()})();`,`let{_TEXT,_RESP}=(${Di.toString()})();`,`let{_UL}=(${oc.toString()})();`,`let{_UC}=(${sc.toString()})();`,"self.onmessage=async(e)=>{switch(e.data.type){case'iv':_IV=e.data.iv;break;case'ln':_LN=e.data.n;break;}};","_UC();"],{type:"text/javascript"}),t=URL.createObjectURL(e);jr=new Worker(t),jr.onerror=(...e)=>{$r(...e),pc("error",...e)},jr.onmessage=async e=>{let t=e.data;if(t&&t.type){if("pd"==t.type)return await nc(t.d);if("cc"==t.type)return fn[t.n]?.(t.c,Cr);if("err"==t.type)return pc("worker err")}}}else Jr&&clearTimeout(Jr),dc()};if(pc(),Er()){let e=()=>{it.hidden||Ht(()=>pc("visible"),300)};it.addEventListener("visibilitychange",e),window.addEventListener("focus",e),window.addEventListener("pageshow",e)}let uc={id:"",_GALLTYPE_:"",gallery_no:0,r_key:"",upload_status:"",clickbutton:"",user_ip:"",block_key:"",tempIdx:"",headtext:"",use_headtext:"",poll:"",service_code:"",use_html:"",subject:"",adult_article_yn:"N",adult_auth_yn:"N",ci_t:void 0,mode:"W",movieIdx:"",series_title:"[]",series_data:"",headTail:'""'};dr&&(uc.fix="");let hc="",gc=(e=!0)=>{if(Er())return ur=!0,ci(Qn,yt),ci(xn,yt),ci(Kn,yt),ci(yo,yt),ci(lo,yt),void ci(ec,yt);!ur&&e&&Lr&&vn({title:_e}),ur=e,e?(Sr()&&(ci(Rn,_t),ci(yo,_t),ci(lo,_t),ci(ec,_t)),pr||ci(xn,yt)):(si(Rn,_t),si(yo,_t),si(lo,_t),si(ec,_t),pr||si(xn,yt))};kn=async()=>{if(Er())return gc();let e=await Ei(mi()).catch($r);if(!/id="write"/.test(e))return gc();if(gc(!1),ul(e,uc),Pr=vi(e),wr=/id="code"/.test(e),dr){uc.headtext=0;let t=Ji(e,pr?"nickname":"name");zr=t||""}Jn(),zn(),o(!0)};let fc=e=>"false||"+e,mc=(e,t,r)=>`<img class="written_dccon" src="${e}" conalt="${t}" alt="${t}" con_alt="${t}" title="${t}" detail="${r}">`,bc=0,wc=async(e,t=!0)=>{let r=`<p><a href="${e}" target="_blank">${e}</a></p>`,i=await Yi(Mt+"api/ogp",{url:e});if(!i)return r;let l=JSON.parse(i);if(!l.result)return r;let a=`{{_OG_START::${e}^#^${l.og_title}^#^${l.og_description}^#^${l.og_image}::OG_END_}}`;return t&&(a=`<p><span class="og-url" style="color:#3b4890">${e}</span></p><p></p>`+a),a},vc=async(e,t)=>{uc.subject=Ft(e);let r={};if(!pr){let e=jn(),t=En();if(0==e.length)return fc(g);if(t.length<2)return fc(f);r.name=e,r.password=t}if(wr){let e=Sn();if(0==e.length)return fc(m);r.kcaptcha_code=e}let i=Vt(),l=i-bc;if(l<2e3){let e=2e3-l;bc=i+e,await(e=>{let{r:t,p:r}=Yr();return Ht(t,e),r})(e)}else bc=i;if(hc=await Yi("/block/block/",uc,r).catch($r),!hc)return fc(ge);uc.service_code=xi(uc.service_code);let a={block_key:hc,memo:"",code:wr?Sn():void 0,bgm:"0"},n="";0!==uo.length|(Xo&&null!==so&&!po)&&(n+=h),Xo&&null!==so&&!po&&(n+=`<img src="${so.url}"/>`+h);for(let e=0;e<uo.length;e++){let t=uo[e];if(!t.upload)return fc(ve);n+=`<img src="${t.url}" class="txc-image "/>`+h,a["file_write["+e+"][file_no]"]=t.num}let o="";if(Ro&&ba.length)for(let e=0;e<ba.length;e++){let t,r,i=ba[e],l=i.match(Dt),a=i.match(Jt);if(l){if(t=l[2],r="https://youtu.be/"+t,0==e){o+=`<p><span class="og-url" style="color:#3b4890" <div=""></span></p><div class="yt_movie"><embed src="https://www.youtube.com/v/${t}?version=3" type="application/x-shockwave-flash" width="560" height="315" allowfullscreen="true"></div><a class="yt_link" href="${r}" target="_blank">${r}</a></div>`,o+=await wc(r,!1);continue}}else a?(t=a[2],r="https://www.twitch.tv/"+t):r=i;o+=await wc(r)}o&&(o+=h);let c="";for(let t of e.matchAll(Tt)){let e=t[1],r=t[2],i=Vi(e,r);if(!i)continue;let l=Wi(e,r);l&&(l.buy&&(c+=mc(i,r,l.idx)))}c&&(c+=h);for(let e of t.matchAll(Tt)){let r=e[0],i=e[1],l=e[2],a=Vi(i,l);if(!a)continue;let n=Wi(i,l);n&&(n.buy&&(t=t.r(r,mc(a,l,n.idx))))}return a.memo=Ft(n+o+h+c+t),await ti(Yi,[Gt,uc,r],a,"comment_submit")};ec.onclick=async()=>{if(!Rn.value)return;let e=Rn.value??"";if(Rn.value="",Rn.oninput(),0==xr){let{r:t,p:r}=Yr();if(0!==uo.length){let e=!1,i=!1;for(let t of uo)t.upload||(e=!0),t.error&&(i=!0);if(i){if(Bl({title:xe,desc:ye,options:[{text:k,[mt]:e=>{t(!0),e()},enter:!0},{text:_,[mt]:e=>{t(!1),e()}}]}),!await r.catch($r))return}else if(e)return Hl(ve)}let i=e.split("\n");e=i[0];let l=h;for(let e=1;e<i.length;e++)l+=`<p>${i[e]}</p>`;if(""!==No){i=No.split("\n");for(let e of i)l+=`<p style="color:#ABABAB;">${e}</p>`}l+=`<p style="color:#ABABAB;">- ${p} ${Ur(20)}</p>`,(e=>{Ht(kn,500);let t=Br(e);if(1==t.length)return $r(e),Hl(he);if("false"==t[0])return Hl(t[1]),$r(e);let r=Ut(t[1].trim());ac.push(r),vn({num:r,nickname:Dn(),id:pr?fr:"",ip:pr?"":Fr(uc.user_ip),title:uc.subject,img:mr,fix:br,my:!0}),po=!1;for(let e=0;e<uo.length;e++)uo[e].close();uo.length=0,fo(!1)})(await vc(e,l).catch($r))}else _r=Ur(8),((e,t)=>{Ht(Jn,500);let r=Br(e);r.length<2?($r(e),Hl(he)):"false"==r[0]?($r(e),Hl(r[1])):(a(0),fn[t](-1,!0))})(await(async(e,t,r=0)=>{let i=tc[e];if(!i)return 0;let l={};if(r&&(l.c_no=r),pr)l.name=gr;else{if(zr)l.nickname=zr;else{let e=jn();if(0==e.length)return fc(g);l.name=e}let e=En();if(e.length<2)return fc(f);l.password=e}if(vr){let e=Sn();if(0==e.length)return fc(m);l.code=e}l.memo=Ft(t);let a={id:tr,no:e,c_gall_id:tr,c_gall_no:e,[It]:"",_GALLTYPE_:rr,headTail:'""'},n=await ti(Zi,[e,Nt,i,l],a,"comment_submit");try{let e=Ut(n);if(e)return"true||"+e}catch{$r(n)}return n})(xr,e+_r,yr).catch($r),xr);st&&Rn.focus()},(()=>{let e=nt?.getItem(bt)??"";if(e){Cl=JSON.parse(e);for(let e in Cl)Tl(e,Cl[e])}})(),Er()&&ci(Vl,"co"),0!==ba.length&&aa(!1);{let e=e=>{let t=e.split(".");return t[0]+"."+t[1]};if(e(Jl("version")??"")!==e("2.4.6-20260323")){let e=Bl({title:Me+": 2.4.6-20260323",desc:rt+'<a href="https://joh1ah.github.io/dclivechat/change.log" target="_blank">'+Ze+"</a>",html:!0});Wl(e.content,[{text:Ge,icon:"delete"},{hr:!0},{text:A,icon:"open_in_new"},{text:Pe},{hr:!0},{text:Re},{text:Be}]);let t=e.content.oncontextmenu({preventDefault:()=>{},clientX:0,clientY:0});Ul=null,(xc=t).parentNode.removeChild(xc),e.content.appendChild(t),t.style.position="relative",t.style.marginTop="1em"}}var xc;zl("version","2.4.6-20260323"),(()=>{let e=Jl("zzal");if(null!==e&&""!==e)try{let t=(e=>{let{p:t,i:r}=mo(oo,e);ci(t,"up"),r.src=e.src;let i={preview:t,img:r,original:e.name,name:e.name,size:e.size,type:e.type,upload:!0,file:null,error:!1,num:null,url:e.url,close:()=>{t.remove();for(let t=0;t<uo.length;t++){let r=uo[t];if(e===r){uo.splice(t,1);break}}go()}},l=ai("a",t,"close.abs-tr.b");return ni(l,"delete","f"),l.onclick=()=>i.close(),i})(JSON.parse(e));wo(t)}catch{wo(null)}})(),No=Jl("footer")??"",Bt(()=>si(lt,yt)),$r("INIT done")})().catch(e=>console.log(e));