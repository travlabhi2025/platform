import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Types for Firestore documents
export interface Trip {
  id?: string;
  title: string;
  heroImageUrl: string;
  priceInInr: number;
  currency: "INR";
  perPerson: boolean;
  about: {
    tripName: string;
    location: string;
    startDate: string; // ISO date string (YYYY-MM-DD)
    endDate: string; // ISO date string (YYYY-MM-DD)
    groupSizeMin: number;
    groupSizeMax: number;
    ageMin: number;
    ageMax: number;
    tripType: string;
  };
  host: {
    name: string;
    rating: number;
    reviewsCount: number;
    partnerLogoUrl?: string;
    description: string;
  };
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  reviewsSummary: {
    average: number;
    totalCount: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: Array<{
    author: string;
    dateIso: string;
    rating: number;
    content: string;
    likes?: number;
    comments?: number;
    avatarUrl?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedTrips: Array<{
    title: string;
    country: string;
    imageUrl: string;
  }>;
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "Active" | "Upcoming" | "Completed";
  bookings: number;
}

export interface Booking {
  id?: string;
  tripId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  groupSize: number;
  preferences?: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  bookingDate: Timestamp;
  totalAmount: number;
  paymentStatus: "Pending" | "Completed" | "Failed";
  createdBy: string; // User ID who made the booking
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  kycVerified: boolean;
  badge?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Trip operations
export const tripService = {
  // Create a new trip
  async createTrip(
    tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // Get trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const trip = { id: docSnap.id, ...docSnap.data() } as Trip;
        console.log("Found trip by ID:", tripId, trip);
        return trip;
      } else {
        console.log("Trip not found with ID:", tripId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching trip by ID:", tripId, error);
      return null;
    }
  },

  // Get all trips
  async getAllTrips(): Promise<Trip[]> {
    const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Trip)
    );
  },

  // Get trips by creator
  async getTripsByCreator(userId: string): Promise<Trip[]> {
    console.log("Querying trips for userId:", userId);

    // First try a simple query without orderBy to see if the issue is with the index
    try {
      const simpleQuery = query(
        collection(db, "trips"),
        where("createdBy", "==", userId)
      );
      const simpleSnapshot = await getDocs(simpleQuery);
      console.log("Simple query snapshot size:", simpleSnapshot.docs.length);

      if (simpleSnapshot.docs.length > 0) {
        console.log("Simple query found trips, trying with orderBy...");
        const q = query(
          collection(db, "trips"),
          where("createdBy", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        console.log("Ordered query snapshot size:", querySnapshot.docs.length);
        const trips = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Trip)
        );
        console.log("Mapped trips:", trips);
        return trips;
      } else {
        console.log("No trips found with simple query");
        return [];
      }
    } catch (error) {
      console.error("Error with ordered query, trying simple query:", error);
      // Fallback to simple query if ordered query fails
      const simpleQuery = query(
        collection(db, "trips"),
        where("createdBy", "==", userId)
      );
      const simpleSnapshot = await getDocs(simpleQuery);
      const trips = simpleSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Trip)
      );
      // Sort manually since we can't use orderBy
      trips.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
      console.log("Fallback trips:", trips);
      return trips;
    }
  },

  // Update trip
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    const docRef = doc(db, "trips", tripId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete trip
  async deleteTrip(tripId: string): Promise<void> {
    await deleteDoc(doc(db, "trips", tripId));
  },

  // Update trip bookings count
  async updateTripBookings(tripId: string, increment: number): Promise<void> {
    const trip = await this.getTripById(tripId);
    if (trip) {
      await this.updateTrip(tripId, { bookings: trip.bookings + increment });
    }
  },
};

// Booking operations
export const bookingService = {
  // Create a new booking
  async createBooking(
    bookingData: Omit<Booking, "id" | "bookingDate">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      bookingDate: Timestamp.now(),
    });

    // Update trip bookings count
    await tripService.updateTripBookings(bookingData.tripId, 1);

    return docRef.id;
  },

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking | null> {
    const docRef = doc(db, "bookings", bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    }
    return null;
  },

  // Get bookings by user
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("createdBy", "==", userId),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Get bookings for a trip
  async getBookingsForTrip(tripId: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: Booking["status"]
  ): Promise<void> {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { status });
  },

  // Update payment status
  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: Booking["paymentStatus"]
  ): Promise<void> {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { paymentStatus });
  },
};

// User operations
export const userService = {
  // Create or update user
  async createOrUpdateUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<void> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new user using setDoc
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },
};
