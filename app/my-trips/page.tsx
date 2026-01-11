"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";

interface Trip {
  id: string;
  title: string;
  image: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  dateRange: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
  };
  isFavorite?: boolean;
  participants?: Array<{ avatar: string }>;
  participantsCount?: number;
  requestDate?: string;
  requestMessage?: string;
}

export default function MyTripsPage() {
  const [activeFilter, setActiveFilter] = useState<
    "upcoming" | "pending" | "past" | "cancelled"
  >("upcoming");

  // Placeholder trips data
  const upcomingTrips: Trip[] = [
    {
      id: "1",
      title: "Backpacking in Manali",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAC3EpXBQAmPQ4ooeer8tUS-aSd35TA_rsUtMHhT1Gyh8ZX-rtWXBWUPFNZhJ_FC6cPiyMBh_mQ3x9xjqj6zddLyQvVVDlYPbeRk5frHmFJfIn4dPuEYm8D4wchVU2nJTiHOtA8Mey5RjAloQDPNsI_XH3he8pWORuSKORLbaHDkqBx_CT6pFv7iLBiTkM__n_1NJoxSNCMZd5WJLm5tGuJ_3gT--a1VaP2VEzDlE61YflIYgd0QI7GJ8aDQ9LJNqkIjW-rKOiIRtSb",
      status: "confirmed",
      dateRange: "Oct 12 - Oct 18, 2023",
      location: "Himachal Pradesh, India",
      organizer: {
        name: "Rohan K.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDIcVOJuF4sq4oroF-fOzoEx3pvGx6-h_Yb70I2GwNu2l6DpkDc4rmmqEqD1_h2QMxOFkRs9ddbpg_OyEzKy-Y31cELyEoUiiaTYlOkQ1cZFrV6JTC7XkpD3qIdA2J3GL_7SDjBri3tBJ-QJwk8nFHCZKWXxZFCYxlT16wEG-i3B_Q6R6SXjWRIIDgeZQRDuYni9LkV2v5TNmPc519xvd7xwGJqrf6Ta5w-RnNN5OUXzicEi6kbvV3WDA7icUrT6_2n286oqBkqiD9q",
      },
      isFavorite: false,
    },
    {
      id: "2",
      title: "Tropical Getaway",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfKm5JwxVAJ-Saj-i_mtZPVy-PCkNifHLNKQe3eziFlsQVkq-AB_jVf7_fo0A6GbEtg9EpbG3qmWkAjTCcVw5_sloRMKy_EaHwsQ1EslBvdlB1AjKqZ9fxOxYCHGgsMvsY6qY1eZ4OnHKfu0yHtOQhH_ki-1VaXOEiL_8v-buF18t1IL09v1wpfCrIKkcGdV16-DcesZoO-c3vq8c4M6qNLArhPxcdeFd09yaKL4JlZ1-DfKG9PwGprGIbTdAHO33HstPRZ9ns_56P",
      status: "confirmed",
      dateRange: "Dec 22 - Dec 28, 2023",
      location: "Malé, Maldives",
      organizer: {
        name: "Sarah J.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAMYumbBEGaiaYzQmsJfDTRl-pfF-dnUxdd4qR_rsS5iBRBFPdDCwF0QEcXPQxhcCAphzDWJS5O5t8nqz8mzx0ejKpxj1UqDs3H--4g63K9P5HZfxXWNPsegptOTG_6dZ1ef5siZkM1y7BvfABh1r30KHqZSEdEIhnrX6gFptZZqWZ4ya6qmb-uZJbmS63Wnkzxu08XP33X9fZaJD6Q9sDZHvrBIhwh171hH3qeT33wsYqfZt6mbN4fGm_MOJUgnxogjqxAIlhJOeEM",
      },
      isFavorite: false,
    },
  ];

  const pendingTrips: Trip[] = [
    {
      id: "3",
      title: "Ladakh Bike Expedition",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoSR9PtKxcR0l3ZxChTcg2LSiUdx0nVg7w6q8y0ZZ0BraquG0yCMIJFcITqCLEwyiu44mSQEWTicr13B3Sf6fk2C0AGAKbgZNpDO6jKEXezT_U67KqJGaj1ppRNrrgSL5xPCZI2U3oPtS5QMlxjXsjtHl8Y3IqNOTzxCEAtYLyiFC2E31g3qRRvxpZbIuhSrn7DoAmaXnPCjuatrJConpG-v8Lx9seV9-h6J2S_ZQy3LJgNmWu7IldYmLw4eWMNT8dirjKAVExV-fn",
      status: "pending",
      dateRange: "Jun 10 - Jun 20, 2024",
      location: "Ladakh, India",
      organizer: {
        name: "Vikram S.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAqVG0aYzBiP-xt2cMJBfdOfnKU8kCHhwQ5-QLeq1_NgHwHkJeDnHawxMZGG_KpyHUiEDAHDncxzkSfgZ6zd1x5vjH-mqRPjDjWcF0QHOjunf6ovUgNn9EVDyoOlQs5NvSi1ESDC30bFpSdCC3W-zpXkq5sb1O84KRURDQxgfaYS3eHIhopEw5cKsURFnS57zwx6uGUqv6TDs3jZvveOUn5Hvm0FC6VmutRseQ1cF6chiY_VfT-kjEW9pu0uTNl_iLa9Y1lbzZBEBn9",
      },
      requestDate: "Oct 1st",
      requestMessage:
        "Request sent on Oct 1st. The host usually responds within 24 hours.",
    },
  ];

  const pastTrips: Trip[] = [
    {
      id: "4",
      title: "Rafting in Rishikesh",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBg3ZMYrZn2l-yD2Jt8UeTPsXqQon9AXpx-suvJq9BQElXP_JpIYoeD06TPu6ozOnjhkEiBJQ9qVJ_szgbnt7j3bbg8HIV2wZAnnFLl8iS_eRh9GYnbppS5pL4prYi3wyWgHvk1C36MY5iNHduqZ1G9cLsGkzW3o5I28WVr1RQkvt80zei7NyBHP_UnoWmx-lhrQM18dwpR3vH2BY2LDxA9CTec_FHYVfZ6PzTgq5drPkY81y8WzbU0Y2_ZqIdM-6mr6m02z6obn7tx",
      status: "completed",
      dateRange: "September 2023 • 3 Days",
      location: "Rishikesh, India",
      organizer: {
        name: "Organizer",
        avatar: "",
      },
      participants: [
        {
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBKz-q8nL7ofW4JDqMZWbPd7OedORQD1BCcyh6iPGTftqekDO-9dnPCBzEIa6g94QP-6vGEYsJaiomA_fubV8SpMhudCEmy4g12BEju0JFiX7l0jX2B-8AZHE2ZuJvJgYw3Y4DvMkCOvwAbmA9ydznDdQUD12ReLIVNwPzdlPX-bu24OYY2Nn4WHli5GuNS45plaQlKRxI2ORbPiBVjZXFJCa_xtkIfaScfOAHPx_cJ9Af_rsZGrx20ax223i9oq7Z-3_hnLbh5C9f6",
        },
        {
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCxr3zrxCEI-WtX1ksNvVXh_ntvcHz5A-j1Nhe-i4JaQAhkvJ1QKUg1-w1_cbwkTxfhIdm6pgoB0h49wAeg5xvCmhgDnRP0rnPWrS82NGWatBW32YGndUSe-aMJaAr9sbXcOMjSaHqDHJk9-BoBzgLdMZ2iilQCdtISgGBxqqV5JRS3zQTchIkKzKf8uUZX5vUD3yb0TrhSOTX3-brhD9iPppAu2rcvUL-ivOl7EP7FIxgknXb3iM9ntQ9sMAHKJfruc3zoJQO7etbo",
        },
      ],
      participantsCount: 4,
    },
    {
      id: "5",
      title: "Goa Beach Week",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuADRiGO_w82WlLBJmQfJhQkKsRg6dD0YxV_6ytAC2ylmnlz0PhUNWY3g7d4lVLOG-ohKy69uX4Q90buTYWtSixwDn7P8Ay8SP4U0lwqic7HjzEOKiHw-CSwGEhLgeko2sICKQaHyQNK9PdOMbKhiRhjWNzCUh40mKy09Kux0qbbQ3za6EVOnJEyR0mtMxqm0ksB49Rh7dAWln6wB_1Hn8ppfS1vHwnZoulHzU5OEvixmHUkXMKGXlW1QW_HIZZkEXnQzISXRS11OCfx",
      status: "completed",
      dateRange: "August 2023 • 5 Days",
      location: "Goa, India",
      organizer: {
        name: "Organizer",
        avatar: "",
      },
      participants: [
        {
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDacSazrDI7ol4mvxZs2CmMkTQ9C8wCetzBIBLt-eF-SGPSbYWpx3yzIlzkDscd_RxhXaXEae0a_Eh3-RH0rLhCvPiUvWn9n0cWs1wkr8FkIRajTsNjdodDSPsjrR-hetxhgU4jzfP34hWxT0ABfnzY3MUMRySxcP3UwC_erWIfWNP-mimWsBfOzT9h1XM9UQ3YbLeBgM61svdiHC0x9-alfENN0kHfSO6TWZHMFyLy3RXHPwuaRpAlxEmGTGGVQQwg3JBprwBmsPT4",
        },
        {
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD8kUC9cyVLLyQ0NhbyccWd3m1NyW-lfUKznZmXwnhcCRRqLlPZfYmJu3wa6M2U1hzOvPUP0O9TeUkSyLcDrXt9RyYB3OWBbX2geGkueqwiXwDo8Z2luOdevPu6XU0xRoERYSIj19NIo9SCXSpeLnTsnTK7WUiKNsVEYKrYGGs3To4KUXqlFbleD01wbvVRGmFh_8xh9QK8i_ifR47itqmNybIg39hnjGaZLzivtWfo3Dbqm7prQvBQYdzOI0kFkkFOzuE3EHl_a5oO",
        },
      ],
      participantsCount: 8,
    },
  ];

  const getFilteredTrips = () => {
    switch (activeFilter) {
      case "upcoming":
        return upcomingTrips;
      case "pending":
        return pendingTrips;
      case "past":
        return pastTrips;
      case "cancelled":
        return [];
      default:
        return [];
    }
  };

  const filteredTrips = getFilteredTrips();
  const pendingCount = pendingTrips.length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-light text-primary">
        <MaterialSymbolsLoader />
        <DashboardHeader />
      <main className="max-w-[1440px] mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 font-satoshi-bold">
              My Trips
            </h1>
            <p className="text-slate-500 text-lg font-satoshi">
              Manage your upcoming adventures and past memories.
            </p>
          </div>
          <Link
            href="/"
            className="bg-primary hover:bg-[#0b1a26] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/10 transition-all flex items-center gap-2 font-satoshi-bold"
          >
            <span className="material-symbols-outlined">explore</span>
            Explore
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto hide-scroll pb-2">
          <button
            onClick={() => setActiveFilter("upcoming")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap font-satoshi-bold ${
              activeFilter === "upcoming"
                ? "bg-[#2b9dee] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-[#2b9dee] hover:text-[#2b9dee]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap font-satoshi-bold flex items-center gap-2 ${
              activeFilter === "pending"
                ? "bg-[#2b9dee] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-[#2b9dee] hover:text-[#2b9dee]"
            }`}
          >
            Pending Approval{" "}
            {pendingCount > 0 && (
              <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md text-xs">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter("past")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap font-satoshi-bold ${
              activeFilter === "past"
                ? "bg-[#2b9dee] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-[#2b9dee] hover:text-[#2b9dee]"
            }`}
          >
            Past Trips
          </button>
          <button
            onClick={() => setActiveFilter("cancelled")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap font-satoshi-bold ${
              activeFilter === "cancelled"
                ? "bg-[#2b9dee] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-[#2b9dee] hover:text-[#2b9dee]"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Upcoming Adventures Section */}
        {activeFilter === "upcoming" && upcomingTrips.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 font-satoshi-bold">
              <span className="material-symbols-outlined filled-icon text-accent">
                flight_takeoff
              </span>
              Upcoming Adventures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={trip.image}
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wide text-primary font-satoshi-bold">
                        Confirmed
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-primary leading-tight font-satoshi-bold">
                        {trip.title}
                      </h3>
                      <button className="text-slate-300 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium font-satoshi-medium">
                        <span className="material-symbols-outlined text-lg">
                          calendar_month
                        </span>
                        <span>{trip.dateRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium font-satoshi-medium">
                        <span className="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        <span>{trip.location}</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          alt="Organizer"
                          className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                          src={trip.organizer.avatar}
                        />
                        <div>
                          <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-wider font-satoshi-bold">
                            Organizer
                          </p>
                          <p className="text-xs font-bold text-primary font-satoshi-bold">
                            {trip.organizer.name}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="#"
                        className="text-accent hover:text-[#0EAFA3] font-bold text-sm flex items-center gap-1 group/btn font-satoshi-bold"
                      >
                        View Details
                        <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approval Section */}
        {activeFilter === "pending" && pendingTrips.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 font-satoshi-bold">
              <span className="material-symbols-outlined filled-icon text-orange-400">
                pending
              </span>
              Pending Approval
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="group bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col relative opacity-90 hover:opacity-100"
                >
                  <div className="relative h-56 overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition-all">
                    <img
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={trip.image}
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                      <span className="material-symbols-outlined text-sm">
                        hourglass_top
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide font-satoshi-bold">
                        Awaiting
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-primary leading-tight mb-2 font-satoshi-bold">
                      {trip.title}
                    </h3>
                    {trip.requestMessage && (
                      <p className="text-slate-500 text-sm mb-4 font-satoshi">
                        {trip.requestMessage}
                      </p>
                    )}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-satoshi">
                        <span className="material-symbols-outlined text-lg">
                          calendar_month
                        </span>
                        <span>{trip.dateRange}</span>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 opacity-75">
                        <img
                          alt="Organizer"
                          className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                          src={trip.organizer.avatar}
                        />
                        <div>
                          <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-wider font-satoshi-bold">
                            Organizer
                          </p>
                          <p className="text-xs font-bold text-primary font-satoshi-bold">
                            {trip.organizer.name}
                          </p>
                        </div>
                      </div>
                      <button className="text-slate-400 font-bold text-sm hover:text-primary transition-colors font-satoshi-bold">
                        View Request
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Past Trips Section */}
        {activeFilter === "past" && pastTrips.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 font-satoshi-bold">
              <span className="material-symbols-outlined filled-icon text-slate-400">
                history
              </span>
              Past Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="group bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img
                      alt={trip.title}
                      className="w-full h-full object-cover"
                      src={trip.image}
                    />
                    <div className="absolute inset-0 bg-white/10"></div>
                    <div className="absolute top-4 right-4 bg-slate-800 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide font-satoshi-bold">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-700 leading-tight font-satoshi-bold">
                        {trip.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-5 font-satoshi">
                      {trip.dateRange}
                    </p>
                    <div className="mt-auto pt-5 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {trip.participants?.slice(0, 2).map((participant, idx) => (
                          <img
                            key={idx}
                            alt=""
                            className="w-7 h-7 rounded-full border-2 border-white grayscale opacity-60"
                            src={participant.avatar}
                          />
                        ))}
                        {trip.participantsCount && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[0.6rem] font-bold text-slate-500 font-satoshi-bold">
                            +{trip.participantsCount}
                          </div>
                        )}
                      </div>
                      <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold text-xs hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm font-satoshi-bold">
                        Write Review
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-slate-400 text-[40px]">
                flight_takeoff
              </span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3 font-satoshi-bold">
              No trips found
            </h3>
            <p className="text-slate-500 mb-8 font-satoshi">
              {activeFilter === "upcoming" &&
                "You don't have any upcoming trips planned."}
              {activeFilter === "pending" &&
                "You don't have any pending trip requests."}
              {activeFilter === "past" &&
                "You haven't completed any trips yet."}
              {activeFilter === "cancelled" &&
                "You don't have any cancelled trips."}
            </p>
            <Link
              href="/"
              className="bg-primary hover:bg-[#0b1a26] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/10 transition-all flex items-center gap-2 font-satoshi-bold"
            >
              <span className="material-symbols-outlined">explore</span>
              Explore
            </Link>
          </div>
        )}
      </main>
      <style jsx>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .filled-icon {
          font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
        }
      `}</style>
      </div>
    </ProtectedRoute>
  );
}
