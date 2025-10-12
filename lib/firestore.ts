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
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Types for Firestore documents
export interface Trip {
  id?: string;
  title: string;
  heroImageUrl: string;
  galleryImages?: string[]; // Optional array of gallery image URLs
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
    organizerImage?: string; // Optional organizer image URL
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
}

export interface Booking {
  id?: string;
  tripId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  groupSize: number;
  preferences?: string;
  status: "Pending" | "Approved" | "Rejected";
  paymentStatus?: "Pending" | "Paid";
  bookingDate: Timestamp;
  totalAmount: number;
  createdBy?: string; // User ID of person who made booking (optional for guest bookings)
  // Approval workflow fields
  approvedBy?: string; // User ID of trip organizer who approved/rejected
  approvedAt?: Timestamp;
  rejectionReason?: string;
  // Additional metadata
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  kycVerified: boolean;
  badge?: string;
  role: "trip-organizer" | "customer";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Extended profile fields
  logo?: string;
  profilePicture?: string;
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
}

// Lightweight notification type for faking emails/WhatsApp
export interface Notification {
  id?: string;
  type: "email" | "whatsapp";
  to: string; // email address or phone
  subject?: string;
  message: string;
  createdAt: Timestamp;
  meta?: Record<string, unknown>;
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

  // Get trips by user (alias for getTripsByCreator)
  async getTripsByUser(userId: string): Promise<Trip[]> {
    return this.getTripsByCreator(userId);
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
};

// Booking operations
export const bookingService = {
  // Create a new booking
  async createBooking(
    bookingData: Omit<Booking, "id" | "bookingDate">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      status: "Pending",
      bookingDate: Timestamp.now(),
    });

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

  // Get bookings by email (since we removed createdBy field)
  async getBookingsByEmail(email: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("travelerEmail", "==", email),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Get bookings by phone number
  async getBookingsByPhone(phone: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("travelerPhone", "==", phone),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Check if email has already booked a specific trip
  async hasEmailBookedTrip(email: string, tripId: string): Promise<boolean> {
    const q = query(
      collection(db, "bookings"),
      where("travelerEmail", "==", email),
      where("tripId", "==", tripId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0;
  },

  // Get email's booking for a specific trip (if exists)
  async getEmailBookingForTrip(
    email: string,
    tripId: string
  ): Promise<Booking | null> {
    const q = query(
      collection(db, "bookings"),
      where("travelerEmail", "==", email),
      where("tripId", "==", tripId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Booking;
    }
    return null;
  },

  // Check if user has already booked a specific trip (by userId)
  async hasUserBookedTrip(userId: string, tripId: string): Promise<boolean> {
    const q = query(
      collection(db, "bookings"),
      where("createdBy", "==", userId),
      where("tripId", "==", tripId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0;
  },

  // Get user's booking for a specific trip (if exists)
  async getUserBookingForTrip(
    userId: string,
    tripId: string
  ): Promise<Booking | null> {
    const q = query(
      collection(db, "bookings"),
      where("createdBy", "==", userId),
      where("tripId", "==", tripId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Booking;
    }
    return null;
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
    paymentStatus: NonNullable<Booking["paymentStatus"]>
  ): Promise<void> {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { paymentStatus });
  },

  // Approve a booking
  async approveBooking(bookingId: string, approvedBy: string): Promise<void> {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, {
      status: "Approved",
      approvedBy,
      approvedAt: Timestamp.now(),
    });
  },

  // Reject a booking
  async rejectBooking(
    bookingId: string,
    approvedBy: string,
    rejectionReason: string
  ): Promise<void> {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, {
      status: "Rejected",
      approvedBy,
      approvedAt: Timestamp.now(),
      rejectionReason,
    });
  },

  // Get pending bookings for a trip
  async getPendingBookingsForTrip(tripId: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      where("status", "==", "Pending"),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Get approved bookings for a trip
  async getApprovedBookingsForTrip(tripId: string): Promise<Booking[]> {
    const q = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      where("status", "==", "Approved"),
      orderBy("bookingDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Get all bookings for trip organizer (across all their trips)
  async getBookingsForOrganizer(organizerId: string): Promise<Booking[]> {
    // First get all trips by this organizer
    const tripsQuery = query(
      collection(db, "trips"),
      where("createdBy", "==", organizerId)
    );
    const tripsSnapshot = await getDocs(tripsQuery);
    const tripIds = tripsSnapshot.docs.map((doc) => doc.id);

    if (tripIds.length === 0) {
      return [];
    }

    // Then get all bookings for these trips
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("tripId", "in", tripIds),
      orderBy("bookingDate", "desc")
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    return bookingsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  // Get booking statistics for organizer
  async getBookingStatsForOrganizer(organizerId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const bookings = await this.getBookingsForOrganizer(organizerId);

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "Pending").length,
      approved: bookings.filter((b) => b.status === "Approved").length,
      rejected: bookings.filter((b) => b.status === "Rejected").length,
    };
  },

  // (duplicate removed above)
};

// User operations
export const userService = {
  // Create or update user
  async createOrUpdateUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<User> {
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

    // Return the user profile
    const updatedUserSnap = await getDoc(userRef);
    return { id: updatedUserSnap.id, ...updatedUserSnap.data() } as User;
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

// Notification operations (fake email/whatsapp by writing to a collection)
export const notificationService = {
  async sendEmail(options: {
    to: string;
    subject: string;
    message: string;
    meta?: Record<string, unknown>;
  }): Promise<string> {
    const docRef = await addDoc(collection(db, "notifications"), {
      type: "email",
      to: options.to,
      subject: options.subject,
      message: options.message,
      meta: options.meta ?? {},
      createdAt: Timestamp.now(),
    } as Notification);
    return docRef.id;
  },
};
