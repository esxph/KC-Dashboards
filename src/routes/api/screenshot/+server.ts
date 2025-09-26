import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const payload = await request.json().catch(() => ({} as any));
    let targetUrl: string = payload?.url || url.origin;
    const type: 'png' | 'jpeg' | 'pdf' = payload?.type || 'png';
    const fullPage: boolean = payload?.fullPage ?? true;
    const scale = Math.min(Math.max(Number(payload?.scale ?? 2), 1), 3);

    // Lazy import to avoid bundling issues when Playwright isn't present
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { chromium } = await import('playwright');

    // Dev helpers: handle localhost certs and ipv6 oddities
    const normalizeDev = (u: string) => {
      try {
        const p = new URL(u);
        if (p.protocol === 'https:' && p.hostname === 'localhost') p.protocol = 'http:';
        if (p.hostname === 'localhost') p.hostname = '127.0.0.1';
        return p.toString();
      } catch {
        return u;
      }
    };
    targetUrl = normalizeDev(targetUrl);

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });
    const context = await browser.newContext({ ignoreHTTPSErrors: true, deviceScaleFactor: scale });

    // Forward session cookies from the incoming request so pages behind auth render
    const rawCookie = request.headers.get('cookie') || '';
    if (rawCookie && targetUrl) {
      const u = new URL(targetUrl);
      const cookiePairs = rawCookie.split(/;\s*/).filter(Boolean);
      const cookies = cookiePairs.map((pair) => {
        const eq = pair.indexOf('=');
        const name = eq >= 0 ? pair.slice(0, eq).trim() : pair.trim();
        const value = eq >= 0 ? pair.slice(eq + 1) : '';
        return {
          name,
          value,
          domain: u.hostname,
          path: '/',
          httpOnly: true,
          secure: u.protocol === 'https:',
          sameSite: 'Lax' as const
        };
      });
      if (cookies.length) await context.addCookies(cookies);
    }
    const page = await context.newPage();
    // Try networkidle first; if dev server keeps connections (HMR), fall back to 'load'
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 25000 });
    } catch {
      await page.goto(targetUrl, { waitUntil: 'load', timeout: 25000 });
    }

    // Hide sidebar/topbar and capture entire content page (no cropping)
    await page.addStyleTag({ content: `[data-slot="sidebar"], header{display:none!important} body{overflow:visible!important}` });
    const main = page.locator('main[data-slot="sidebar-inset"]');
    await main.waitFor({ state: 'visible', timeout: 20000 });

    let data: Buffer;
    let contentType = 'image/png';
    let filename = 'screenshot.png';

    if (type === 'pdf') {
      // Take a full-page PNG first
      const pngBuffer = (await page.screenshot({ type: 'png', fullPage: true })) as Buffer;
      // Embed PNG in a single-page PDF sized to the image
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const img = await pdfDoc.embedPng(pngBuffer);
      const w = img.width;
      const h = img.height;
      const pdfPage = pdfDoc.addPage([w, h]);
      pdfPage.drawImage(img, { x: 0, y: 0, width: w, height: h });
      data = await pdfDoc.save();
      contentType = 'application/pdf';
      filename = 'screenshot.pdf';
    } else {
      // Full page screenshot at higher scale
      data = (await page.screenshot({ type, fullPage: true })) as Buffer;
      contentType = type === 'jpeg' ? 'image/jpeg' : 'image/png';
      filename = `screenshot.${type}`;
    }

    await context.close();
    await browser.close();

    return new Response(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: any) {
    const message = err?.message || 'Failed to generate screenshot. Is Playwright installed?';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
