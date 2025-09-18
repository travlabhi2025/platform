"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Booking } from "./types";

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "approved" | "pending" | "rejected">(
    "all"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const byTab =
        tab === "all"
          ? true
          : tab === "approved"
          ? b.status === "Approved"
          : tab === "pending"
          ? b.status === "Pending"
          : b.status === "Rejected";
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
            onClick={() => setTab("approved")}
            className={`px-3 py-1 rounded-full border ${
              tab === "approved"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Approved
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
          <button
            onClick={() => setTab("rejected")}
            className={`px-3 py-1 rounded-full border ${
              tab === "rejected"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
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
            {filtered.length > 0 ? (
              filtered.map((b, i) => (
                <tr key={`${b.travelerName}-${i}`} className="bg-white">
                  <td className="px-4 py-3 text-slate-800">{b.travelerName}</td>
                  <td className="px-4 py-3 text-slate-600">{b.trip}</td>
                  <td className="px-4 py-3 text-slate-600">{b.bookingDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                        b.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : b.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-primary">
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="underline text-xs hover:text-primary/80"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  no bookings yet..
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
