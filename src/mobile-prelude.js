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

main.co > .chat.fm {
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
    min-height: 36px;
    padding: 7px 12px;
    font-size: 13px;
}

main.co > .chat.fm > .fm-tabs .fm-tab-box {
    width: 16px;
    height: 16px;
    margin-top: 0;
}

main.co > .chat.fm > .vp > .page {
    width: 100%;
    max-width: 100%;
    padding: 10px 0 calc(24px + env(safe-area-inset-bottom));
    align-items: stretch;
    box-sizing: border-box;
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
    padding: 9px 10px;
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
}

main.co > .chat.fm .chl > .tt > span .tt {
    flex: 1 1 auto;
    min-width: 0;
}

main.co > .chat.fm .chl > .tt > span .sg {
    flex: 0 0 auto;
}

main.co > .chat.fm > .ci-c {
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 10px calc(12px + env(safe-area-inset-bottom));
    box-sizing: border-box;
}

main.co > .chat.fm > .ci-c > .sc {
    margin-left: auto;
}

main.co > .chat.fm > .ci-c .b.gray {
    margin: 0;
    min-width: 44px;
    min-height: 44px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .34);
}

main.co > .chat.fm > .cb-c > a {
    min-width: 40px;
    min-height: 40px;
    border-radius: 999px;
}

main.co > .chat.fm > .cb-c > .pd,
main.co > .chat.fm > .cb-c > .right {
    bottom: calc(10px + env(safe-area-inset-bottom));
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
        min-height: 32px;
        padding: 6px 10px;
        font-size: 12px;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab-box {
        width: 14px;
        height: 14px;
    }

    main.co > .chat.fm > .vp > .page {
        padding-bottom: calc(18px + env(safe-area-inset-bottom));
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

    main.co > .chat.fm .chl > .tt > span {
        gap: 6px;
    }

    main.co > .chat.fm .chl > .tt > span .name,
    main.co > .chat.fm .chl > .tt > span .tt {
        font-size: 14px;
    }

    main.co > .chat.fm .chl > .tt > span .sg {
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
    main.co > .chat.fm > .vp > .page {
        max-width: 860px;
        margin: 0 auto;
    }

    main.co > .chat.fm > .fm-tabs .fm-tab {
        min-height: 38px;
        padding: 8px 14px;
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
        padding: 10px 12px;
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
            finish(createHtmlResponse(document.documentElement?.outerHTML ?? '', 200));
        }, 15000);

        frame.onload = () => {
            try {
                let html = frame.contentDocument?.documentElement?.outerHTML ?? '';
                if (!html) html = document.documentElement?.outerHTML ?? '';
                finish(createHtmlResponse(html, 200));
            } catch {
                finish(createHtmlResponse(document.documentElement?.outerHTML ?? '', 200));
            }
        };
        frame.onerror = () => {
            finish(createHtmlResponse(document.documentElement?.outerHTML ?? '', 502));
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
                if (response.ok && text && !fmBlockedPattern.test(text)) return response;
            } catch {}

            return loadHtmlByFrame(resolvedUrl);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(injectStyle, 0), { once: true });
    } else {
        setTimeout(injectStyle, 0);
    }
})();
