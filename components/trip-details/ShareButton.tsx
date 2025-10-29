"use client";

import React from "react";
import { Share2 } from "lucide-react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const shareUrl =
          typeof window !== "undefined" && !url ? window.location.href : url;
        if (navigator.share) {
          navigator
            .share({ title, url: shareUrl || window.location.href })
            .catch(() =>
              navigator.clipboard?.writeText(shareUrl || window.location.href)
            );
        } else {
          navigator.clipboard?.writeText(shareUrl || window.location.href);
        }
      }}
      className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
