"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Bell, User, LogOut, Heart, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  
  // Check active states
  const isDashboardActive = pathname ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) : false;
  const isMyTripsActive = pathname ? (pathname === "/my-trips" || pathname.startsWith("/my-trips/")) : false;
  const isTripsTodoActive = pathname ? (pathname === "/trips-todo" || pathname.startsWith("/trips-todo/")) : false;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/logos/TripAbhiDark.svg"
                alt="TripAbhi"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className={`px-3 py-2 text-sm rounded-lg transition-colors font-satoshi-medium ${
                  isDashboardActive
                    ? "font-semibold text-[#112838] bg-slate-100"
                    : "font-medium text-slate-500 hover:text-[#2b9dee] hover:bg-slate-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/my-trips"
                className={`px-3 py-2 text-sm rounded-lg transition-colors font-satoshi-medium ${
                  isMyTripsActive
                    ? "font-semibold text-[#112838] bg-slate-100"
                    : "font-medium text-slate-500 hover:text-[#2b9dee] hover:bg-slate-50"
                }`}
              >
                My Trips
              </Link>
              <Link
                href="/trips-todo"
                className={`px-3 py-2 text-sm rounded-lg transition-colors font-satoshi-medium ${
                  isTripsTodoActive
                    ? "font-semibold text-[#112838] bg-slate-100"
                    : "font-medium text-slate-500 hover:text-[#2b9dee] hover:bg-slate-50"
                }`}
              >
                Trips Todo
              </Link>
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-[#2b9dee] hover:bg-slate-50 rounded-lg transition-colors font-satoshi-medium"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-[#112838] transition-colors">
              <Bell className="w-5 h-5" />
              {/* TODO: Add dynamic badge when notification functionality is implemented */}
              {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  {user?.photoURL ? (
                    <div
                      className="h-9 w-9 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#2b9dee]/20 transition-all"
                      style={{ backgroundImage: `url(${user.photoURL})` }}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[#112838] font-bold font-satoshi-bold cursor-pointer hover:ring-2 hover:ring-[#2b9dee]/20 transition-all">
                      {user?.displayName?.[0] || "U"}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 z-[110] bg-white border border-slate-200 rounded-xl shadow-lg p-1 min-w-[11rem]"
                style={{ backgroundColor: "white" }}
              >
                <DropdownMenuItem
                  asChild
                  className="focus:bg-slate-50 focus:text-[#112838] rounded-lg px-3 py-2 data-[focus]:bg-slate-50"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 cursor-pointer text-[#112838] font-satoshi-medium"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-slate-50 focus:text-[#112838] rounded-lg px-3 py-2 data-[focus]:bg-slate-50"
                >
                  <Link
                    href="/trips-todo"
                    className="flex items-center gap-2 cursor-pointer text-[#112838] font-satoshi-medium"
                  >
                    <Heart className="w-4 h-4 text-slate-500" />
                    Trips Todo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-slate-50 focus:text-[#112838] rounded-lg px-3 py-2 data-[focus]:bg-slate-50"
                >
                  <Link
                    href="/my-settings"
                    className="flex items-center gap-2 cursor-pointer text-[#112838] font-satoshi-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 cursor-pointer text-[#112838] focus:bg-slate-50 rounded-lg px-3 py-2 font-satoshi-medium data-[focus]:bg-slate-50"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
