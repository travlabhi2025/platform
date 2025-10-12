"use client";

import Image from "next/image";
import Link from "next/link";
import { Profile } from "./types";
import { useScrollSpy } from "@/lib/useScrollSpy";

export type DashboardSidebarItem = {
  id: string;
  label: string;
  href?: string;
  scrollTo?: string;
  active?: boolean;
};

export default function DashboardSidebar({
  profile,
  items,
}: {
  profile: Profile;
  items: DashboardSidebarItem[];
}) {
  // Extract section IDs for scroll spy
  const sectionIds = items
    .filter((item) => item.scrollTo)
    .map((item) => item.scrollTo!);

  // Use scroll spy to track active section
  const { activeSection, scrollToSection } = useScrollSpy(sectionIds, {
    offset: 100, // Account for fixed header
  });

  // Debug logging
  console.log("Sidebar - sectionIds:", sectionIds);
  console.log("Sidebar - activeSection:", activeSection);

  return (
    <aside className="hidden lg:flex sticky top-24 bg-white rounded-lg border border-slate-200 p-4 md:p-5 flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="text-sm">
          <div className="font-semibold">Hi, {profile.name.split(" ")[0]}</div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
        {items.map((it) => {
          const isActive = it.scrollTo
            ? activeSection === it.scrollTo
            : it.active;

          const handleClick = (e: React.MouseEvent) => {
            if (it.scrollTo) {
              e.preventDefault();
              scrollToSection(it.scrollTo);
            }
          };

          const content = (
            <span
              className={
                "block px-3 py-2 rounded-md text-sm transition-colors cursor-pointer " +
                (isActive
                  ? "bg-primary text-white"
                  : "hover:bg-slate-100 text-slate-700")
              }
              aria-current={isActive ? "page" : undefined}
              onClick={handleClick}
            >
              {it.label}
            </span>
          );

          return it.href ? (
            <Link key={it.id} href={it.href}>
              {content}
            </Link>
          ) : (
            <div key={it.id}>{content}</div>
          );
        })}
      </nav>
    </aside>
  );
}
