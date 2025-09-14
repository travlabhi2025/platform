import { SummaryCardData, Trip, Booking, Earnings, Profile } from "./types";

export const summaryData: SummaryCardData[] = [
  { label: "Total Trips", value: 25 },
  { label: "Active Trips", value: 10 },
  { label: "Bookings", value: 150 },
  { label: "Earnings", value: "₹12,50,000" },
  { label: "Upcoming Trip Alerts", value: 3 },
];

export const tripsData: Trip[] = [
  {
    id: "trip-1",
    title: "Explore the Highlands",
    date: "2024-08-15",
    status: "Active",
    bookings: 25,
  },
  {
    id: "trip-2",
    title: "Coastal Adventure",
    date: "2024-09-01",
    status: "Upcoming",
    bookings: 15,
  },
  {
    id: "trip-3",
    title: "Mountain Trek",
    date: "2024-07-20",
    status: "Completed",
    bookings: 30,
  },
  {
    id: "trip-4",
    title: "City Exploration",
    date: "2024-10-10",
    status: "Upcoming",
    bookings: 20,
  },
  {
    id: "trip-5",
    title: "Desert Safari",
    date: "2024-11-05",
    status: "Active",
    bookings: 10,
  },
];

export const bookingsData: Booking[] = [
  {
    travelerName: "Emily Carter",
    trip: "Explore the Highlands",
    bookingDate: "2024-07-01",
    status: "Confirmed",
  },
  {
    travelerName: "David Lee",
    trip: "Coastal Adventure",
    bookingDate: "2024-07-15",
    status: "Pending",
  },
  {
    travelerName: "Olivia Brown",
    trip: "Mountain Trek",
    bookingDate: "2024-06-20",
    status: "Confirmed",
  },
  {
    travelerName: "Ethan Clark",
    trip: "City Exploration",
    bookingDate: "2024-08-01",
    status: "Confirmed",
  },
  {
    travelerName: "Sophia Green",
    trip: "Desert Safari",
    bookingDate: "2024-09-15",
    status: "Pending",
  },
];

export const earningsData: Earnings = {
  monthly: "₹2,50,000",
  payoutSummary: "₹10,00,000",
};

export const profileData: Profile = {
  name: "Sarah Miller",
  avatar: "/images/trip-discovery/profile-pic.png", // Assuming a path to the avatar
  verified: true,
  kycVerified: true,
  badge: "Top Organizer",
};
