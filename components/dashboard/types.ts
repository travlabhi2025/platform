export type SummaryCardData = {
  label: string;
  value: string | number;
};

export type Trip = {
  id: string;
  title: string;
  date: string;
  status: "Active" | "Upcoming" | "Completed";
  bookings: number;
};

export type Booking = {
  travelerName: string;
  trip: string;
  bookingDate: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export type Earnings = {
  monthly: string;
  payoutSummary: string;
};

export type Profile = {
  name: string;
  avatar: string;
  verified: boolean;
  kycVerified: boolean;
  badge: string;
};
