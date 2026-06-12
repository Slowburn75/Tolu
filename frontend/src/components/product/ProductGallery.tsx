"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

function GalleryImage({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  const isExternal = src.includes("placehold.co") || src.startsWith("http");
  if (!src || (isExternal && failed)) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <svg width="60" height="60" viewBox="0 0 800 800" fill="none" className="opacity-20 text-muted-foreground">
          <rect x="300" y="300" width="200" height="200" rx="8" fill="currentColor"/>
          <path d="M350 450L400 380L450 450H350Z" fill="currentColor"/>
          <circle cx="370" cy="350" r="20" fill="currentColor"/>
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <GalleryImage
          src={images[selectedIndex]}
          alt={productName}
          className={cn(
            "w-full h-full object-cover transition-transform duration-200",
            isZoomed && "scale-150"
          )}
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all",
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <GalleryImage
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
