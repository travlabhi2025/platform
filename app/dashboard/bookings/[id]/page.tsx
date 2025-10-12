"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingApprovalPanel from "@/components/booking/BookingApprovalPanel";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DashboardBookingDetailsPage({}: PageProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
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

          <BookingApprovalPanel onBookingUpdate={() => {}} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
