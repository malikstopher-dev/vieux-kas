/* eslint-disable @next/next/no-img-element */

import {getImageProps} from "next/image";

type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ResponsivePicture({desktopSrc, mobileSrc, alt, className = "", priority = false}: Props) {
  const {props: mobileProps} = getImageProps({src: mobileSrc, alt, width: 941, height: 1672, sizes: "100vw", quality: 88});
  const {props: desktopProps} = getImageProps({src: desktopSrc, alt, width: 1672, height: 941, sizes: "100vw", quality: 88});

  return <>
    {priority && <>
      <link rel="preload" as="image" imageSrcSet={mobileProps.srcSet} imageSizes={mobileProps.sizes} media="(max-width: 767px)" />
      <link rel="preload" as="image" imageSrcSet={desktopProps.srcSet} imageSizes={desktopProps.sizes} media="(min-width: 768px)" />
    </>}
    <picture className={className}>
      <source media="(max-width: 767px)" srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} />
      <img
        {...desktopProps}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  </>;
}
