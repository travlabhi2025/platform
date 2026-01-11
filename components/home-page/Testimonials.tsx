"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "Bali, Aug 2023",
    rating: 5,
    text: "I've never felt more connected to a group of strangers. Jessica's retreat in Bali wasn't just a trip, it was a life-changing experience. Highly recommend!",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwCVLhKCKQoJIeB4mdJMNc71ZRBzO0c2atB5XWc-H6eWncjj-CX7rM2ur6dYAR4kT7WhhbkPFFFu8uYUPfTpBB0HWOO3x3Xz6rd-5Wu85pHcoKlkw0Mh_9GWep04u9E43mM7PjWIHgsSfkqbLK3fvT1oLfr7Cix_TvAlqge-IOWtqlQ12BMuFqnT7elhHy8P69neqr2BGBkS8JUX7RekvTKV65OOiE6E6sM5duBka2OqUqa0RmPWHI3nv0axde9XQeiCZjv8uvAJyb",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Iceland, Oct 2023",
    rating: 5,
    text: "The photography tour with Alex was top notch. He knows exactly where to go for the best light. My portfolio has never looked better. Worth every penny.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW-Gznbhfwwo8XI1amrJu6zYyndaqm_Ngy2eZ1n1g-gaI0ctBRDWLZr99sjePWiturtbLltsgUR9ARpCfpAoSCqxuKBLWLTUjEImOzozhgTz3iiAprAdMYsDS_eoT5CfUgv3o_eo66-QyRZpsIxkWhqK4nU0S4SEQ4O_CYCG-qPlamUaLT54bpGYG0n71qKBsfCoTdwIY1PhOef_TXCIBtM49YSeAiGa9QjaxUFkA0PjkA_wFGu-mclVSC7cF_j3M9PL-GJrBIqOTQ",
  },
  {
    id: 3,
    name: "Emily Thorne",
    location: "Japan, Apr 2024",
    rating: 4,
    text: "As a solo female traveller, I was nervous, but Yumi made everyone feel so safe and included. The food was incredible, obviously! Can't wait for the next one.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ISk7BFSjfehO1BBN3HZzyQMF0UCDMTiZobq8AHSZAP7mgSJM9hmTf6BueUXhgBRQWfmxjzwYUKrCGW61Y99CBQ5kQAgOOP2ba-QATHXNSLwnGhHI1EL2XK6gE887w3Sb9o3OVpcUgjFm0YtcpdLYuinXw_kkJDrnD1HLHeuI-Qr6a3JqCC4NAQ4g5FDcM8pJilD43DRz2A09brJLoMCfIYlU__0hLWeUC-oR6iBhK472HTK63b5s-1QzH4qCrx8cZNaDGCK5-gGD",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-[var(--landing-brand-dark)] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="text-center mb-12">
          <span className="text-[var(--landing-primary)] font-bold tracking-wider uppercase text-xs font-satoshi-bold">
            Community Stories
          </span>
          <h2 className="text-3xl font-bold text-white mt-2 font-satoshi-bold">
            Loved by Travellers
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-[2rem] p-8 flex flex-col gap-6 relative"
            >
              <div className="flex text-yellow-400 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? "fill-yellow-400" : ""
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed relative z-10 font-satoshi">
                "{testimonial.text}"
              </p>
              <div className="mt-auto flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${testimonial.avatar})` }}
                ></div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 font-satoshi-bold">
                    {testimonial.name}
                  </h5>
                  <p className="text-xs text-slate-500 font-satoshi">
                    Went to {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
