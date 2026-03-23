(() => {
    let ua = navigator.userAgent || '';
    let isAndroid = /Android/i.test(ua);
    let isFm = /(?:^|\.)fmkorea\.(?:com|net|co\.kr)$/i.test(location.hostname);
    let fmBlockedPattern = /에펨코리아 보안 시스템|잠시 기다리면 사이트에 자동으로 접속됩니다|비정상적인 접근|자동으로 접속/i;
    let mobileBuildVersion = '2.4.13-20260323-mobile1';
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
main.co > .chat.fm .chl > .tt > span .ip,
main.co > .chat.fm .chl > .tt > span .sg,
main.co > .chat.fm .chl > .tt > span .tt {
    line-height: 1.5 !important;
}

main > .chat.fm > .li-c,
main > .chat.fm > .ri-c,
main > .chat.fm > .ci-c,
main > .chat.fm > .cb-c {
    display: none !important;
    visibility: collapse !important;
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
        font-size: 13px;
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
        injectStyle();
        observeMobileLayout();
    };

    startMobilePrelude();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMobilePrelude, { once: true });
    }
})();
