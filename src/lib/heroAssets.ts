const heroBase = "/assets/akglobal/hero/AKGLOBAL_Premium_Hero_Assets_V4";

export const heroAssets = {
  homePrimary: {
    desktop: `${heroBase}/desktop/02-home-industrial-operations-hero.webp`,
    mobile: `${heroBase}/mobile/02-home-industrial-operations-mobile.webp`,
    position: "50% 50%",
    mobilePosition: "55% 50%",
  },
  homeSecondary: {
    desktop: `${heroBase}/desktop/01-home-global-logistics-hero.webp`,
    mobile: `${heroBase}/mobile/01-home-global-logistics-mobile.webp`,
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  companyPrimary: {
    desktop: `${heroBase}/desktop/03-company-executive-overview-hero.webp`,
    mobile: `${heroBase}/mobile/03-company-site-oversight-mobile.webp`,
    position: "60% 50%",
    mobilePosition: "62% 50%",
  },
  companySecondary: {
    desktop: `${heroBase}/desktop/04-company-industrial-office-hero.webp`,
    mobile: `${heroBase}/mobile/04-company-industrial-office-mobile.webp`,
    position: "64% 50%",
    mobilePosition: "50% 50%",
  },
  productsPrimary: {
    desktop: `${heroBase}/desktop/05-products-rigging-supplies-hero.webp`,
    mobile: `${heroBase}/mobile/05-products-rigging-supplies-mobile.webp`,
    position: "50% 50%",
    mobilePosition: "55% 48%",
  },
  productsSecondary: {
    desktop: `${heroBase}/desktop/06-products-industrial-hardware-hero.webp`,
    mobile: `${heroBase}/mobile/06-products-industrial-hardware-mobile.webp`,
    position: "58% 50%",
    mobilePosition: "50% 50%",
  },
  procurementPrimary: {
    desktop: `${heroBase}/desktop/07-procurement-global-logistics-hero.webp`,
    mobile: `${heroBase}/mobile/07-procurement-global-logistics-mobile.webp`,
    position: "50% 50%",
    mobilePosition: "55% 50%",
  },
  procurementSecondary: {
    desktop: `${heroBase}/desktop/08-procurement-sourcing-logistics-hero.webp`,
    mobile: `${heroBase}/mobile/08-procurement-sourcing-logistics-mobile.webp`,
    position: "50% 50%",
    mobilePosition: "55% 50%",
  },
  industriesPrimary: {
    desktop: `${heroBase}/desktop/09-industries-operations-hero.webp`,
    mobile: `${heroBase}/mobile/09-industries-operations-mobile.webp`,
    position: "54% 50%",
    mobilePosition: "60% 50%",
  },
  contactPrimary: {
    desktop: `${heroBase}/desktop/10-contact-executive-office-hero.webp`,
    mobile: `${heroBase}/mobile/10-contact-executive-office-mobile.webp`,
    position: "56% 50%",
    mobilePosition: "55% 50%",
  },
} as const;

export type HeroAssetPair = (typeof heroAssets)[keyof typeof heroAssets];
