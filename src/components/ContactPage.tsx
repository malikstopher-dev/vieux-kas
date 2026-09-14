import Image from "next/image";
import {heroAssets} from "@/lib/heroAssets";
import type {Locale, SiteCopy} from "@/lib/site";
import {company, routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {LocationIcon, MailIcon, PhoneIcon} from "./Icons";
import {PremiumHero} from "./PremiumHero";

export function ContactPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=1+Broadacres+Drive+Fourways+Sandton+2055+South+Africa";
  return <main>
    <PremiumHero
      asset={heroAssets.contactPrimary}
      imageAlt={locale === "en" ? "AKGLOBAL executive office overlooking industrial operations" : "Bureau de direction AKGLOBAL donnant sur les opérations industrielles"}
      kicker={copy.contact.kicker}
      title={copy.contact.title}
      lead={copy.contact.lead}
      mobileTitle={locale === "en" ? <><span>Discuss your</span><span className="outline-word">next industrial requirement.</span></> : <><span>Échangeons sur</span><span className="outline-word">votre prochain besoin industriel.</span></>}
      mobileLead={locale === "en" ? "Based in Fourways, Sandton. Serving South Africa and the DRC." : "Basé à Fourways, Sandton. Service en Afrique du Sud et en RDC."}
      overlay="strong"
      primaryAction={{href: `mailto:${company.emails[0]}`, label: copy.contact.write}}
      secondaryAction={{href: company.phoneHref, label: copy.contact.call}}
      meta={<>Fourways · Sandton · {locale === "en" ? "South Africa" : "Afrique du Sud"}</>}
    />
    <section className="contact-section section-pad"><div className="shell contact-grid">
      <div className="contact-identity">
        <Image src="/assets/akglobal/brand/akglobal-logo-transparent.png" alt="AKGLOBAL Trading Pty" width={1010} height={640} sizes="280px" />
        <p>{copy.contact.service}</p>
        <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
      </div>
      <div className="contact-details">
        <article><LocationIcon /><div><p>{copy.contact.office}</p><address>{company.address.map((line) => <span key={line}>{line}</span>)}</address><a href={mapUrl} target="_blank" rel="noreferrer">{copy.contact.map} ↗</a></div></article>
        <article><PhoneIcon /><div><p>{copy.contact.phone}</p><a href={company.phoneHref}>{company.phoneDisplay}</a><small>{copy.contact.call}</small></div></article>
        <article><MailIcon /><div><p>{copy.contact.email}</p>{company.emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}</div></article>
        <div className="corporate-data"><div><span>{copy.contact.registration}</span><strong>{company.registration}</strong></div><div><span>{copy.contact.owner}</span><strong>{company.owner}</strong></div></div>
      </div>
    </div></section>
  </main>;
}
