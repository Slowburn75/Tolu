"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const collections = [
  {
    title: "Men's Collection",
    subtitle: "Sophisticated styles for the modern man",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800",
    link: "/shop?gender=male",
  },
  {
    title: "Women's Collection",
    subtitle: "Elegance meets contemporary fashion",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
    link: "/shop?gender=female",
  },
  {
    title: "Kids Collection",
    subtitle: "Comfortable and stylish for little ones",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800",
    link: "/shop?gender=kids",
  },
];

export function CollectionSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link key={col.title} href={col.link} className="group relative h-80 rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${col.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{col.title}</h3>
                <p className="text-gray-300 mb-4">{col.subtitle}</p>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Shop Now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
