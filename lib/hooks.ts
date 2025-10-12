"use client";

import { useState, useEffect } from "react";
import { Trip, Booking } from "./firestore";
import { Trip as DashboardTrip } from "@/components/dashboard/types";
import { getAuthHeaders } from "./auth-helpers";

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

  const fetchMyTrips = async (isRefetch = false) => {
    try {
      // Only set loading to true on initial load, not on refetch
      if (!isRefetch) {
        setLoading(true);
      }

      // Get auth headers with JWT token
      const headers = await getAuthHeaders();

      console.log("useMyTrips - Fetching trips with JWT authentication");

      const response = await fetch("/api/trips/my", {
        headers,
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
      if (!isRefetch) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const refetch = () => fetchMyTrips(true);

  return { trips, loading, error, refetch };
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

        // Get auth headers with JWT token
        const headers = await getAuthHeaders();

        const response = await fetch("/api/bookings", {
          headers,
        });
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
