"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const DESTINATIONS = [
  "Spain",
  "Germany",
  "Shimla",
  "Goa",
  "Maldives",
  "Russia",
];

export default function SearchDropdown() {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (value: string) => {
    setQuery(value);
    setOpen(false);
    // Navigate to trip discovery page with search query
    router.push(`/trip-details?search=${encodeURIComponent(value)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) =>
          (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = filtered[activeIndex] ?? query;
      select(pick);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative">
      {/* Search bar */}
      <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-black/5 flex items-center pl-6 pr-16 py-4">
        <span className="font-garetbook text-lg text-primary font-medium relative -top-[0.75px]">
          Explore
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Destination..."
          className="ml-2 flex-1 bg-transparent outline-none font-garetheavy text-lg text-primary placeholder:text-gray-400"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggestions"
          role="combobox"
        />
        <button
          type="button"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-md"
          onClick={() => select(query)}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions */}
      {open && filtered.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 mt-3 rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl ring-1 ring-white/30 overflow-hidden"
        >
          {filtered.map((d, idx) => (
            <button
              key={d}
              type="button"
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                select(d);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full text-left px-6 py-4 text-white hover:bg-white/20 transition-colors duration-150 ${
                idx !== filtered.length - 1 ? "border-b border-white/40" : ""
              } ${idx === activeIndex ? "bg-white/10" : ""}`}
            >
              <span className="font-garetbook">Explore</span>{" "}
              <span className="font-garetheavy">{d}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
