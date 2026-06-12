"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getInitials } from "@/lib/utils";

const reviews = [
  { name: "Chioma O.", rating: 5, text: "Absolutely love my purchase! The quality exceeded my expectations. Fast delivery too!", date: "2 weeks ago" },
  { name: "Emeka N.", rating: 5, text: "Tolumak never disappoints. Great selection of styles and the fit is perfect.", date: "1 month ago" },
  { name: "Amina K.", rating: 4, text: "Beautiful pieces! The material is top-notch. Will definitely be ordering again.", date: "3 weeks ago" },
  { name: "Tunde A.", rating: 5, text: "Best online shopping experience in Nigeria. Customer service is exceptional!", date: "2 months ago" },
  { name: "Ngozi P.", rating: 5, text: "The shoes are gorgeous and comfortable. True to size. Highly recommended!", date: "1 week ago" },
  { name: "Kofi M.", rating: 4, text: "Great quality for the price. Shipping was faster than expected.", date: "3 months ago" },
];

export function CustomerReviews() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground">Join thousands of satisfied customers</p>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {reviews.map((review, i) => (
              <CarouselItem key={i} className="basis-full md:basis-1/2 lg:basis-1/3">
                <div className="border rounded-xl p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-4 w-4 ${j < review.rating ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(review.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
