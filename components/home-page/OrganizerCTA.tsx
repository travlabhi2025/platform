"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function OrganizerCTA() {
  const { user, isOrganizer } = useAuth();

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl text-white mb-4 font-garetheavy">
          Are You A Travel Organiser?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto font-garet-book">
          Share your passion for travel and lead your own group trips.
        </p>
        {user ? (
          <Link
            href={isOrganizer() ? "/trip-organizer/dashboard" : "/profile"}
            className="inline-block bg-white text-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 font-plusjakartasans font-semibold"
          >
            {isOrganizer() ? "Go to Dashboard" : "Go to Profile"}
          </Link>
        ) : (
          <Link
            href="/signup"
            className="inline-block bg-white text-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 font-plusjakartasans font-semibold"
          >
            Start Organising
          </Link>
        )}
      </div>
    </section>
  );
}
