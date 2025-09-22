import BookingConfirmationPage from "@/components/booking/BookingConfirmationPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BookingConfirmationPage bookingId={id} />;
}
