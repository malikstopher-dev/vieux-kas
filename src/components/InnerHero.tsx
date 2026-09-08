import Image from "next/image";

export function InnerHero({kicker, title, lead, image, imageAlt = ""}: {kicker: string; title: string; lead: string; image?: string; imageAlt?: string}) {
  return <section className={`inner-hero ${image ? "with-image" : ""}`}>
    <div className="shell inner-hero-grid">
      <div className="inner-hero-copy"><p className="kicker">{kicker}</p><h1>{title}</h1><p>{lead}</p></div>
      {image && <div className="inner-hero-image"><Image src={image} alt={imageAlt} fill priority sizes="(max-width: 767px) 100vw, 48vw" /><div className="image-rule" /></div>}
    </div>
  </section>;
}
