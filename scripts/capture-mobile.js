#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
    const [, , url, outputPathArg] = process.argv;

    if (!url) {
        console.error('사용법: node scripts/capture-mobile.js <주소> [저장경로]');
        process.exit(1);
    }

    const repoRoot = path.resolve(__dirname, '..');
    const outputPath = outputPathArg
        ? path.resolve(process.cwd(), outputPathArg)
        : path.join(repoRoot, 'output', 'playwright', 'result.png');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const browser = await chromium.launch({ headless: true });

    try {
        const context = await browser.newContext({
            viewport: { width: 320, height: 800 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            userAgent:
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        });

        const page = await context.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.evaluate(() => {
            let meta = document.querySelector('meta[name="viewport"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'viewport';
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', 'width=device-width, initial-scale=1');
        });

        await page.addStyleTag({
            content: `
                html {
                    text-size-adjust: 175% !important;
                    -webkit-text-size-adjust: 175% !important;
                }

                body {
                    zoom: 1.28 !important;
                }
            `,
        });

        await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('body *'));

            for (const element of elements) {
                const hasText = Array.from(element.childNodes).some(
                    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
                );
                if (!hasText) continue;

                const style = window.getComputedStyle(element);
                const size = parseFloat(style.fontSize || '0');

                if (!Number.isNaN(size) && size > 0 && size < 16) {
                    element.style.setProperty('font-size', '18px', 'important');
                    element.style.setProperty('line-height', '1.48', 'important');
                }
            }
        });

        await page.waitForTimeout(500);

        await page.screenshot({
            path: outputPath,
            fullPage: true,
        });

        await context.close();
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
