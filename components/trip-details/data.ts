import { TripDetailsData } from "./types";

// Dummy content modeled on the provided design. Images live under /public/images/trip-details/
export const EVEREST_BASE_CAMP_TRIP: TripDetailsData = {
  id: "everest-base-camp",
  title: "Trek to Everest Base",
  heroImageUrl: "/images/trip-details/everest.png",
  priceInInr: 120000,
  currency: "INR",
  perPerson: true,
  about: {
    tripName: "Trek to Everest Base Camp",
    location: "Nepal",
    dateRange: {
      startIso: "2024-10-12",
      endIso: "2024-10-26",
      display: "Oct 12 - Oct 26, 2024",
    },
    groupSizeMin: 10,
    groupSizeMax: 12,
    ageMin: 20,
    ageMax: 40,
    tripType: "Adventure",
  },
  host: {
    name: "GlobeTrotters",
    rating: 4.8,
    reviewsCount: 120,
    partnerLogoUrl: undefined,
    description:
      "Globe Trotters is a seasoned travel collective with over 10 years of experience curating adventure-packed treks and group getaways across the Himalayas. Known for their expert planning and local insights, they're passionate about delivering safe, scenic, and unforgettable travel experiences for thrill-seekers and nature lovers alike.",
  },
  itinerary: [
    {
      day: 1,
      title: "Day 1: Arrival in Kathmandu",
      description:
        "Arrive at Tribhuvan International Airport in Kathmandu. Transfer to your hotel and enjoy a welcome dinner. Optional sightseeing tour of Kathmandu's cultural landmarks.",
    },
    { day: 2, title: "Day 2: Trek to Phakding", description: "" },
    { day: 3, title: "Day 3: Trek to Namche Bazaar", description: "" },
  ],
  inclusions: [
    "Airport transfers",
    "Accommodation in Kathmandu and teahouses",
    "All meals during the trek",
    "Permits and fees",
    "Experienced guides and porters",
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Personal expenses",
  ],
  reviewsSummary: {
    average: 4.8,
    totalCount: 120,
    distribution: { 5: 50, 4: 30, 3: 10, 2: 5, 1: 5 },
  },
  reviews: [
    {
      author: "Rishab",
      dateIso: "2023-10",
      rating: 5,
      content:
        "The trek was an incredible experience, and Sophia from Globe Trotters was an amazing guide. The scenery was breathtaking, and the group was fantastic. Highly recommend!",
      likes: 10,
      comments: 2,
    },
    {
      author: "Tanya",
      dateIso: "2023-11",
      rating: 4,
      content:
        "Overall, a great trip. The itinerary was well-planned, and the guide was knowledgeable. However, the teahouses were a bit basic, but that's to be expected on a trek like this.",
      likes: 8,
      comments: 1,
    },
  ],
  faqs: [
    {
      question: "What is the best time to trek to Everest Base Camp?",
      answer:
        "The best time to trek to Everest Base Camp is during the pre-monsoon (March to May) and post-monsoon (September to November) seasons. The weather is generally clear and dry, offering excellent visibility of the mountains.",
    },
    {
      question: "What is the difficulty level of the trek?",
      answer:
        "Moderate to challenging. Participants should have good fitness and be prepared for multi-day trekking at altitude.",
    },
    {
      question: "What’s the accommodation like?",
      answer:
        "Comfortable teahouses during the trek and a hotel stay in Kathmandu before and after the trek.",
    },
  ],
  relatedTrips: [
    {
      title: "Annapurna Circuit Trek",
      country: "Nepal",
      imageUrl: "/images/trip-details/AnnapurnaCircuitTrek.png",
    },
    {
      title: "Machu Picchu Trek",
      country: "Peru",
      imageUrl: "/images/trip-details/MachuPicchuTrek.png",
    },
    {
      title: "Kilimanjaro Climb",
      country: "Tanzania",
      imageUrl: "/images/trip-details/KilimanjaroClimb.png",
    },
  ],
};
