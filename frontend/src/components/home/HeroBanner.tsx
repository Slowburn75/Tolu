"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in fashion",
    cta: "Shop Now",
    link: "/shop",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920",
    title: "Elevate Your Style",
    subtitle: "Premium fashion for the modern individual",
    cta: "Explore Collection",
    link: "/shop?gender=female",
    align: "center",
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920",
    title: "New Arrivals",
    subtitle: "Be the first to wear the latest styles",
    cta: "View New Arrivals",
    link: "/shop?isNewArrival=true",
    align: "right",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  };

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative h-[60vh] min-h-[400px] lg:h-[80vh] overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-all duration-700",
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl text-white">
          <p className="text-sm uppercase tracking-widest mb-4 text-primary font-medium">New Season</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 leading-tight">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">{slide.subtitle}</p>
          <Link href={slide.link}>
            <Button size="lg" className="text-base px-8 h-14">
              {slide.cta}
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === current ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block">
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
}
