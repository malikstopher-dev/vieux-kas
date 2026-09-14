type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ResponsivePicture({desktopSrc, mobileSrc, alt, className = "", priority = false}: Props) {
  return <>
    <picture className={className} style={{backgroundColor: "#111318"}}>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img
        src={desktopSrc}
        width={1672}
        height={941}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{backgroundColor: "#111318"}}
      />
    </picture>
  </>;
}
