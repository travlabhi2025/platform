export type SummaryCardData = {
  label: string;
  value: string | number;
  link?: string;
  highlight?: boolean;
};

export type Trip = {
  id: string;
  title: string;
  date: string;
  status: "Active" | "Upcoming" | "Completed";
  bookings: number;
};

export type Booking = {
  id: string;
  travelerName: string;
  trip: string;
  bookingDate: string;
  status: "Pending" | "Approved" | "Rejected";
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
  // Additional profile fields
  logo?: string;
  profilePicture?: string; // User's profile picture URL
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  bio?: string;
  company?: string;
  title?: string;
};
