/* eslint-disable @next/next/no-img-element */

type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ResponsivePicture({desktopSrc, mobileSrc, alt, className = "", priority = false}: Props) {
  return <>
    {priority && <>
      <link rel="preload" as="image" href={mobileSrc} media="(max-width: 767px)" />
      <link rel="preload" as="image" href={desktopSrc} media="(min-width: 768px)" />
    </>}
    <picture className={className}>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img
        src={desktopSrc}
        width={1672}
        height={941}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  </>;
}
