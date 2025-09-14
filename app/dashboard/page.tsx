import DashboardPage from "@/components/dashboard/DashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default Page;
