"use client";

import Link from "next/link";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";

interface MyTripCardProps {
  id: string;
  tripId: string;
  tripName: string;
  organizer?: string;
  startDate?: string;
  endDate?: string;
  duration?: string; // e.g., "8 Days"
  status: "Approved" | "Pending" | "Rejected";
  imageUrl?: string;
  participants?: Array<{ avatarUrl?: string; name?: string }>;
  participantsCount?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function MyTripCard({
  id,
  tripId,
  tripName,
  organizer,
  startDate,
  endDate,
  duration,
  status,
  imageUrl,
  participants = [],
  participantsCount,
  isFavorite = false,
  onFavoriteToggle,
}: MyTripCardProps) {
  // Format date range
  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startFormatted = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endFormatted = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startFormatted} - ${endFormatted}`;
    }
    return null;
  };

  const dateRange = formatDateRange();
  const statusConfig = {
    Approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      dot: "bg-green-500",
      label: "Approved",
      pulse: false,
    },
    Pending: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
      dot: "bg-orange-500",
      label: "Pending Approval",
      pulse: true,
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
      label: "Rejected",
      pulse: false,
    },
  };

  const config = statusConfig[status];
  const hasParticipants = participants.length > 0 || participantsCount;

  return (
    <>
      <MaterialSymbolsLoader />
      <article className="group bg-white rounded-2xl shadow-soft hover:shadow-hover border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-64 h-48 sm:h-auto bg-slate-200 relative overflow-hidden">
          {imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-slate-500">
                image
              </span>
            </div>
          )}
          {duration && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-accent shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                calendar_month
              </span>
              {duration}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${config.dot} ${
                    config.pulse ? "animate-pulse" : ""
                  }`}
                ></span>
                {config.label}
              </span>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFavoriteToggle?.();
                }}
                className={`${
                  isFavorite
                    ? "text-slate-400 hover:text-primary"
                    : "text-slate-300 hover:text-primary"
                } cursor-pointer transition-colors`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isFavorite ? "fill" : ""
                  }`}
                >
                  favorite
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-accent mb-1 group-hover:text-primary transition-colors">
              {tripName}
            </h3>
            <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
              {organizer && (
                <>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                    {organizer}
                  </span>
                  {dateRange && <span>•</span>}
                </>
              )}
              {dateRange && <span>{dateRange}</span>}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
            {/* Participants */}
            {hasParticipants ? (
              <div className="flex -space-x-2">
                {participants.slice(0, 2).map((participant, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center"
                    style={
                      participant.avatarUrl
                        ? {
                            backgroundImage: `url(${participant.avatarUrl})`,
                          }
                        : {}
                    }
                  />
                ))}
                {(participantsCount || participants.length > 2) && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    +{participantsCount || participants.length - 2}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-[18px]">
                  group
                </span>
                <span>Solo Trip</span>
              </div>
            )}

            {/* Action Button */}
            {status === "Approved" ? (
              <Link
                href={`/trip/${tripId}`}
                className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                View Trip
              </Link>
            ) : (
              <Link
                href={`/trip/${tripId}`}
                className="bg-white border border-slate-200 hover:border-primary text-accent hover:text-primary text-sm font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
