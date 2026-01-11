import Link from "next/link";
import Image from "next/image";
import { Globe, Camera, Video } from "lucide-react";

export default function NewFooter() {
  return (
    <footer className="border-t border-[var(--landing-surface-dark)] bg-[var(--landing-background-dark)] pb-10 pt-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <div className="mb-4">
              <Image
                src="/images//logos/TripAbhiLight.svg"
                alt="TripAbhi"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm mb-6 font-satoshi">
              The leading marketplace for community-led group trips. Connect,
              explore, and create memories that last a lifetime.
            </p>
            <div className="flex gap-4">
              <a
                className="text-slate-400 hover:text-white"
                href="#"
                aria-label="Social media link"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                className="text-slate-400 hover:text-white"
                href="#"
                aria-label="Social media link"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                className="text-slate-400 hover:text-white"
                href="#"
                aria-label="Social media link"
              >
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white font-satoshi-bold">Company</h4>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Careers
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Press
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Blog
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white font-satoshi-bold">
              Community
            </h4>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Become a Host
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Curator Funds
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Community Guidelines
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Refer a Friend
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white font-satoshi-bold">Support</h4>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Help Center
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Safety
            </a>
            <a
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="#"
            >
              Cancellation Options
            </a>
            <Link
              className="text-sm hover:text-[var(--landing-primary)] font-satoshi"
              href="/terms-and-conditions"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--landing-surface-dark)] pt-8 md:flex-row">
          <p className="text-xs font-satoshi">
            © 2024 TripAbhi. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <a className="hover:text-white font-satoshi" href="#">
              Privacy
            </a>
            <Link
              className="hover:text-white font-satoshi"
              href="/terms-and-conditions"
            >
              Terms
            </Link>
            <a className="hover:text-white font-satoshi" href="#">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
