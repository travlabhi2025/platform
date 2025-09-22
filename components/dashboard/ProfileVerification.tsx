import Image from "next/image";
import { Profile } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileVerification({ profile }: { profile: Profile }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="text-sm">
          <div className="font-semibold text-slate-900">{profile.name}</div>
          <div className="text-slate-600">Verified Organizer</div>
          <div className="text-slate-600">
            KYC Verified | Badge: {profile.badge}
          </div>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link href="/profile">Edit</Link>
      </Button>
    </div>
  );
}
