(() => {
    let mobileBuildVersion = '3.0.0-20260324-mobile1';
    let isFm = /(?:^|\.)fmkorea\.(?:com|net|co\.kr)$/i.test(location.hostname);
    let layoutObserverStarted = false;
    let styleText = `
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
    max-width: 100vw !important;
    max-width: 100svw !important;
}

main > .chat > .hd {
    display: flex !important;
    visibility: visible !important;
}

main > .chat > .vp {
    width: 100% !important;
}

main > .chat > .vp > .page {
    width: 100%;
    max-width: none !important;
    margin: 0 !important;
    padding: 10px 0 calc(24px + env(safe-area-inset-bottom));
    align-items: stretch;
    box-sizing: border-box;
}

main > .chat > .li-c,
main > .chat > .ri-c,
main > .chat > .ci-c,
main > .chat > .cb-c {
    display: none !important;
    visibility: collapse !important;
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
    align-items: flex-start !important;
}

main > .chat .chl > .tt {
    display: flex !important;
    width: 100%;
    padding: 9px 10px;
    box-sizing: border-box;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main > .chat .chl > .tt > span {
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

main > .chat .chl > .tt > span .name,
main > .chat .chl > .tt > span .ip,
main > .chat .chl > .tt > span .sg,
main > .chat .chl > .tt > span .cm {
    flex: 0 0 auto;
    white-space: nowrap !important;
    align-self: baseline !important;
}

main > .chat .chl > .tt > span .tt {
    display: block !important;
    flex: 1 1 0;
    min-width: 0;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    word-break: keep-all !important;
    overflow-wrap: normal !important;
    align-self: baseline !important;
}

main > .chat .chl > .tt > span > img.nikcon {
    flex: 0 0 auto;
    align-self: baseline !important;
}

main > .chat .chl > .tt > span * {
    text-align: left !important;
}

main > .chat .cml,
main > .chat .cml > .vp,
main > .chat .cml > .vp > .page,
main > .chat .cml > .vp > .page > .text {
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    text-align: left !important;
}

main > .chat .cml .text {
    width: 100% !important;
}

main > .chat .chl > .tt > span .name,
main > .chat .chl > .tt > span .tt {
    font-size: 15px !important;
    line-height: 1.55 !important;
}

main > .chat .chl > .tt > span .ip,
main > .chat .chl > .tt > span .sg,
main > .chat .chl > .tt > span .cm {
    font-size: 11px !important;
    line-height: 1.45 !important;
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
    font-size: 14px;
    letter-spacing: .03em;
}

main.co > .chat.fm > .fm-tabs {
    display: flex !important;
    padding: 10px 10px 8px;
    max-height: min(20svh, 160px);
    overflow-y: auto;
    overscroll-behavior: contain;
    background: rgba(16, 16, 18, .94);
    backdrop-filter: blur(12px);
}

main.co > .chat.fm > .fm-tabs .fm-tabs-wrap {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
    max-width: none !important;
    margin: 0 !important;
    gap: 8px;
}

main.co > .chat.fm > .fm-tabs .fm-tab {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: center !important;
    min-height: 34px;
    padding: 6px 11px;
    font-size: 13px;
}

main.co > .chat.fm > .fm-tabs .fm-tab-box {
    width: 14px;
    height: 14px;
    margin-top: 0;
}

main.co > .chat.fm > .fm-tabs .fm-tab-label {
    white-space: nowrap !important;
}

html[data-dclivechat-compact-device="1"] main > .chat .chl,
html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt,
html[data-dclivechat-compact-device="1"] main > .chat .cml {
    width: calc(100% - 8px) !important;
}

html[data-dclivechat-compact-device="1"] main > .chat .chl {
    padding: 0 4px !important;
}

html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt {
    padding: 8px 9px !important;
}

html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt > span .name,
html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt > span .tt {
    font-size: 16px !important;
    line-height: 1.6 !important;
}

html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt > span .ip,
html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt > span .sg,
html[data-dclivechat-compact-device="1"] main > .chat .chl > .tt > span .cm {
    font-size: 12px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .hd .h {
    font-size: 15px !important;
}

html[data-dclivechat-compact-device="1"] main.co > .chat.fm > .fm-tabs .fm-tab {
    font-size: 14px !important;
}
`;

    let setImportantStyle = (node, name, value) => {
        if (!node?.style) return;
        node.style.setProperty(name, value, 'important');
    };

    let injectStyle = () => {
        if (document.getElementById('dclivechat-mobile-reborn-style')) return;
        let root = document.head || document.documentElement || document.body;
        if (!root) return;
        let style = document.createElement('style');
        style.id = 'dclivechat-mobile-reborn-style';
        style.textContent = styleText;
        root.appendChild(style);
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

    let ensureClipboardObject = () => {
        if (navigator.clipboard) return;
        try {
            Object.defineProperty(navigator, 'clipboard', {
                value: {},
                configurable: true,
            });
        } catch {}
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

    let applyLineLayout = (line) => {
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
            if (!(item instanceof HTMLElement)) continue;
            if (item.classList.contains('tt')) {
                setImportantStyle(item, 'display', 'block');
                setImportantStyle(item, 'flex', '1 1 0');
                setImportantStyle(item, 'min-width', '0');
                setImportantStyle(item, 'white-space', 'nowrap');
                setImportantStyle(item, 'overflow', 'hidden');
                setImportantStyle(item, 'text-overflow', 'ellipsis');
                setImportantStyle(item, 'word-break', 'keep-all');
                setImportantStyle(item, 'overflow-wrap', 'normal');
            } else {
                setImportantStyle(item, 'flex', '0 0 auto');
                setImportantStyle(item, 'white-space', 'nowrap');
            }
            setImportantStyle(item, 'align-self', 'baseline');
            setImportantStyle(item, 'text-align', 'left');
        }
    };

    let applyMobileLayout = () => {
        let main = document.body?.querySelector(':scope > main') ?? document.querySelector('body > main');
        if (!main) return;
        let chat = main.querySelector(':scope > .chat');
        if (!chat) return;

        document.documentElement.dataset.dclivechatMobileBuild = mobileBuildVersion;
        main.classList.add('co');

        let video = main.querySelector(':scope > .video');
        if (video) {
            setImportantStyle(video, 'display', 'none');
            setImportantStyle(video, 'visibility', 'collapse');
        }

        hideChatControls(chat);
        widenChatPage(chat);

        for (let line of chat.querySelectorAll('.chl')) applyLineLayout(line);
    };

    let queueLayout = (() => {
        let queued = false;
        return () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                applyMobileLayout();
            });
        };
    })();

    let observeLayout = () => {
        if (layoutObserverStarted) {
            queueLayout();
            return;
        }
        layoutObserverStarted = true;
        queueLayout();
        let observer = new MutationObserver(() => queueLayout());
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    };

    let start = () => {
        ensureClipboardObject();
        updateCompactDeviceFlag();
        injectStyle();
        observeLayout();
    };

    start();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    }
    window.addEventListener('resize', updateCompactDeviceFlag);
    window.addEventListener('orientationchange', updateCompactDeviceFlag);
    window.visualViewport?.addEventListener?.('resize', updateCompactDeviceFlag);
})();
