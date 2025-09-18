import Image from "next/image";
import Link from "next/link";
import { Profile } from "./types";

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
  return (
    <aside className="bg-white rounded-lg border border-slate-200 p-4 md:p-5 flex flex-col h-full">
      <div className="flex items-center gap-3">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="text-sm">
          <div className="font-semibold">Hi, {profile.name.split(" ")[0]}</div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 flex-1">
        {items.map((it) => {
          const handleClick = (e: React.MouseEvent) => {
            if (it.scrollTo) {
              e.preventDefault();
              const element = document.getElementById(it.scrollTo);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }
          };

          const content = (
            <span
              className={
                "block px-3 py-2 rounded-md text-sm transition-colors cursor-pointer " +
                (it.active
                  ? "bg-primary text-white"
                  : "hover:bg-slate-100 text-slate-700")
              }
              aria-current={it.active ? "page" : undefined}
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
