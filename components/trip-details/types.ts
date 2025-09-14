export type CurrencyCode = "INR";

export interface DateRange {
  startIso: string; // e.g., 2024-10-12
  endIso: string; // e.g., 2024-10-26
  display: string; // e.g., Oct 12 - Oct 26, 2024
}

export interface AboutTrip {
  tripName: string;
  location: string;
  dateRange: DateRange;
  groupSizeMin: number;
  groupSizeMax: number;
  ageMin: number;
  ageMax: number;
  tripType: string;
}

export interface HostInfo {
  name: string;
  rating: number; // 0-5
  reviewsCount: number;
  partnerLogoUrl?: string;
  description: string;
}

export interface ItineraryItem {
  day: number; // 1-based
  title: string;
  description: string;
}

export interface RatingsDistribution {
  5: number; // percent 0-100
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewsSummary {
  average: number;
  totalCount: number;
  distribution: RatingsDistribution;
}

export interface ReviewItem {
  author: string;
  dateIso: string; // YYYY-MM
  rating: number;
  content: string;
  likes?: number;
  comments?: number;
  avatarUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedTrip {
  title: string;
  country: string;
  imageUrl: string;
}

export interface TripDetailsData {
  id: string;
  title: string;
  heroImageUrl: string;
  priceInInr: number;
  currency: CurrencyCode;
  perPerson: boolean;
  about: AboutTrip;
  host: HostInfo;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  reviewsSummary: ReviewsSummary;
  reviews: ReviewItem[];
  faqs: FaqItem[];
  relatedTrips: RelatedTrip[];
}
