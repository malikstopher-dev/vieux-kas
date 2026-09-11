import type {CSSProperties, ReactNode} from "react";
import type {HeroAssetPair} from "@/lib/heroAssets";
import {ActionLink} from "./ActionLink";
import {ResponsivePicture} from "./ResponsivePicture";

type HeroAction = {
  href: string;
  label: ReactNode;
  variant?: "primary" | "outline" | "light" | "text";
};

type Props = {
  asset: HeroAssetPair;
  imageAlt: string;
  kicker: string;
  title: ReactNode;
  lead: string;
  variant?: "cinematic" | "split";
  size?: "home" | "inner" | "compact";
  tone?: "dark" | "light";
  overlay?: "soft" | "balanced" | "strong";
  imageSide?: "left" | "right";
  accent?: boolean;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  meta?: ReactNode;
  caption?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function PremiumHero({
  asset,
  imageAlt,
  kicker,
  title,
  lead,
  variant = "cinematic",
  size = "inner",
  tone = "dark",
  overlay = "balanced",
  imageSide = "right",
  accent = true,
  primaryAction,
  secondaryAction,
  meta,
  caption,
  footer,
  className = "",
}: Props) {
  const style = {
    "--hero-position": asset.position,
    "--hero-mobile-position": asset.mobilePosition,
  } as CSSProperties;

  return <section className={`premium-hero premium-hero--${variant} premium-hero--${size} premium-hero--${tone} premium-hero--overlay-${overlay} premium-hero--image-${imageSide} ${className}`} style={style}>
    <ResponsivePicture desktopSrc={asset.desktop} mobileSrc={asset.mobile} alt={imageAlt} className="premium-hero-media" priority />
    <div className="premium-hero-overlay" aria-hidden="true" />
    {accent && <div className="premium-hero-accent" aria-hidden="true" />}
    <div className="shell premium-hero-inner">
      <div className="premium-hero-copy">
        <p className="hero-eyebrow"><span />{kicker}</p>
        <h1 className="premium-hero-title">{title}</h1>
        <p className="premium-hero-lead">{lead}</p>
        {(primaryAction || secondaryAction) && <div className="premium-hero-actions">
          {primaryAction && <ActionLink href={primaryAction.href} variant={primaryAction.variant}>{primaryAction.label}</ActionLink>}
          {secondaryAction && <ActionLink href={secondaryAction.href} variant={secondaryAction.variant ?? "outline"}>{secondaryAction.label}</ActionLink>}
        </div>}
        {meta && <p className="premium-hero-meta">{meta}</p>}
      </div>
    </div>
    {caption && <p className="premium-hero-caption">{caption}</p>}
    {footer && <div className="premium-hero-footer">{footer}</div>}
  </section>;
}
