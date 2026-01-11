"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";
import { Calendar, Users, Heart, Trash2, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedTrip {
  id: number;
  title: string;
  location: string;
  organizer: string;
  organizerAvatar: string;
  image: string;
  date: string;
  spots: number;
  badge: string | null;
  friends: string[];
  friendsCount?: number;
}

export default function TripsTodoPage() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  /*
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([
    {
      id: 1,
      title: "Bali Bliss 2024",
      location: "Bali, Indonesia",
      organizer: "TripAbhi",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZiF7S8UDTy5gQCiCEEEoAnSRKzkB-iy5M9jG6k_zcB1F0NaCPEgIF5F-JwEVg7Av9_LKOOHW9dNGKDGQixc2_tMzDoWrFnhNNx7ey8VDm9wXQrAAylKn6kVmGr2wLsv5mA-P-A6dOK3_pkZc0VSZcy7DJR89BR6FGMFA9m8tmtf3NHzIKubMDIYAbWLHQGVak8xQJ7PthdpFZRWmLr2Ov10dKur2nM-nudShhABEKIFVjk4ODakpDDvdom4zcBPTqrSveOBC2NOl",
      date: "Oct 12 - Oct 20",
      spots: 8,
      badge: "Popular",
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 2,
    },
    {
      id: 2,
      title: "Snowy Peaks Trek",
      location: "Himalayas, India",
      organizer: "HikeMasters",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      date: "Dec 5 - Dec 10",
      spots: 12,
      badge: null,
      friends: [],
    },
    {
      id: 3,
      title: "Tokyo Culinary Experience",
      location: "Tokyo, Japan",
      organizer: "Foodie Adventures",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      date: "Nov 10 - Nov 18",
      spots: 6,
      badge: "New",
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
      ],
      friendsCount: 1,
    },
    {
      id: 4,
      title: "Patagonia Trekking 2024",
      location: "Patagonia, Argentina",
      organizer: "Wild Adventures",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      date: "Dec 1 - Dec 15",
      spots: 10,
      badge: "Popular",
      friends: [],
    },
    {
      id: 5,
      title: "Santorini Sunset Experience",
      location: "Santorini, Greece",
      organizer: "Mediterranean Tours",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      date: "Jan 15 - Jan 22",
      spots: 15,
      badge: null,
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 3,
    },
    {
      id: 6,
      title: "Iceland Northern Lights Tour",
      location: "Reykjavik, Iceland",
      organizer: "Arctic Expeditions",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      date: "Feb 10 - Feb 18",
      spots: 8,
      badge: "Popular",
      friends: [],
    },
    {
      id: 7,
      title: "Swiss Alps Winter Wonderland",
      location: "Switzerland",
      organizer: "Alpine Escapes",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      date: "Jan 5 - Jan 12",
      spots: 12,
      badge: null,
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 2,
    },
    {
      id: 8,
      title: "Morocco Desert Safari",
      location: "Sahara Desert, Morocco",
      organizer: "Desert Nomads",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZiF7S8UDTy5gQCiCEEEoAnSRKzkB-iy5M9jG6k_zcB1F0NaCPEgIF5F-JwEVg7Av9_LKOOHW9dNGKDGQixc2_tMzDoWrFnhNNx7ey8VDm9wXQrAAylKn6kVmGr2wLsv5mA-P-A6dOK3_pkZc0VSZcy7DJR89BR6FGMFA9m8tmtf3NHzIKubMDIYAbWLHQGVak8xQJ7PthdpFZRWmLr2Ov10dKur2nM-nudShhABEKIFVjk4ODakpDDvdom4zcBPTqrSveOBC2NOl",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZiF7S8UDTy5gQCiCEEEoAnSRKzkB-iy5M9jG6k_zcB1F0NaCPEgIF5F-JwEVg7Av9_LKOOHW9dNGKDGQixc2_tMzDoWrFnhNNx7ey8VDm9wXQrAAylKn6kVmGr2wLsv5mA-P-A6dOK3_pkZc0VSZcy7DJR89BR6FGMFA9m8tmtf3NHzIKubMDIYAbWLHQGVak8xQJ7PthdpFZRWmLr2Ov10dKur2nM-nudShhABEKIFVjk4ODakpDDvdom4zcBPTqrSveOBC2NOl",
      date: "Mar 1 - Mar 10",
      spots: 10,
      badge: "New",
      friends: [],
    },
    {
      id: 9,
      title: "New Zealand Road Trip",
      location: "South Island, New Zealand",
      organizer: "Kiwi Adventures",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      date: "Feb 20 - Mar 5",
      spots: 6,
      badge: null,
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
      ],
      friendsCount: 1,
    },
    {
      id: 10,
      title: "Dubai Luxury Experience",
      location: "Dubai, UAE",
      organizer: "Emirates Travel",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      date: "Jan 25 - Jan 30",
      spots: 20,
      badge: "Popular",
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 4,
    },
    {
      id: 11,
      title: "Nepal Everest Base Camp",
      location: "Everest Region, Nepal",
      organizer: "Himalayan Treks",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1eJMuv3UgnKcs-IN_82112EKEI4aATfixOcUOHUQKRRqoXvamyhcDQDXHmfrSubWhmWLVRwgwbYZqXmNJQE4OX7Iy46gjiqCHzlwFWxK3N_eNItw4zpXTHBqG8DEfiSsgSx76EasvcoUxOMkIlCUpaIOk18tdOn4Xj7M4Y8dJsqMiKBT1wrsxuNYMuDnYLxn0J1KF3qi1YNCvvADnPZ-204N34JqCtX1UrxNh7QnIqpoc88V9qEHiuMTqZH6tHcmxnw-FYCuhuv2",
      date: "Mar 15 - Mar 30",
      spots: 8,
      badge: null,
      friends: [],
    },
    {
      id: 12,
      title: "Maldives Paradise Retreat",
      location: "Maldives",
      organizer: "Ocean Dreams",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      date: "Feb 14 - Feb 21",
      spots: 14,
      badge: "Popular",
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
      ],
      friendsCount: 1,
    },
    {
      id: 13,
      title: "Peru Machu Picchu Adventure",
      location: "Cusco, Peru",
      organizer: "Andes Explorers",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqLLbue8QI1HlQkSRZMQnhKzL6O73y1lEvLX0H2RegscS0-ZxspFobH-M6GCOcbebC5ju2Qeb1QnxVOpC-QnB51y3ju_dLBCSYVKU_0_iEPqv_G2Zx5l-t0CSabTrPkp2sc44TIGS5owm9wIkDT1fSq2ZG6sPJA6Ah9ie_BJN_2A6SjN4BUVFPERlmyqYstMsAYfZvYGJEcmq9SBzc2V0gu7PYPWS1ak-VtkrLYnme3tRwllGPX8uxvb-vwgrNN6F7uZtrwMyfMXq6",
      date: "Apr 10 - Apr 20",
      spots: 12,
      badge: null,
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 2,
    },
    {
      id: 14,
      title: "Norwegian Fjords Cruise",
      location: "Bergen, Norway",
      organizer: "Nordic Voyages",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5o_XVa8rgroeCZE8XpSUakIdSJk4Z1OdQ-ncaoVuoFsrSXGfPib7ejnAoVg0xLqMaJ-FH7S4Sbx5J286NsPkFRk3nOcHakSbNkz9IrrMIRtZHXB7UQkfpQPYkobm1BFYn-YFvi_T8Lo3aSOljnSQD16WyAmTLrpxOZCuBkrGFoHfzDU5XvGP6sLybt62jinqHztP5f9-ouJZKJEe3KZltY9ln1Zp6TbYdURV2-a-86FRuK_hsabfFIk9i2TxznHM5maIQwnPEzhA",
      date: "May 1 - May 10",
      spots: 16,
      badge: "New",
      friends: [],
    },
    {
      id: 15,
      title: "Vietnam Food & Culture Tour",
      location: "Ho Chi Minh City, Vietnam",
      organizer: "Southeast Asia Tours",
      organizerAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_fDUcUSNPDcN-xan6n1fiMO81W5l34Dxww2U0-qU3NhNTVpsojXmxe-9YPEhdJwEgYKF70ri6aDiUeMY9VOGneriVjh7mYqBR9bcQzRM1RNif67dzu1wgaOdScySM5SJJTVA1MYNdQO0U2iR3nHMTzfSRu42xvHgTCieoW5xJOT7w8b9Ih4RZbPn6CRLS5q9WWplZpT0VaK2dOEXCT6nvRx6kDwfUvt-waGH9WEgiPxdbNu1CgnAYrKa0AuN12I7XQ6LdH9k4pmh",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q6HklPP8eJl2g_0Ru4k_6342DTBNVDv3RfQiyJf1D8ermyDu_aWCNSOkUV_YYBAWJmLVa3Obl3l1CfqEF65F1fM8m8YluO_kAAnf1cYvEBmt2j9ggWG3PAGukTIFWCEkN1YL8X68FvbfKSz70xlUs99erP34oWTo-toMpuVL8CLhu1hczRTtPAyVmaSAFCEvYU2LzHDN3g6jpXh5f7eA-O0yNbzOgwWJ5lZ9IVobXcvRoC8QPi5hxP4Q1lkdJTBFct41hZ2gWs5l",
      date: "Apr 5 - Apr 15",
      spots: 10,
      badge: "Popular",
      friends: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TN3kWbKhxK9hh013lBFOg8gmES5XSDpvv6D4QlhIsVFgB2jsxysm4cN_iTkNbBe5QG2TO4924ySNcIekFDGngL7sUoHKxHcK9CqMDbgOeUV0Se4Iu1277I2T-kVsTQ4aoaI9fJFxw07bFW7ZksdHb4a3I6nK1O9BggTXlzumPS1eo4HXsTyP9EThkvcm4NusDd1ir6Rppzx-fb1wYaiZn0zeKLE5Rfp7Jk9F42u52pAfMl460dwl4PKsr0opT0CjOKgPmsf2yKGB",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAg3iL-GWw-G1Y5vDff5d_lOmkYbePy0907A3eSrYmKo_AQpxLcn9TdNHTognV7rFqyrIm_9IycAMuTBlgtpfAfn7tzZT8qJRp3SNx3gF0mwKKoYLky6OcD2J9jjYix10uP_wS_eOgMPGa4x-VmQ8zeJwjP8F-ZDO0gOT2CCFpafFoejVdPMo0cMbIfukAFD384NTzd406aKNLtDRMyfIZRO6i16EY6ww4OhigbQujrrE3dnnpziMXGdeqEdTaasoWB62uEXgFoYI75",
      ],
      friendsCount: 3,
    },
  ]);
  */

  const handleRemoveTrip = (id: number) => {
    setSavedTrips(savedTrips.filter((trip) => trip.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#112838]">
      <MaterialSymbolsLoader />
      <DashboardHeader />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        {savedTrips.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#112838] mb-2 font-satoshi-black">
                Trips To Do
              </h1>
              <p className="text-slate-500 font-medium text-lg font-satoshi-medium">
                {savedTrips.length}{" "}
                {savedTrips.length === 1 ? "adventure" : "adventures"} waiting
                for you
              </p>
            </div>
          </div>
        )}

        {/* Trip Grid */}
        {savedTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {savedTrips.map((trip) => (
              <article
                key={trip.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${trip.image})` }}
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white shadow-sm transition-colors group/btn"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                  {trip.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-[#0EAFA3]/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-md font-satoshi-bold">
                        {trip.badge}
                      </span>
                    </div>
                  )}
                  {trip.friends && trip.friends.length > 0 && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="flex -space-x-2">
                        {trip.friends.slice(0, 2).map((friend, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-cover"
                            style={{ backgroundImage: `url(${friend})` }}
                          />
                        ))}
                        {trip.friendsCount && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-800 text-[9px] text-white flex items-center justify-center font-bold font-satoshi-bold">
                            +{trip.friendsCount}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#112838] leading-tight group-hover:text-[#15677C] transition-colors font-satoshi-bold">
                      {trip.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-6 h-6 rounded-full bg-slate-200 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${trip.organizerAvatar})`,
                      }}
                    />
                    <span className="text-xs font-medium text-slate-500 font-satoshi-medium">
                      By {trip.organizer}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-5 font-satoshi-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{trip.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{trip.spots} spots</span>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <Link
                      href={`/trip/${trip.id}`}
                      className="flex-1 py-2.5 px-4 bg-[#112838] text-white rounded-xl text-sm font-bold hover:bg-[#112838]/90 transition-colors shadow-lg shadow-[#112838]/20 text-center font-satoshi-bold"
                    >
                      View Trip
                    </Link>
                    <button
                      onClick={() => handleRemoveTrip(trip.id)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-[#15677C]/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#15677C] text-[40px]">
                travel_explore
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#112838] mb-3 font-satoshi-black">
              Nothing saved yet
            </h3>
            <p className="text-slate-500 mb-8 leading-relaxed font-satoshi">
              Your wishlist is waiting for its first adventure. Browse the
              community&apos;s favorite trips and save the ones that spark your
              wanderlust.
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-[#15677C] hover:bg-[#15677C]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#15677C]/20 flex items-center gap-2 font-satoshi-bold"
            >
              <span className="material-symbols-outlined">explore</span>
              Explore Trips
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
