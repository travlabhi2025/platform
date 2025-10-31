"use client";

import MarkdownRenderer from "@/components/common/MarkdownRenderer";

interface ItineraryDescriptionProps {
  description: string;
}

/**
 * Client component wrapper for rendering markdown itinerary descriptions
 * Used in server components where markdown rendering is needed
 */
export default function ItineraryDescription({
  description,
}: ItineraryDescriptionProps) {
  if (!description || description.trim() === "") {
    return <p className="text-slate-500 italic">Details coming soon.</p>;
  }

  return <MarkdownRenderer content={description} />;
}

