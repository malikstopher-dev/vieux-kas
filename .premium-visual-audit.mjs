import {chromium} from "@playwright/test";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:4330";
const outputRoot = path.resolve("verification/premium-heroes");
const routes = [
  {name: "home-en", path: "/en", asset: "02-home-industrial-operations"},
  {name: "company-en", path: "/en/about", asset: "03-company-executive-overview", mobileAsset: "03-company-site-oversight"},
  {name: "products-en", path: "/en/products", asset: "05-products-rigging-supplies"},
  {name: "procurement-en", path: "/en/procurement", asset: "07-procurement-global-logistics"},
  {name: "industries-en", path: "/en/industries", asset: "09-industries-operations"},
  {name: "rfq-en", path: "/en/rfq", asset: "08-procurement-sourcing-logistics"},
  {name: "contact-en", path: "/en/contact", asset: "10-contact-executive-office"},
  {name: "home-fr", path: "/fr", asset: "02-home-industrial-operations"},
  {name: "company-fr", path: "/fr/a-propos", asset: "03-company-executive-overview", mobileAsset: "03-company-site-oversight"},
  {name: "products-fr", path: "/fr/produits", asset: "05-products-rigging-supplies"},
  {name: "procurement-fr", path: "/fr/approvisionnement", asset: "07-procurement-global-logistics"},
  {name: "industries-fr", path: "/fr/secteurs", asset: "09-industries-operations"},
  {name: "rfq-fr", path: "/fr/devis", asset: "08-procurement-sourcing-logistics"},
  {name: "contact-fr", path: "/fr/contact", asset: "10-contact-executive-office"},
];
const configuredViewports = [
  {name: "desktop-1440", width: 1440, height: 1000},
  {name: "laptop-1366", width: 1366, height: 900},
  {name: "tablet-820", width: 820, height: 1180},
  {name: "mobile-390", width: 390, height: 844},
  {name: "mobile-427", width: 427, height: 952},
];
const viewports = process.env.AUDIT_VIEWPORT
  ? configuredViewports.filter(({name}) => name === process.env.AUDIT_VIEWPORT)
  : configuredViewports;
const errors = [];
const captures = [];

await mkdir(outputRoot, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage();

for (const viewport of viewports) {
  await page.setViewportSize({width: viewport.width, height: viewport.height});
  const sheetCaptures = [];
  for (const route of routes) {
    const badResponses = [];
    const responseListener = (response) => {if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);};
    page.on("response", responseListener);
    const response = await page.goto(`${baseUrl}${route.path}`, {waitUntil: "domcontentloaded", timeout: 60_000});
    await page.locator(".premium-hero-title").waitFor({state: "visible"});
    await page.evaluate(async () => {
      await document.fonts.ready;
      const image = document.querySelector(".premium-hero-media img");
      if (image instanceof HTMLImageElement && !image.complete) await image.decode();
    });
    await page.waitForTimeout(180);
    page.off("response", responseListener);

    const details = await page.evaluate(() => {
      const hero = document.querySelector(".premium-hero");
      const title = document.querySelector(".premium-hero-title");
      const image = document.querySelector(".premium-hero-media img");
      const canonical = document.head.querySelectorAll('link[rel="canonical"]');
      const alternates = document.head.querySelectorAll('link[rel="alternate"][hreflang]');
      const titleBox = title?.getBoundingClientRect();
      const heroBox = hero?.getBoundingClientRect();
      return {
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        heroHeight: heroBox?.height ?? 0,
        titleLeft: titleBox?.left ?? -1,
        titleRight: titleBox?.right ?? Number.MAX_SAFE_INTEGER,
        titleTop: titleBox?.top ?? -1,
        currentSrc: image instanceof HTMLImageElement ? image.currentSrc : "",
        naturalWidth: image instanceof HTMLImageElement ? image.naturalWidth : 0,
        canonicalCount: canonical.length,
        canonicalHref: canonical[0]?.getAttribute("href") ?? "",
        alternateCount: alternates.length,
      };
    });

    const expectedAsset = viewport.width <= 767 ? route.mobileAsset ?? route.asset : route.asset;
    const expectedSuffix = viewport.width <= 767 ? `${expectedAsset}-mobile.webp` : `${expectedAsset}-hero.webp`;
    if (response?.status() !== 200) errors.push(`${viewport.name} ${route.path}: HTTP ${response?.status()}`);
    if (badResponses.length) errors.push(`${viewport.name} ${route.path}: ${badResponses.join(", ")}`);
    if (details.horizontalOverflow > 1) errors.push(`${viewport.name} ${route.path}: ${details.horizontalOverflow}px horizontal overflow`);
    if (details.titleLeft < 0 || details.titleRight > viewport.width + 1 || details.titleTop < 0) errors.push(`${viewport.name} ${route.path}: title outside viewport`);
    if (!decodeURI(details.currentSrc).endsWith(expectedSuffix)) errors.push(`${viewport.name} ${route.path}: wrong art ${details.currentSrc}`);
    if (!details.naturalWidth) errors.push(`${viewport.name} ${route.path}: hero image did not load`);
    if (details.heroHeight < (viewport.width <= 767 ? 540 : 500)) errors.push(`${viewport.name} ${route.path}: hero too short (${details.heroHeight}px)`);
    if (details.canonicalCount !== 1 || details.canonicalHref !== `https://ak-globaltrading.com${route.path}` || details.alternateCount !== 3) errors.push(`${viewport.name} ${route.path}: SEO head regression`);

    const capturePath = path.join(outputRoot, `${route.name}-${viewport.name}.png`);
    await page.screenshot({path: capturePath});
    captures.push(capturePath);
    sheetCaptures.push({label: route.name, capturePath});
  }

  const columns = viewport.width <= 427 ? 4 : 2;
  const cards = await Promise.all(sheetCaptures.map(async ({label, capturePath}) => ({
    label,
    source: `data:image/png;base64,${(await readFile(capturePath)).toString("base64")}`,
  })));
  const sheet = await browser.newPage({viewport: {width: 1600, height: 900}});
  await sheet.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#111318;color:white;font:600 14px Arial}.grid{display:grid;grid-template-columns:repeat(${columns},1fr);gap:18px}.card{background:#25282e;padding:8px}.card p{margin:0 0 7px;letter-spacing:.08em;text-transform:uppercase}.card img{display:block;width:100%;aspect-ratio:${viewport.width}/${viewport.height};object-fit:cover;object-position:top}</style><div class="grid">${cards.map(({label, source}) => `<div class="card"><p>${label}</p><img src="${source}"></div>`).join("")}</div>`);
  await sheet.screenshot({path: path.join(outputRoot, `contact-sheet-${viewport.name}.png`), fullPage: true});
  await sheet.close();
  console.log(`captured ${viewport.name}`);
}

if (process.env.AUDIT_EXTRAS === "1") {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(`${baseUrl}/en/products`, {waitUntil: "domcontentloaded"});
  await page.locator(".menu-trigger").click();
  await page.locator(".mobile-drawer.open").waitFor({state: "visible"});
  const drawerState = await page.evaluate(() => ({
    focusedInside: document.querySelector(".mobile-drawer")?.contains(document.activeElement) ?? false,
    bodyLocked: document.body.style.overflow === "hidden",
    productsCurrent: document.querySelector('.mobile-drawer a[href="/en/products"]')?.getAttribute("aria-current"),
  }));
  if (!drawerState.focusedInside || !drawerState.bodyLocked || drawerState.productsCurrent !== "page") errors.push("mobile drawer state or focus failed");
  await page.screenshot({path: path.join(outputRoot, "mobile-navigation-open-390.png")});
  await page.keyboard.press("Escape");
  await page.locator(".mobile-drawer").waitFor({state: "hidden"});
  const drawerClosed = await page.evaluate(() => ({focusReturned: document.activeElement?.classList.contains("menu-trigger"), bodyUnlocked: document.body.style.overflow !== "hidden"}));
  if (!drawerClosed.focusReturned || !drawerClosed.bodyUnlocked) errors.push("mobile drawer Escape cleanup failed");

  await page.setViewportSize({width: 1440, height: 900});
  await page.goto(`${baseUrl}/en/products/fasteners`, {waitUntil: "domcontentloaded"});
  if (await page.locator('.desktop-nav a[href="/en/products"]').getAttribute("aria-current") !== "page") errors.push("product-detail parent navigation is not active");
  await page.locator('.locale-switch a[lang="fr"]').click();
  await page.waitForURL(/\/fr\/produits\/fixations-boulonnerie$/);
  await page.goto(`${baseUrl}/en`, {waitUntil: "domcontentloaded"});
  const initialHeaderHeight = await page.locator(".site-header").evaluate((header) => header.getBoundingClientRect().height);
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.locator(".site-header.scrolled").waitFor();
  await page.waitForTimeout(350);
  const compactHeaderHeight = await page.locator(".site-header").evaluate((header) => header.getBoundingClientRect().height);
  if (initialHeaderHeight <= compactHeaderHeight || compactHeaderHeight > 73) errors.push("desktop compact header failed");

  for (const viewport of [{name: "desktop", width: 1440, height: 1000}, {name: "mobile", width: 390, height: 844}]) {
    await page.setViewportSize({width: viewport.width, height: viewport.height});
    for (const route of routes.filter(({name}) => /^(home|company|products)-(en|fr)$/.test(name))) {
      await page.goto(`${baseUrl}${route.path}`, {waitUntil: "domcontentloaded"});
      await page.evaluate(async () => {await document.fonts.ready;});
      await page.screenshot({path: path.join(outputRoot, `full-${route.name}-${viewport.name}.png`), fullPage: true});
    }
  }
}

const report = {baseUrl, checkedRoutes: routes.map(({path: routePath}) => routePath), viewports, captures: captures.length, errors};
const reportName = process.env.AUDIT_VIEWPORT ? `audit-report-${process.env.AUDIT_VIEWPORT}.json` : "audit-report.json";
await writeFile(path.join(outputRoot, reportName), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
