import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Redirect trip-details to trip route for consistency
export default async function Page({ params }: PageProps) {
  const { id: tripId } = await params;
  redirect(`/trip/${tripId}`);
}
