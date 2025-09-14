"use client";

import { useMemo, useState } from "react";
import { Booking } from "./types";

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "confirmed" | "pending">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const byTab =
        tab === "all"
          ? true
          : tab === "confirmed"
          ? b.status === "Confirmed"
          : b.status === "Pending";
      const byQuery = q
        ? b.travelerName.toLowerCase().includes(q) ||
          b.trip.toLowerCase().includes(q) ||
          b.bookingDate.includes(q)
        : true;
      return byTab && byQuery;
    });
  }, [bookings, query, tab]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookings"
              className="w-full rounded-md border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1 rounded-full border ${
              tab === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab("confirmed")}
            className={`px-3 py-1 rounded-full border ${
              tab === "confirmed"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-3 py-1 rounded-full border ${
              tab === "pending"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="text-left font-medium px-4 py-3">Traveler Name</th>
            <th className="text-left font-medium px-4 py-3">Trip</th>
            <th className="text-left font-medium px-4 py-3">Booking Date</th>
            <th className="text-left font-medium px-4 py-3">Status</th>
            <th className="text-left font-medium px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b, i) => (
            <tr key={`${b.travelerName}-${i}`} className="bg-white">
              <td className="px-4 py-3 text-slate-800">{b.travelerName}</td>
              <td className="px-4 py-3 text-slate-600">{b.trip}</td>
              <td className="px-4 py-3 text-slate-600">{b.bookingDate}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                    b.status === "Confirmed"
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-4 py-3 text-primary">
                <button className="underline text-xs">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
