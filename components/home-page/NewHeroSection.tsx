"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { DatePicker } from "../ui/date-picker";

export default function NewHeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dates, setDates] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    if (searchQuery.trim()) {
      router.push(`/trip/${searchQuery}`);
    }
  };

  return (
    <section className="relative flex min-h-[600px] flex-col justify-center px-4 py-12 lg:px-10">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16, 25, 34, 0.4) 0%, rgba(16, 25, 34, 0.8) 90%, #101922 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBd2ePe3mFzYkCk0MiZLm_CGBD8F9vI9fXoIHAqlP7tRd5cSwFB2m354MrGjMfgrDgT2jD3fBPercla_rmNF8E-6BVzC3J99vnolUiqRi4FVD-t0CDauWXnkEsaMfmBhO8JVQo9kmd_iwd_aHGbA__QZv2uxTtFLrmbSCBiG9WuPdMVUMa1QjNvnXcEZ6THd2sqyC6lVp3TK3z7CiGZ6Lpe35VLHSSnZshgsyTEeTp5qbWlbE5MhlxR3pQeUNR5OsgQxV-3sqBdhdz6")',
          }}
        ></div>
      </div>
      <div className="layout-content-container z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl font-satoshi-black">
            Explore the World,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--landing-primary)] to-blue-300">
              Together.
            </span>
          </h1>
          <h2 className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-slate-300 md:text-xl font-satoshi">
            Join community-led adventures hosted by your favorite curators. No
            planning, just memories.
          </h2>
        </div>
        <div className="w-full max-w-2xl p-2 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl">
          <form
            onSubmit={handleSearch}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center p-1"
          >
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <Search className="text-slate-400 w-5 h-5" />
              <input
                className="w-full bg-transparent border-none p-0 text-white placeholder-slate-400 focus:ring-0 focus:outline-none text-base font-medium font-satoshi"
                placeholder="Where do you want to go?"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-px w-full bg-white/10 sm:h-8 sm:w-px"></div>
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <DatePicker
                className={`w-full bg-transparent border-none !p-0 text-slate-400 focus:ring-0 focus:outline-none text-base font-medium font-satoshi hover:bg-transparent shadow-none hover:text-slate-400 ${
                  dates ? "text-white" : "text-slate-400"
                }`}
                value={dates}
                onChange={(date) => setDates(date ?? "")}
              />
            </div>
            <button
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--landing-primary)] px-8 text-base font-bold text-white shadow-lg transition-all hover:bg-[var(--landing-primary-hover)] sm:mt-0 sm:w-auto font-satoshi-bold"
              type="submit"
            >
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden">Search Adventures</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-[18px] h-[18px] fill-green-500" />
            <span className="font-satoshi">Verified Hosts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-[18px] h-[18px] fill-green-500" />
            <span className="font-satoshi">Secure Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-[18px] h-[18px] fill-green-500" />
            <span className="font-satoshi">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
