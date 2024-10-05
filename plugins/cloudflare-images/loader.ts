import { type ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  // const paramsString = params.join(',');
  // return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
  const imageUrl = new URL('https://images.arya.sh');
  imageUrl.searchParams.set('image', src);
  imageUrl.searchParams.set('width', width.toString());
  imageUrl.searchParams.set('quality', quality.toString());
  return imageUrl.href;
};
