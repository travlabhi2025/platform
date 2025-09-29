import DashboardPage from "@/components/dashboard/DashboardPage";
import OrganizerProtectedRoute from "@/components/auth/OrganizerProtectedRoute";

const Page = () => {
  return (
    <OrganizerProtectedRoute>
      <DashboardPage />
    </OrganizerProtectedRoute>
  );
};

export default Page;
