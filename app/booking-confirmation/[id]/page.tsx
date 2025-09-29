import BookingConfirmationPage from "@/components/booking/BookingConfirmationPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <ProtectedRoute>
      <BookingConfirmationPage bookingId={id} />
    </ProtectedRoute>
  );
}
