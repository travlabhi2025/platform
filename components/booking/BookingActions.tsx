"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Booking {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  groupSize: number;
  status: "Pending" | "Approved" | "Rejected";
  bookingDate: string | { seconds: number; nanoseconds: number };
  totalAmount: number;
  rejectionReason?: string;
}

interface BookingActionsProps {
  booking: Booking;
  onStatusUpdate: () => void;
  showStatus?: boolean;
}

const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  onStatusUpdate,
  showStatus = true,
}) => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApproval = async (action: "approve" | "reject") => {
    if (!user) return;

    try {
      setActionLoading(true);

      // Get auth headers with JWT token
      const { getAuthHeaders } = await import("@/lib/auth-helpers");
      const authHeaders = await getAuthHeaders();

      const response = await fetch("/api/bookings/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          action,
          userId: user.uid,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        onStatusUpdate();
        setShowRejectDialog(false);
        setRejectionReason("");
      } else {
        const errorData = await response.json();
        console.error("Error updating booking:", errorData.error);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Approved":
        return "Approved";
      case "Pending":
        return "Pending";
      case "Rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {showStatus && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusIcon(booking.status)}
            {getStatusText(booking.status)}
          </span>
        )}

        {booking.status === "Pending" && (
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => handleApproval("approve")}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              disabled={actionLoading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting this booking:
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleApproval("reject")}
              disabled={actionLoading || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingActions;
