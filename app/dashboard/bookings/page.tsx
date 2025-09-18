"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingManagementPage from "@/components/dashboard/BookingManagementPage";

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingManagementPage />
    </ProtectedRoute>
  );
}
