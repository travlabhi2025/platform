import BookingPage from "@/components/booking/BookingPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <BookingPage tripId={id} />
    </ProtectedRoute>
  );
}
