import Image from "next/image";
import { Profile } from "./types";

export default function ProfileVerification({ profile }: { profile: Profile }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4">
      <Image
        src={profile.avatar}
        alt={profile.name}
        width={56}
        height={56}
        className="rounded-full"
      />
      <div className="text-sm">
        <div className="font-semibold text-slate-900">{profile.name}</div>
        <div className="text-slate-600">Verified Organizer</div>
        <div className="text-slate-600">
          KYC Verified | Badge: {profile.badge}
        </div>
      </div>
    </div>
  );
}
