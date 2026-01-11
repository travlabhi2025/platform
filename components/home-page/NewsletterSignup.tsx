"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-[var(--landing-background-dark)]">
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[var(--landing-primary)]/20 blur-[100px]"></div>
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[3rem] bg-[var(--landing-card-dark)] border border-white/5 p-8 text-center md:p-16 shadow-2xl">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[var(--landing-primary)]/20 text-[var(--landing-primary)]">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl font-satoshi-bold">
          Don't miss the next adventure
        </h2>
        <p className="mb-8 max-w-lg text-slate-400 font-satoshi">
          Get weekly drops of new trips, exclusive curator events, and travel
          hacks delivered to your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            className="flex-1 rounded-full border border-white/10 bg-[var(--landing-background-dark)] px-6 py-4 text-white placeholder-slate-500 focus:border-[var(--landing-primary)] focus:ring-1 focus:ring-[var(--landing-primary)] outline-none font-satoshi"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="rounded-full bg-[var(--landing-primary)] px-8 py-4 font-bold text-white shadow-lg shadow-[var(--landing-primary)]/30 transition-transform hover:scale-105 active:scale-95 font-satoshi-bold"
            type="submit"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500 font-satoshi">
          No spam, just wanderlust. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
