"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTrip } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import SiteHeader from "@/components/common/SiteHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination, { usePagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

// Component for displaying bookings in a table row
function BookingTableRow({
  booking,
}: {
  booking: {
    id: string;
    tripId: string;
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    groupSize: number;
    preferences?: string;
    totalAmount: number;
    status: string;
    bookingDate: { seconds: number } | string;
  };
}) {
  const { trip } = useTrip(booking.tripId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (date: { seconds: number } | string) => {
    try {
      if (typeof date === "object" && date.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString();
      }
      return new Date(date as string).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium w-[20%]">
        <div className="flex flex-col">
          <span className="font-mono text-sm">{booking.id}</span>
          <span className="text-xs text-gray-500">
            {formatDate(booking.bookingDate)}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[25%]">
        <div className="flex flex-col">
          <span className="font-medium">{trip?.title || "Loading..."}</span>
          <span className="text-sm text-gray-500 truncate">
            {booking.tripId}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[20%]">
        <div className="flex flex-col">
          <span className="font-medium">{booking.travelerName}</span>
          <span className="text-sm text-gray-500 truncate">
            {booking.travelerEmail}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center w-[10%]">
        {booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}
      </TableCell>
      <TableCell className="text-right font-medium w-[12%]">
        ₹{booking.totalAmount.toLocaleString()}
      </TableCell>
      <TableCell className="w-[8%]">
        <Badge variant={getStatusBadgeVariant(booking.status)}>
          {booking.status}
        </Badge>
      </TableCell>
      <TableCell className="w-[5%]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = `/trip/${booking.tripId}`)}
        >
          View Trip
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function BookingStatusPage() {
  const { userProfile } = useAuth();
  const [searchType, setSearchType] = useState<"id" | "details">("details");
  const [bookingId, setBookingId] = useState("");
  const [tripName, setTripName] = useState("");
  const [hostName, setHostName] = useState("");

  const [booking, setBooking] = useState<{
    id: string;
    tripId: string;
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    groupSize: number;
    preferences?: string;
    totalAmount: number;
    status: string;
    bookingDate: { seconds: number } | string;
  } | null>(null);

  const [bookings, setBookings] = useState<
    Array<{
      id: string;
      tripId: string;
      travelerName: string;
      travelerEmail: string;
      travelerPhone: string;
      groupSize: number;
      preferences?: string;
      totalAmount: number;
      status: string;
      bookingDate: { seconds: number } | string;
    }>
  >([]);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    paginatedItems: currentBookings,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(bookings, 10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // User email is automatically used from profile
  const userEmail = userProfile?.email || "";

  // Fetch trip details when we have a booking
  const { trip } = useTrip(booking?.tripId || "");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchType === "id") {
      if (!bookingId.trim()) {
        toast.error("Please enter a booking ID");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        setBookings([]);

        const response = await fetch(`/api/bookings/${bookingId.trim()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch booking");
        }

        const bookingData = await response.json();
        setBooking(bookingData);
        toast.success("Booking found!");
      } catch (err: unknown) {
        const errorMessage = (err as Error).message || "Something went wrong";
        setError(errorMessage);
        setBooking(null);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      if (!userEmail.trim()) {
        toast.error("Please sign in to search for your bookings");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        setBooking(null);

        // Get auth headers for authenticated search
        const { getAuthHeaders } = await import("@/lib/auth-helpers");
        const authHeaders = await getAuthHeaders();

        const response = await fetch("/api/bookings/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            email: userEmail.trim(),
            tripName: tripName.trim() || undefined,
            hostName: hostName.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to search bookings");
        }

        const searchData = await response.json();
        setBookings(searchData.bookings || []);

        if (searchData.count === 0) {
          toast.info("No bookings found matching your criteria");
        } else {
          toast.success(`Found ${searchData.count} booking(s)`);
        }
      } catch (err: unknown) {
        const errorMessage = (err as Error).message || "Something went wrong";
        setError(errorMessage);
        setBookings([]);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setBookingId("");
    setTripName("");
    setHostName("");
    setBooking(null);
    setBookings([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-16 max-w-7xl">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-garetheavy text-primary text-3xl md:text-4xl mb-4">
            Check Booking Status
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your booking ID to view the current status of your booking
            request
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Find Your Booking</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search Type Selector */}
            <div className="mb-6">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={searchType === "id" ? "default" : "outline"}
                  onClick={() => setSearchType("id")}
                  className="flex-1"
                >
                  By Booking ID
                </Button>
                <Button
                  type="button"
                  variant={searchType === "details" ? "default" : "outline"}
                  onClick={() => setSearchType("details")}
                  className="flex-1"
                >
                  By Contact Details
                </Button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {searchType === "id" ? (
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID *</Label>
                  <Input
                    id="bookingId"
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Enter your booking ID"
                    className="text-center font-mono"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Your booking ID was provided when you submitted your booking
                    request
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!userEmail ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Please sign in to search for your bookings.
                      </p>
                      <Link
                        href="/signin"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userEmail}
                          disabled
                          className="bg-gray-50 text-gray-600"
                        />
                        <p className="text-sm text-gray-500">
                          Bookings will be searched for this email address
                        </p>
                      </div>
                    </>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-700">
                      Optional Filters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tripName">Trip Name</Label>
                        <Input
                          id="tripName"
                          type="text"
                          value={tripName}
                          onChange={(e) => setTripName(e.target.value)}
                          placeholder="Search by trip name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hostName">Host Name</Label>
                        <Input
                          id="hostName"
                          type="text"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          placeholder="Search by host name"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      These filters help narrow down results if you have
                      multiple bookings
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  type="submit"
                  disabled={loading || (searchType === "details" && !userEmail)}
                  className="bg-primary text-white"
                >
                  {loading ? "Searching..." : "Search Bookings"}
                </Button>
                {hasSearched && (
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-8 max-w-2xl mx-auto">
            {loading ? (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-gray-500">
                    Searching for your booking...
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-red-600 mb-4">{error}</div>
                  <Button variant="outline" onClick={handleClear}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-green-700">
                    Found {bookings.length} Booking
                    {bookings.length > 1 ? "s" : ""}
                  </h3>
                </div>

                {/* Results Table */}
                <div className="border rounded-lg overflow-hidden w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[20%]">Booking ID</TableHead>
                        <TableHead className="w-[25%]">Trip</TableHead>
                        <TableHead className="w-[20%]">Traveler</TableHead>
                        <TableHead className="text-center w-[10%]">
                          Group Size
                        </TableHead>
                        <TableHead className="text-right w-[12%]">
                          Amount
                        </TableHead>
                        <TableHead className="w-[8%]">Status</TableHead>
                        <TableHead className="w-[5%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentBookings.map((bookingItem) => (
                        <BookingTableRow
                          key={bookingItem.id}
                          booking={bookingItem}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsPerPageOptions={[5, 10, 20]}
                  />
                </div>
              </div>
            ) : booking ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Booking Found!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Booking Details
                    </h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Booking ID:
                        </span>
                        <span className="text-blue-700 font-mono">
                          {booking.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Trip:</span>
                        <span className="text-blue-700">
                          {trip?.title || "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Host:</span>
                        <span className="text-blue-700">
                          {trip?.host?.name || "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Traveler:
                        </span>
                        <span className="text-blue-700">
                          {booking.travelerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Email:
                        </span>
                        <span className="text-blue-700">
                          {booking.travelerEmail}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Phone:
                        </span>
                        <span className="text-blue-700">
                          {booking.travelerPhone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Group Size:
                        </span>
                        <span className="text-blue-700">
                          {booking.groupSize} people
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Total Amount:
                        </span>
                        <span className="text-blue-700 font-semibold">
                          ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">
                          Booking Date:
                        </span>
                        <span className="text-blue-700">
                          {(() => {
                            try {
                              // Handle Firestore Timestamp
                              if (
                                typeof booking.bookingDate === "object" &&
                                booking.bookingDate.seconds
                              ) {
                                return new Date(
                                  booking.bookingDate.seconds * 1000
                                ).toLocaleDateString();
                              }
                              // Handle regular Date string
                              return new Date(
                                booking.bookingDate as string
                              ).toLocaleDateString();
                            } catch {
                              return "Invalid Date";
                            }
                          })()}
                        </span>
                      </div>
                      {booking.preferences && (
                        <div className="flex flex-col">
                          <span className="font-medium text-blue-800">
                            Preferences:
                          </span>
                          <span className="text-blue-700 mt-1">
                            {booking.preferences}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={() =>
                        (window.location.href = `/trip/${booking.tripId}`)
                      }
                      className="bg-primary text-white"
                    >
                      View Trip Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
