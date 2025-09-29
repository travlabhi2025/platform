"use client";

import OrganizerProtectedRoute from "@/components/auth/OrganizerProtectedRoute";
import BookingManagementPage from "@/components/dashboard/BookingManagementPage";

export default function BookingsPage() {
  return (
    <OrganizerProtectedRoute>
      <BookingManagementPage />
    </OrganizerProtectedRoute>
  );
}
