import {expect, test, type Page} from "@playwright/test";

const routes = [
  "/en", "/en/about", "/en/products", "/en/products/lifting-equipment", "/en/products/fasteners", "/en/products/industrial-hardware", "/en/procurement", "/en/industries", "/en/rfq", "/en/contact",
  "/fr", "/fr/a-propos", "/fr/produits", "/fr/produits/equipements-de-levage", "/fr/produits/fixations-boulonnerie", "/fr/produits/fournitures-industrielles", "/fr/approvisionnement", "/fr/secteurs", "/fr/devis", "/fr/contact",
];

async function gotoStable(page: Page, path: string) {
  const response = await page.goto(path, {waitUntil: "networkidle"});
  expect(response?.status(), path).toBe(200);
  await page.waitForTimeout(250);
}

async function assertNoHorizontalScroll(page: Page, label: string) {
  const dimensions = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
  expect(dimensions.scroll, `${label}: horizontal overflow`).toBeLessThanOrEqual(dimensions.client + 1);
}

async function preloadLazyImages(page: Page) {
  const viewport = page.viewportSize()?.height ?? 800;
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let position = 0; position < height; position += Math.round(viewport * 0.7)) {
    await page.evaluate((top) => window.scrollTo(0, top), position);
    await page.waitForTimeout(80);
  }
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

test("all localized routes render without browser or network errors", async ({page}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const badResponses: string[] = [];
  page.on("console", (message) => {if (message.type() === "error") consoleErrors.push(message.text());});
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);});

  for (const route of routes) {
    await gotoStable(page, route);
    await expect(page.locator("html")).toHaveAttribute("lang", route.startsWith("/fr") ? "fr-CD" : "en-ZA");
    await expect(page.locator("h1")).toBeVisible();
    await assertNoHorizontalScroll(page, route);
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(badResponses).toEqual([]);
});

test("root locale selection and context-preserving switch work", async ({browser}) => {
  const context = await browser.newContext({locale: "fr-FR", extraHTTPHeaders: {"Accept-Language": "fr-FR,fr;q=0.9"}});
  const page = await context.newPage();
  await page.goto("/", {waitUntil: "networkidle"});
  await expect(page).toHaveURL(/\/fr$/);
  await gotoStable(page, "/en/products/fasteners");
  await page.locator('.locale-switch a[lang="fr"]').click();
  await expect(page).toHaveURL(/\/fr\/produits\/fixations-boulonnerie$/);
  await expect(page.locator("h1")).toContainText("Fixations");
  await context.close();
});

test("hero motion and transparent navigation effects are applied", async ({page}) => {
  await gotoStable(page, "/en");
  const headerStyles = await page.locator(".site-header").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {background: styles.backgroundColor, backdrop: styles.backdropFilter};
  });
  const heroStyles = await page.locator(".hero-visual img").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {name: styles.animationName, duration: styles.animationDuration, iterations: styles.animationIterationCount};
  });

  expect(headerStyles.background).toContain("0.76");
  expect(headerStyles.backdrop).toContain("blur(20px)");
  expect(heroStyles).toEqual({name: "hero-breathe", duration: "16s", iterations: "infinite"});
});

test("mobile layouts are overflow-free at every required width", async ({page}) => {
  for (const width of [320, 360, 375, 390, 412, 430]) {
    await page.setViewportSize({width, height: 844});
    for (const locale of ["en", "fr"]) {
      await gotoStable(page, `/${locale}`);
      await assertNoHorizontalScroll(page, `${locale} ${width}px`);
      const heroBox = await page.locator(".hero-copy h1").boundingBox();
      expect(heroBox?.x ?? -1).toBeGreaterThanOrEqual(0);
      expect((heroBox?.x ?? 0) + (heroBox?.width ?? width)).toBeLessThanOrEqual(width);
      const procurementTitle = page.locator(".category-procurement h3");
      const titleFits = await procurementTitle.evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
      expect(titleFits, `${locale} procurement title at ${width}px`).toBe(true);
    }
  }
});

test("desktop polish fits and sticky header clears every homepage section", async ({page}) => {
  for (const width of [1280, 1366, 1440, 1920]) {
    await page.setViewportSize({width, height: 900});
    for (const locale of ["en", "fr"]) {
      await gotoStable(page, `/${locale}`);
      await assertNoHorizontalScroll(page, `${locale} desktop ${width}px`);
      await expect(page.locator(".hero-actions .action-primary")).toBeInViewport();
      const titleFits = await page.locator(".category-procurement h3").evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
      expect(titleFits, `${locale} procurement title at ${width}px`).toBe(true);

      const sections = page.locator("main > section");
      const sectionCount = await sections.count();
      for (let index = 1; index < sectionCount; index++) {
        const section = sections.nth(index);
        await section.evaluate((element) => element.scrollIntoView({block: "start"}));
        await page.waitForTimeout(40);
        const top = await section.evaluate((element) => element.getBoundingClientRect().top);
        const headerHeight = await page.locator(".site-header").evaluate((element) => element.getBoundingClientRect().height);
        expect(top, `${locale} section ${index} at ${width}px`).toBeGreaterThanOrEqual(headerHeight - 1);
      }
    }
  }
});

test("mobile navigation, product prefill, contact links and RFQ flow work", async ({page}) => {
  await page.route("**/api/rfq", (route) => route.fulfill({status: 503, contentType: "application/json", body: JSON.stringify({status: "fallback", mailto: "mailto:info@ak-globaltrading.com"})}));
  await page.setViewportSize({width: 390, height: 844});
  await gotoStable(page, "/en");
  await page.locator(".menu-trigger").click();
  await expect(page.locator(".mobile-drawer")).toHaveClass(/open/);
  await expect(page.locator(".mobile-drawer nav")).toBeVisible();
  await page.screenshot({path: "verification/mobile-navigation-open-390.png", fullPage: true});
  await page.locator('.mobile-drawer nav a[href="/en/products"]').click();
  await expect(page).toHaveURL(/\/en\/products$/);

  await gotoStable(page, "/en/products/lifting-equipment");
  await page.locator('.product-hero-copy a[href*="category="]').click();
  await expect(page).toHaveURL(/\/en\/rfq\?category=/);
  await expect(page.locator("#description-0")).toHaveValue("Lifting equipment");

  await page.getByRole("button", {name: "Send RFQ"}).click();
  await expect(page.locator(".error-summary")).toBeVisible();
  await page.locator("#name").fill("Test Buyer");
  await page.locator("#company").fill("Verification Company");
  await page.locator("#email").fill("invalid-email");
  await page.locator("#phone").fill("+27 82 000 0000");
  await page.locator("#country").selectOption({label: "South Africa"});
  await page.locator("#qty-0").fill("2");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", {name: "Send RFQ"}).click();
  await expect(page.locator(".error-summary")).toContainText("valid email");

  await page.locator("#email").fill("buyer@example.com");
  await page.getByRole("button", {name: "Add another item"}).click();
  await expect(page.locator(".rfq-item")).toHaveCount(2);
  await page.locator("#description-1").fill("Grade 8.8 hex bolts");
  await page.locator("#qty-1").fill("100");
  await page.locator(".rfq-item").nth(1).getByRole("button", {name: "Remove item"}).click();
  await expect(page.locator(".rfq-item")).toHaveCount(1);
  await page.getByRole("button", {name: "Send RFQ"}).click();
  await expect(page.locator(".submit-message.fallback")).toBeVisible();
  await expect(page.locator(".submit-message.fallback")).toContainText("has not been sent");
  await expect(page.locator(".submit-message")).not.toContainText("AK-RFQ-");

  await gotoStable(page, "/en/contact");
  await expect(page.locator('#main-content a[href="tel:+27829556071"]')).toBeVisible();
  await expect(page.locator('#main-content a[href="mailto:info@ak-globaltrading.com"]')).toBeVisible();
});

test("required screenshot evidence", async ({page}) => {
  test.setTimeout(360_000);
  const captures = [
    ["/en", "home-en-desktop.png"], ["/fr", "home-fr-desktop.png"],
    ["/en/products", "products-en.png"], ["/fr/produits", "products-fr.png"],
    ["/en/products/lifting-equipment", "lifting-en.png"],
    ["/en/procurement", "procurement-en.png"], ["/fr/approvisionnement", "approvisionnement-fr.png"],
    ["/en/rfq", "rfq-en-desktop.png"], ["/fr/devis", "rfq-fr-desktop.png"],
    ["/en/contact", "contact-en.png"], ["/fr/contact", "contact-fr.png"],
  ] as const;
  await page.setViewportSize({width: 1440, height: 1000});
  for (const [route, file] of captures) {
    await gotoStable(page, route);
    await preloadLazyImages(page);
    await page.screenshot({path: `verification/${file}`, fullPage: true});
  }

  for (const [locale, width] of [["en", 375], ["en", 390], ["fr", 375], ["fr", 390]] as const) {
    await page.setViewportSize({width, height: 844});
    await gotoStable(page, `/${locale}`);
    await preloadLazyImages(page);
    await page.screenshot({path: `verification/home-${locale}-mobile-${width}.png`, fullPage: true});
  }
  await page.setViewportSize({width: 390, height: 844});
  await gotoStable(page, "/en/rfq");
  await preloadLazyImages(page);
  await page.screenshot({path: "verification/rfq-en-mobile-390.png", fullPage: true});
});
