import { Trip } from "./types";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function MyTripsTable({ trips }: { trips: Trip[] }) {
  const copyTripLink = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not available");
      return;
    }

    try {
      const tripUrl = `${window.location.origin}/trip-details/${tripId}`;
      await navigator.clipboard.writeText(tripUrl);
      toast.success("Trip link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  if (trips.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
        <div className="text-slate-500 text-lg mb-2">No trips created yet</div>
        <div className="text-slate-400 text-sm">
          Create your first trip to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="text-left font-medium px-4 py-3">Trip Title</th>
            <th className="text-left font-medium px-4 py-3">Date</th>
            <th className="text-left font-medium px-4 py-3">Status</th>
            <th className="text-left font-medium px-4 py-3">Bookings</th>
            <th className="text-left font-medium px-4 py-3">Link</th>
            <th className="text-left font-medium px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t, i) => (
            <tr key={t.id} className={i % 2 === 1 ? "bg-white" : "bg-white"}>
              <td className="px-4 py-3">
                {t.id ? (
                  <Link
                    href={`/trip-details/${t.id}`}
                    className="text-slate-800 hover:text-primary hover:underline flex items-center gap-1"
                  >
                    {t.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="text-slate-800 flex items-center gap-1">
                    {t.title}
                    <span className="text-xs text-red-500">(No ID)</span>
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{t.date}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border " +
                    (t.status === "Active"
                      ? "bg-slate-100 text-slate-800"
                      : t.status === "Upcoming"
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-100 text-slate-800")
                  }
                >
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-800">{t.bookings}</td>
              <td className="px-4 py-3">
                {t.id ? (
                  <button
                    onClick={() => copyTripLink(t.id)}
                    className="flex items-center gap-1 text-slate-600 hover:text-primary transition-colors"
                    title="Copy trip link"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">Copy Link</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">No Link</span>
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-primary">
                <button className="underline text-xs mr-2">Edit</button>
                <button className="underline text-xs mr-2">Duplicate</button>
                <button className="underline text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
