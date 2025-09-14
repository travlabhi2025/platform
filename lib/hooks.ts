"use client";

import { useState, useEffect } from "react";
import { Trip, Booking } from "./firestore";
import { Trip as DashboardTrip } from "@/components/dashboard/types";

// Hook for fetching trips
export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        const response = await fetch("/api/trips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return { trips, loading, error };
}

// Hook for fetching user's trips
export function useMyTrips() {
  const [trips, setTrips] = useState<DashboardTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyTrips() {
      try {
        setLoading(true);

        // Get current user from Firebase Auth
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth();
        const user = auth.currentUser;

        console.log("useMyTrips - Current user:", user?.uid);

        if (!user) {
          setError("User not authenticated");
          return;
        }

        console.log("useMyTrips - Fetching trips for user:", user.uid);
        const response = await fetch("/api/trips/my", {
          headers: {
            "x-user-id": user.uid,
          },
        });

        console.log("useMyTrips - Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("useMyTrips - Error response:", errorData);
          throw new Error(errorData.error || "Failed to fetch trips");
        }
        const data = await response.json();
        console.log("useMyTrips - Received data:", data);
        setTrips(data);
      } catch (err) {
        console.error("useMyTrips - Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMyTrips();
  }, []);

  return { trips, loading, error };
}

// Hook for fetching a single trip
export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    async function fetchTrip() {
      try {
        setLoading(true);
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip");
        }
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  return { trip, loading, error };
}

// Hook for fetching user's bookings
export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMyBookings();
  }, []);

  return { bookings, loading, error };
}

// Hook for creating a booking
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    bookingData: Omit<Booking, "id" | "bookingDate" | "createdBy">
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const data = await response.json();
      return data.id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
}
