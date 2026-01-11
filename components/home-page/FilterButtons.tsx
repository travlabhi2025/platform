"use client";

import { useState } from "react";
import {
  Flame,
  DollarSign,
  Globe,
  Landmark,
  Umbrella,
  Mountain,
  Palette,
  LucideIcon,
} from "lucide-react";

const filters: Array<{
  id: string;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "trending", label: "Trending Now", icon: Flame },
  { id: "under1000", label: "Under $1000", icon: DollarSign },
  { id: "europe", label: "Europe", icon: Globe },
  { id: "asia", label: "Asia", icon: Landmark },
  { id: "beach", label: "Beach", icon: Umbrella },
  { id: "hiking", label: "Hiking", icon: Mountain },
  { id: "art", label: "Art & Culture", icon: Palette },
];

export default function FilterButtons() {
  const [activeFilter, setActiveFilter] = useState("trending");

  return (
    <section className="py-6 border-b border-white/5 bg-[var(--landing-background-dark)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium border transition-all font-satoshi-medium ${
                activeFilter === filter.id
                  ? "bg-white text-slate-900 font-satoshi-bold"
                  : "bg-[var(--landing-surface-dark)] text-white hover:bg-[var(--landing-border-dark)] border-white/10"
              }`}
            >
              <filter.icon className="w-[18px] h-[18px]" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
