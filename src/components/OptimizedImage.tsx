import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  sizes?: string;
  /** Explicit intrinsic width – prevents CLS by letting the browser reserve space */
  width?: number;
  /** Explicit intrinsic height – prevents CLS by letting the browser reserve space */
  height?: number;
  onLoad?: () => void;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  sizes,
  width,
  height,
  onLoad,
  priority = false,
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convert image path to WebP
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");

  // If the image is already cached the load event fires synchronously before
  // React can attach the onLoad handler. Detect that and mark loaded immediately.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [src]);

  useEffect(() => {
    // Preload priority images
    if (priority && !imageLoaded) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = webpSrc;
      link.type = "image/webp";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, webpSrc, imageLoaded]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <picture>
      {/* WebP format with fallback */}
      {!hasError && <source srcSet={webpSrc} type="image/webp" sizes={sizes} />}

      {/* Fallback to original format.
          width + height give the browser an intrinsic aspect-ratio so it can
          reserve the correct amount of space BEFORE the image downloads,
          eliminating the largest source of CLS on this page. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${!imageLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        loading={priority ? "eager" : loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
};
