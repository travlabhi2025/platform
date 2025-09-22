import { Trip } from "./types";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyTripsTable({
  trips,
  onTripsUpdate,
}: {
  trips: Trip[];
  onTripsUpdate?: () => void;
}) {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    type: "duplicate" | "delete" | null;
    trip: Trip | null;
    loading: boolean;
  }>({ type: null, trip: null, loading: false });

  const copyTripLink = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not available");
      return;
    }

    try {
      const tripUrl = `${window.location.origin}/trip/${tripId}`;
      await navigator.clipboard.writeText(tripUrl);
      toast.success("Trip link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openConfirm = (type: "duplicate" | "delete", trip: Trip) => {
    setConfirmState({ type, trip, loading: false });
  };

  const closeConfirm = () =>
    setConfirmState({ type: null, trip: null, loading: false });

  const refreshTrips = async () => {
    if (!onTripsUpdate) return;

    setIsRefreshing(true);
    try {
      await onTripsUpdate();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (tripId: string, newStatus: string) => {
    if (!user) return;

    setUpdatingStatus(tripId);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      toast.success("Status updated successfully!");
      await refreshTrips();
    } catch (error: unknown) {
      console.error("Status update error:", error);
      toast.error((error as Error).message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const generateCopyTitle = (originalTitle: string) => {
    // Normalize trailing (Copy) or (Copy-n) segments, case-insensitive
    const suffixRegex = /\s*\(copy(?:-(\d+))?\)$/i;
    let base = (originalTitle || "").trim();
    let maxNum = 0;

    // Remove any number of trailing copy suffixes and track the highest number
    // Handles cases like "Title (Copy)", "Title (Copy-2)", or even
    // bad historical titles like "Title (Copy-2) (Copy)"
    while (suffixRegex.test(base)) {
      const match = base.match(suffixRegex);
      const n = match && match[1] ? parseInt(match[1] as string, 10) : 1;
      if (!Number.isNaN(n)) {
        maxNum = Math.max(maxNum, n);
      }
      base = base.replace(suffixRegex, "").trim();
    }

    if (maxNum === 0) {
      return `${base} (Copy)`;
    }

    return `${base} (Copy-${maxNum + 1})`;
  };

  const handleDuplicate = async () => {
    if (!confirmState.trip || !user) return;
    try {
      setConfirmState((s) => ({ ...s, loading: true }));

      // First, fetch the complete trip data
      const tripResponse = await fetch(`/api/trips/${confirmState.trip.id}`);
      if (!tripResponse.ok) {
        throw new Error("Failed to fetch trip details");
      }
      const completeTripData = await tripResponse.json();

      // Generate the new title with proper copy logic
      const newTitle = generateCopyTitle(completeTripData.title);

      // Create the duplicate with all data
      const duplicatedTrip = {
        ...completeTripData,
        id: undefined, // Let Firestore generate new ID
        title: newTitle,
        bookings: 0,
        status: "Upcoming",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...duplicatedTrip,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to duplicate trip");
      }

      toast.success("Trip duplicated successfully!");
      await refreshTrips();
    } catch (e: unknown) {
      console.error("Duplicate error:", e);
      toast.error((e as Error).message || "Failed to duplicate trip");
    } finally {
      closeConfirm();
    }
  };

  const handleDelete = async () => {
    if (!confirmState.trip || !user) return;
    try {
      setConfirmState((s) => ({ ...s, loading: true }));
      const response = await fetch(`/api/trips/${confirmState.trip.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      if (!response.ok) throw new Error("Failed to delete trip");
      toast.success("Trip deleted");
      await refreshTrips();
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to delete");
    } finally {
      closeConfirm();
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
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden relative">
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
          <div className="h-full bg-primary animate-pulse"></div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
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
                  {t.id ? (
                    <Select
                      value={t.status}
                      onValueChange={(value) => handleStatusChange(t.id, value)}
                      disabled={updatingStatus === t.id}
                    >
                      <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent shadow-none hover:bg-slate-50">
                        <SelectValue>
                          <span
                            className={
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border " +
                              (t.status === "Active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : t.status === "Upcoming"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : t.status === "Completed"
                                ? "bg-gray-100 text-gray-800 border-gray-200"
                                : "bg-red-100 text-red-800 border-red-200")
                            }
                          >
                            {updatingStatus === t.id ? "Updating..." : t.status}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border " +
                        (t.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : t.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : t.status === "Completed"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-red-100 text-red-800 border-red-200")
                      }
                    >
                      {t.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {t.bookings > 0 ? (
                    <Link
                      href={`/dashboard/bookings?tripId=${t.id}`}
                      className="text-slate-800 hover:text-primary hover:underline flex items-center gap-1"
                      title="View bookings for this trip"
                    >
                      {t.bookings}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-slate-800">{t.bookings}</span>
                  )}
                </td>
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
                  {t.id ? (
                    <>
                      <Link
                        href={`/edit-trip/${t.id}`}
                        className="underline text-xs mr-2 hover:text-primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => openConfirm("duplicate", t)}
                        className="underline text-xs mr-2 hover:text-primary"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => openConfirm("delete", t)}
                        className="underline text-xs hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modals */}
      <AlertDialog
        open={!!confirmState.type}
        onOpenChange={(open) => {
          if (!open) closeConfirm();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmState.type === "duplicate"
                ? "Duplicate Trip"
                : "Delete Trip"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmState.type === "duplicate"
                ? `Create a copy of "${
                    confirmState.trip?.title
                  }"? The new trip will be named "${generateCopyTitle(
                    confirmState.trip?.title || ""
                  )}".`
                : `This will permanently delete "${confirmState.trip?.title}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {confirmState.type === "duplicate" ? (
              <AlertDialogAction
                onClick={handleDuplicate}
                disabled={confirmState.loading}
              >
                {confirmState.loading ? "Duplicating..." : "Duplicate"}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={handleDelete}
                disabled={confirmState.loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {confirmState.loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
