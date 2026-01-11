"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function NewHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--landing-surface-dark)]/50 bg-[var(--landing-background-dark)]/80 backdrop-blur-md px-4 py-3 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images//logos/TripAbhiLight.svg"
            alt="TripAbhi"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 hover:bg-white/20 font-satoshi-bold"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="flex h-10 items-center justify-center rounded-full bg-[var(--landing-primary)]/50 px-6 text-sm font-bold text-white shadow-lg shadow-[var(--landing-primary)]/20 transition-transform hover:scale-105 active:scale-95 hover:bg-[var(--landing-primary)]/90 font-satoshi-bold"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                className="hidden text-sm font-medium text-white hover:text-[var(--landing-primary)] sm:block pr-4 font-satoshi"
                href="/signin"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex h-10 items-center justify-center rounded-full bg-[var(--landing-primary)] px-6 text-sm font-bold text-white shadow-lg shadow-[var(--landing-primary)]/30 transition-transform hover:scale-105 active:scale-95 font-satoshi-bold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
