import {heroAssets} from "@/lib/heroAssets";
import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {CategoryCard} from "./CategoryCard";
import {PremiumHero} from "./PremiumHero";
import {ResponsivePicture} from "./ResponsivePicture";

export function ProductsPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <PremiumHero
      asset={heroAssets.productsPrimary}
      imageAlt={locale === "en" ? "Industrial lifting, rigging and hardware supplies prepared by AKGLOBAL" : "Fournitures de levage, d’élingage et quincaillerie industrielle préparées par AKGLOBAL"}
      kicker={copy.products.kicker}
      title={copy.products.title}
      lead={copy.products.lead}
      overlay="balanced"
      primaryAction={{href: "#product-categories", label: copy.common.explore}}
      secondaryAction={{href: routeFor("rfq", locale), label: copy.common.quote}}
    />
    <section id="product-categories" className="products-listing section-pad offwhite-section"><div className="shell category-grid category-grid-large">
      {copy.categories.map((category, i) => <CategoryCard key={category.key} category={category} locale={locale} index={i} sizes="(max-width: 767px) 100vw, 50vw" />)}
    </div></section>
    <section className="product-image-moment"><ResponsivePicture desktopSrc={heroAssets.productsSecondary.desktop} mobileSrc={heroAssets.productsSecondary.mobile} alt={locale === "en" ? "AKGLOBAL industrial hardware and lifting components" : "Composants de levage et fournitures industrielles AKGLOBAL"} /><div className="shell"><p className="technical-caption">{locale === "en" ? "LIFTING / HARDWARE / INDUSTRIAL SUPPLY" : "LEVAGE / FOURNITURES / APPROVISIONNEMENT INDUSTRIEL"}</p></div></section>
    <section className="product-note section-pad"><div className="shell note-grid">
      <div><p className="kicker">{locale === "en" ? "RFQ / SOURCING" : "DEVIS / APPROVISIONNEMENT"}</p><h2>{copy.products.noteTitle}</h2><p>{copy.products.noteBody}</p></div>
      <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
    </div></section>
  </main>;
}
