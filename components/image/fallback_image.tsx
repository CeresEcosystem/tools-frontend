import useImageFallback from '@hooks/use_image_fallback';

export default function FallbackImage({
  src,
  fallback,
  alt,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string | undefined;
}) {
  const source = useImageFallback(src, fallback);

  return <img src={source} alt={alt} className={className} />;
}
