import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <UnifiedDashboard />
    </ProtectedRoute>
  );
}
