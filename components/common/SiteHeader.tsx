"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[95vw] mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="TravlAbhi"
              width={120}
              height={120}
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-primary hover:text-primary/90 font-garetheavy"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-primary hover:text-primary/90 font-garetheavy"
            >
              About Us
            </Link>
            <Link
              href="/trip-discovery"
              className="text-primary hover:text-primary/90 font-garetheavy"
            >
              Discover Trips
            </Link>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <input
              aria-label="Search"
              placeholder="Search"
              className="w-[360px] rounded-md border border-slate-200 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                width="18"
                height="18"
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
          {user ? (
            <div className="flex items-center gap-3">
              <Image
                src="/icons/notif-icon.svg"
                alt="Notifications"
                width={32}
                height={32}
              />
              <Link href="/dashboard">
                <Image
                  src="/images/trip-discovery/profile-pic.png"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="bg-primary text-white px-4 py-2 rounded-md font-bebas tracking-wide"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="border border-primary text-primary px-4 py-2 rounded-md font-bebas tracking-wide"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md border border-slate-200 text-primary"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-slate-200">
          <div className="max-w-[95vw] mx-auto py-3 flex flex-col gap-3">
            <Link href="/" className="text-primary font-garetheavy">
              Home
            </Link>
            <Link href="#" className="text-primary font-garetheavy">
              About Us
            </Link>
            <Link
              href="/trip-discovery"
              className="text-primary font-garetheavy"
            >
              Discover Trips
            </Link>
            <div className="pt-2">
              <input
                aria-label="Search"
                placeholder="Search"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/notif-icon.svg"
                  alt="Notifications"
                  width={32}
                  height={32}
                />
                <Link href="/dashboard">
                  <Image
                    src="/images/trip-discovery/profile-pic.png"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="bg-primary text-white px-4 py-2 rounded-md font-bebas tracking-wide w-max"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  className="border border-primary text-primary px-4 py-2 rounded-md font-bebas tracking-wide w-max"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
