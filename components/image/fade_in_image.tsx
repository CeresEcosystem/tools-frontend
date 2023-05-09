import classNames from 'classnames';
import { useState } from 'react';

export default function FadeInImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={classNames(
        `opacity-${imageLoaded ? '100' : '0'} transition-opacity duration-300`,
        className
      )}
      onLoad={() => setImageLoaded(true)}
    />
  );
}
