import type {Locale, PageKey, SiteCopy} from "@/lib/site";
import {AboutPage} from "./AboutPage";
import {ContactPage} from "./ContactPage";
import {HomePage} from "./HomePage";
import {IndustriesPage} from "./IndustriesPage";
import {ProcurementPage} from "./ProcurementPage";
import {ProductDetailPage} from "./ProductDetailPage";
import {ProductsPage} from "./ProductsPage";
import {RFQPage} from "./RFQPage";

export function PageRenderer({page, locale, copy}: {page: PageKey; locale: Locale; copy: SiteCopy}) {
  switch (page) {
    case "home": return <HomePage locale={locale} copy={copy} />;
    case "about": return <AboutPage locale={locale} copy={copy} />;
    case "products": return <ProductsPage locale={locale} copy={copy} />;
    case "lifting":
    case "fasteners":
    case "hardware": return <ProductDetailPage locale={locale} copy={copy} page={page} />;
    case "procurement": return <ProcurementPage locale={locale} copy={copy} />;
    case "industries": return <IndustriesPage locale={locale} copy={copy} />;
    case "rfq": return <RFQPage locale={locale} copy={copy} />;
    case "contact": return <ContactPage locale={locale} copy={copy} />;
  }
}
