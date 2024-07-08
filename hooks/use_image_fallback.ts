import { useEffect, useState } from 'react';

const imageCache = new Set();

const useImageFallback = (src: string, fallback: string) => {
  const [source, setSource] = useState(src);

  useEffect(() => {
    if (imageCache.has(src) || imageCache.has(fallback)) {
      setSource(imageCache.has(src) ? src : fallback);
      return;
    }

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      imageCache.add(src);
    };

    const handleError = () => {
      setSource(fallback);
      imageCache.add(fallback);
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  return source;
};

export default useImageFallback;
