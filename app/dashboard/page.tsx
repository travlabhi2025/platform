import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <CustomerDashboard />
    </ProtectedRoute>
  );
}
