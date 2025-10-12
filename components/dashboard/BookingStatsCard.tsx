"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface BookingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const BookingStatsCard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/bookings/stats?organizerId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Booking Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Booking Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Failed to load statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  const approvalRate =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const pendingRate =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Booking Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <p className="text-sm text-blue-700">Total Bookings</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {approvalRate}%
            </div>
            <p className="text-sm text-green-700">Approval Rate</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Pending Approval
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-yellow-600">
                {stats.pending}
              </span>
              <span className="text-xs text-yellow-600">({pendingRate}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Approved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">
                {stats.approved}
              </span>
              <span className="text-xs text-green-600">
                ({Math.round((stats.approved / stats.total) * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">
                {stats.approved}
              </span>
              <span className="text-xs text-blue-600">
                ({Math.round((stats.approved / stats.total) * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {stats.rejected}
              </span>
              <span className="text-xs text-red-600">
                ({Math.round((stats.rejected / stats.total) * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                Cancelled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-600">
                {stats.rejected}
              </span>
              <span className="text-xs text-gray-600">
                ({Math.round((stats.rejected / stats.total) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {stats.pending > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              You have{" "}
              <span className="font-semibold text-yellow-600">
                {stats.pending}
              </span>{" "}
              pending booking{stats.pending !== 1 ? "s" : ""} requiring
              approval.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/bookings")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Review Pending Bookings →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingStatsCard;
