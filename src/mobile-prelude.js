(() => {
    let ua = navigator.userAgent || '';
    let isAndroid = /Android/i.test(ua);

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
})();
