"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "./DashboardHeader";
import MyTripCard from "./MyTripCard";
import { useAuth } from "@/lib/auth-context";
import { useMyBookings } from "@/lib/hooks";
import { Booking } from "@/lib/firestore";
import {
  Plane,
  Clock,
  CheckCircle2,
  Heart,
  ArrowRight,
  Compass,
  Rocket,
  Bookmark,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const { userProfile, user } = useAuth();
  const { bookings: myBookings, loading: bookingsLoading } = useMyBookings();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Placeholder bookings for testing
  /*
  const placeholderBookings: Array<
    Booking & {
      tripName?: string;
      organizer?: string;
      startDate?: string;
      endDate?: string;
      duration?: string;
      imageUrl?: string;
      participants?: Array<{ avatarUrl?: string; name?: string }>;
      participantsCount?: number;
      isFavorite?: boolean;
    }
  > = [
    {
      id: "placeholder-1",
      tripId: "trip-1",
      tripName: "Bali Bliss 2024",
      organizer: "TripAbhi",
      startDate: "2024-10-12",
      endDate: "2024-10-20",
      duration: "8 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 45000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZiF7S8UDTy5gQCiCEEEoAnSRKzkB-iy5M9jG6k_zcB1F0NaCPEgIF5F-JwEVg7Av9_LKOOHW9dNGKDGQixc2_tMzDoWrFnhNNx7ey8VDm9wXQrAAylKn6kVmGr2wLsv5mA-P-A6dOK3_pkZc0VSZcy7DJR89BR6FGMFA9m8tmtf3NHzIKubMDIYAbWLHQGVak8xQJ7PthdpFZRWmLr2Ov10dKur2nM-nudShhABEKIFVjk4ODakpDDvdom4zcBPTqrSveOBC2NOl",
      participants: [
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        },
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
        },
      ],
      participantsCount: 4,
      isFavorite: true,
    },
    {
      id: "placeholder-2",
      tripId: "trip-2",
      tripName: "Snowy Peaks Trek",
      organizer: "HikeMasters",
      startDate: "2024-12-05",
      endDate: "2024-12-10",
      duration: "5 Days",
      status: "Pending" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 1,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 85000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      participants: [],
      isFavorite: false,
    },
    {
      id: "placeholder-3",
      tripId: "trip-3",
      tripName: "Tokyo Culinary Experience",
      organizer: "Foodie Adventures",
      startDate: "2024-11-10",
      endDate: "2024-11-18",
      duration: "8 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 3,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 120000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      participants: [
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        },
      ],
      participantsCount: 3,
      isFavorite: false,
    },
    {
      id: "placeholder-4",
      tripId: "trip-4",
      tripName: "Patagonia Trekking 2024",
      organizer: "Wild Adventures",
      startDate: "2024-12-01",
      endDate: "2024-12-15",
      duration: "14 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 150000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      participants: [],
      isFavorite: true,
    },
    {
      id: "placeholder-5",
      tripId: "trip-5",
      tripName: "Santorini Sunset Experience",
      organizer: "Mediterranean Tours",
      startDate: "2025-01-15",
      endDate: "2025-01-22",
      duration: "7 Days",
      status: "Pending" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 95000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      participants: [],
      isFavorite: false,
    },
    {
      id: "placeholder-6",
      tripId: "trip-6",
      tripName: "Iceland Northern Lights Tour",
      organizer: "Arctic Expeditions",
      startDate: "2025-02-10",
      endDate: "2025-02-18",
      duration: "8 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 1,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 180000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      participants: [],
      isFavorite: false,
    },
    {
      id: "placeholder-7",
      tripId: "trip-7",
      tripName: "Swiss Alps Winter Wonderland",
      organizer: "Alpine Escapes",
      startDate: "2025-01-05",
      endDate: "2025-01-12",
      duration: "7 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 4,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 220000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      participants: [
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        },
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
        },
      ],
      participantsCount: 2,
      isFavorite: true,
    },
    {
      id: "placeholder-8",
      tripId: "trip-8",
      tripName: "Morocco Desert Safari",
      organizer: "Desert Nomads",
      startDate: "2025-03-01",
      endDate: "2025-03-10",
      duration: "9 Days",
      status: "Pending" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 110000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZiF7S8UDTy5gQCiCEEEoAnSRKzkB-iy5M9jG6k_zcB1F0NaCPEgIF5F-JwEVg7Av9_LKOOHW9dNGKDGQixc2_tMzDoWrFnhNNx7ey8VDm9wXQrAAylKn6kVmGr2wLsv5mA-P-A6dOK3_pkZc0VSZcy7DJR89BR6FGMFA9m8tmtf3NHzIKubMDIYAbWLHQGVak8xQJ7PthdpFZRWmLr2Ov10dKur2nM-nudShhABEKIFVjk4ODakpDDvdom4zcBPTqrSveOBC2NOl",
      participants: [],
      isFavorite: false,
    },
    {
      id: "placeholder-9",
      tripId: "trip-9",
      tripName: "New Zealand Road Trip",
      organizer: "Kiwi Adventures",
      startDate: "2025-02-20",
      endDate: "2025-03-05",
      duration: "13 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 3,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 250000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      participants: [
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        },
      ],
      participantsCount: 1,
      isFavorite: false,
    },
    {
      id: "placeholder-10",
      tripId: "trip-10",
      tripName: "Dubai Luxury Experience",
      organizer: "Emirates Travel",
      startDate: "2025-01-25",
      endDate: "2025-01-30",
      duration: "5 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 140000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      participants: [],
      isFavorite: true,
    },
    {
      id: "placeholder-11",
      tripId: "trip-11",
      tripName: "Nepal Everest Base Camp",
      organizer: "Himalayan Treks",
      startDate: "2025-03-15",
      endDate: "2025-03-30",
      duration: "15 Days",
      status: "Pending" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 1,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 95000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      participants: [],
      isFavorite: false,
    },
    {
      id: "placeholder-12",
      tripId: "trip-12",
      tripName: "Maldives Paradise Retreat",
      organizer: "Ocean Dreams",
      startDate: "2025-02-14",
      endDate: "2025-02-21",
      duration: "7 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 175000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      participants: [
        {
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        },
      ],
      participantsCount: 1,
      isFavorite: true,
    },
    {
      id: "placeholder-13",
      tripId: "trip-13",
      tripName: "Peru Machu Picchu Adventure",
      organizer: "Andes Explorers",
      startDate: "2025-04-10",
      endDate: "2025-04-20",
      duration: "10 Days",
      status: "Approved" as const,
      travelerName: userProfile?.name || "John Doe",
      travelerEmail: userProfile?.email || "john@example.com",
      travelerPhone: "+91 1234567890",
      groupSize: 2,
      bookingDate: { seconds: Math.floor(Date.now() / 1000) } as any,
      totalAmount: 135000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      participants: [],
      isFavorite: false,
    },
  ];
  */

  // Use placeholder bookings if no real bookings, otherwise use real bookings
  const displayBookings = myBookings;
  // const displayBookings =
  //   myBookings.length > 0 ? myBookings : placeholderBookings;

  const handleSendOtp = async () => {
    if (!userProfile?.email) return;

    setSendingOtp(true);
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (user) {
        const { getAuthHeaders } = await import("@/lib/auth-helpers");
        const authHeaders = await getAuthHeaders();
        headers = { ...headers, ...authHeaders };
      }

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: userProfile.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      setShowOtpInput(true);
      toast.success(`Verification code sent to ${userProfile.email}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!userProfile?.email || !otp) return;

    setVerifying(true);
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (user) {
        const { getAuthHeaders } = await import("@/lib/auth-helpers");
        const authHeaders = await getAuthHeaders();
        headers = { ...headers, ...authHeaders };
      }

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: userProfile.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      toast.success("Email verified successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // Calculate stats from display bookings (placeholder or real)
  const upcomingTrips = displayBookings.filter(
    (b) => b.status === "Approved"
  ).length;
  const pendingTrips = displayBookings.filter(
    (b) => b.status === "Pending"
  ).length;
  const completedTrips = 0; // Bookings don't have a "Completed" status

  const firstName = userProfile?.name?.split(" ")[0] || "Traveler";

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-background-light">
        <DashboardHeader />
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-6 md:pt-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light text-[#112838] transition-colors duration-200">
      <DashboardHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-6 md:pt-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#112838] tracking-tight mb-2 font-satoshi-black">
                Hey, {firstName}{" "}
                <span className="inline-block hover:animate-bounce cursor-default">
                  👋
                </span>
              </h1>
              <p className="text-lg text-slate-500 font-medium font-satoshi">
                Here&apos;s what&apos;s coming up for you
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#2b9dee]/50 text-[#112838] px-4 py-2.5 rounded-lg shadow-sm font-semibold text-sm transition-all hover:shadow-md font-satoshi-bold"
              >
                <Compass className="w-5 h-5 text-[#2b9dee]" />
                Explore
              </Link>
            </div>
          </div>
        </section>

        {/* Verification Banner */}
        {userProfile && !userProfile.emailVerified && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg font-satoshi-bold">
                    Verify your email address
                  </h3>
                  <p className="text-blue-800 text-sm mt-1 font-satoshi">
                    You need to verify your email address to book trips on
                    TripAbhi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {!showOtpInput ? (
                  <Button
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="bg-[#2b9dee] hover:bg-[#1a8cd8] text-white w-full md:w-auto font-satoshi-bold"
                  >
                    {sendingOtp ? "Sending..." : "Verify Now"}
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-white border-blue-300 w-32 font-satoshi"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={verifying || !otp}
                      className="bg-[#2b9dee] hover:bg-[#1a8cd8] text-white font-satoshi-bold"
                    >
                      {verifying ? "..." : "Submit"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 group hover:border-[#2b9dee]/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-[#2b9dee] group-hover:scale-110 transition-transform">
                <Plane className="w-7 h-7" />
              </div>
              {/* TODO: Enable this badge when functionality to track new trips is added */}
              {/* <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full font-satoshi-bold">
                +1 New
              </span> */}
            </div>
            <div>
              <h3 className="text-4xl font-black text-[#112838] mb-1 font-satoshi-black">
                {upcomingTrips}
              </h3>
              <p className="text-slate-500 font-medium text-sm tracking-wide font-satoshi-medium">
                Upcoming Trips
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 group hover:border-orange-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-50 p-3 rounded-lg text-orange-500 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-black text-[#112838] mb-1 font-satoshi-black">
                {pendingTrips}
              </h3>
              <p className="text-slate-500 font-medium text-sm tracking-wide font-satoshi-medium">
                Pending Approval
              </p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 group hover:border-green-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-3 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-black text-[#112838] mb-1 font-satoshi-black">
                {completedTrips}
              </h3>
              <p className="text-slate-500 font-medium text-sm tracking-wide font-satoshi-medium">
                Completed Trips
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile: Quick Actions First */}
          <div className="lg:hidden space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#112838] flex items-center gap-2 mb-6 font-satoshi-bold">
                <span className="w-1.5 h-6 bg-[#112838] rounded-full"></span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {/* Action Card 1 */}
                <Link
                  href="/"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#112838] to-[#1a3c54] p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Compass className="w-[120px] h-[120px]" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                      <Rocket className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 font-satoshi-bold">
                        Explore New Trips
                      </h3>
                      <p className="text-slate-300 text-sm font-satoshi">
                        Discover trending destinations for 2024
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Action Card 2 */}
                <Link
                  href="/trips-todo"
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-soft transition-all hover:border-[#2b9dee]/50 hover:shadow-hover"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-[#2b9dee]">
                    <Bookmark className="w-[100px] h-[100px]" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="bg-[#2b9dee]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#2b9dee] group-hover:bg-[#2b9dee] group-hover:text-white transition-all">
                      <Heart className="w-7 h-7 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#112838] mb-1 font-satoshi-bold">
                        Saved Trips
                      </h3>
                      <p className="text-slate-500 text-sm font-satoshi">
                        Your saved destinations
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Left Column: My Trips */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between lg:sticky lg:mb-0 lg:top-16 lg:z-40 lg:bg-background-light lg:py-2 lg:-mx-4 lg:px-4 lg:border-b lg:border-slate-100">
              <h2 className="text-2xl font-bold text-[#112838] flex items-center gap-2 py-4 font-satoshi-bold">
                <span className="w-1.5 h-6 bg-[#112838] rounded-full"></span>
                My Trips
              </h2>
              {displayBookings.length > 0 && (
                <Link
                  href="#"
                  className="text-[#2b9dee] font-semibold text-sm hover:underline flex items-center gap-1 font-satoshi-bold"
                >
                  View History{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {displayBookings.length > 0 ? (
                displayBookings.map((booking) => {
                  return (
                    <MyTripCard
                      key={booking.id || ""}
                      id={booking.id || ""}
                      tripId={booking.tripId}
                      tripName={(booking as any).tripName || `Trip ${booking.tripId}`}
                      organizer={(booking as any).organizer}
                      startDate={(booking as any).startDate}
                      endDate={(booking as any).endDate}
                      duration={(booking as any).duration}
                      status={booking.status}
                      imageUrl={(booking as any).imageUrl}
                      participants={(booking as any).participants}
                      participantsCount={(booking as any).participantsCount}
                      isFavorite={(booking as any).isFavorite}
                      onFavoriteToggle={() => {
                        // Handle favorite toggle
                        console.log("Toggle favorite for", booking.id);
                      }}
                    />
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 md:p-16 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#2b9dee]/10 rounded-full blur-2xl"></div>
                        <div className="relative bg-gradient-to-br from-[#2b9dee]/20 to-blue-400/20 p-6 rounded-full">
                          <MapPin className="w-16 h-16 text-[#2b9dee]" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#112838] mb-3 font-satoshi-bold">
                      You don&apos;t have any trip planned
                    </h3>
                    <p className="text-slate-500 text-lg mb-8 font-satoshi">
                      Start exploring amazing destinations and plan your next
                      adventure!
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-[#2b9dee] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:shadow-lg shadow-[#2b9dee]/20 font-satoshi-bold"
                    >
                      <Compass className="w-5 h-5" />
                      Explore Trips
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions - Desktop Only, Sticky */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-16 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#112838] flex items-center h-full gap-2 font-satoshi-bold lg:py-6">
                  <span className="w-1.5 h-6 bg-[#112838] rounded-full"></span>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {/* Action Card 1 */}
                  <Link
                    href="/"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#112838] to-[#1a3c54] p-6 text-white shadow-lg transition-all hover:border-[#2b9dee]/50 hover:shadow-hover"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Compass className="w-[120px] h-[120px]" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <Rocket className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 font-satoshi-bold">
                          Explore New Trips
                        </h3>
                        <p className="text-slate-300 text-sm font-satoshi">
                          Discover trending destinations for 2024
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Action Card 2 */}
                  <Link
                    href="/trips-todo"
                    className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-soft transition-all hover:border-[#2b9dee]/50 hover:shadow-hover"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity text-[#2b9dee]">
                      <Bookmark className="w-[100px] h-[100px]" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                      <div className="bg-[#2b9dee]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#2b9dee] group-hover:bg-[#2b9dee] group-hover:text-white transition-all">
                        <Heart className="w-7 h-7 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#112838] mb-1 font-satoshi-bold">
                          Saved Trips
                        </h3>
                        <p className="text-slate-500 text-sm font-satoshi">
                          Your saved destinations
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
