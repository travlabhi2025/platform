"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, userProfile, signOut, isOrganizer } = useAuth();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setOpen(false); // close on >= sm screens
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="shadow-sm fixed z-100 max-w-[95vw] min-w-[95vw] bg-white mx-auto left-1/2 -translate-x-1/2 top-10 rounded-md">
      <div className="max-w-full mx-auto pr-4 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={"/images/logo.png"}
              alt="TravlAbhi"
              width={120}
              height={120}
            />
          </div>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <EllipsisVertical className="h-5 w-5 text-primary" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 z-[110]">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          isOrganizer()
                            ? "/trip-organizer/dashboard"
                            : "/profile"
                        }
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="bg-primary font-bebas hover:bg-primary/90 text-primary-foreground px-8 py-1 rounded-md font-medium transition-colors duration-200 cursor-pointer"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  className="border border-primary text-primary px-4 py-1 rounded-md font-bebas tracking-wide hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Center links on sm+ */}
          <div className="hidden sm:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link
              href={"/trip-discovery"}
              className="font-garetheavy text-primary hover:text-primary/90"
            >
              Explore All Trips
            </Link>
            <Link
              href={"/booking-status"}
              className="font-garetheavy text-primary hover:text-primary/90"
            >
              Check Booking
            </Link>
          </div>

          {/* Burger button */}
          <button
            className="sm:hidden p-2 rounded-md border border-slate-200 text-primary"
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
      </div>

      {open && (
        <nav className="sm:hidden border-t border-slate-200">
          <div className="px-4 py-3 flex flex-col gap-3">
            <Link
              href={"/trip-discovery"}
              className="font-garetheavy text-primary"
            >
              Explore All Trips
            </Link>
            <Link
              href={"/booking-status"}
              className="font-garetheavy text-primary"
            >
              Check Booking
            </Link>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={
                    isOrganizer() ? "/trip-organizer/dashboard" : "/profile"
                  }
                  className="text-primary font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-800 w-max"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="bg-primary font-bebas hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-md w-max"
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
