import BookingPage from "@/components/booking/BookingPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <BookingPage tripId={id} />;
}
