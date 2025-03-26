import Image from 'next/image';
import { useState } from 'react';

interface PrizeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function PrizeImage({ src, alt, width = 300, height = 300 }: PrizeImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={75}
        priority={false}
        loading="lazy"
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
} 