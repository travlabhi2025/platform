"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";
import { useAuth } from "@/lib/auth-context";

export default function MySettingsPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#112437]">
      <MaterialSymbolsLoader />
      <DashboardHeader />
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-8 md:py-12">
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-[#112437] text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-3 font-satoshi-black">
            Traveller Settings
          </h1>
          <p className="text-slate-500 text-lg font-normal leading-normal max-w-lg font-satoshi">
            Manage your preferences, payment methods, and privacy controls in one
            place.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Section 1: Notifications */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-[#112437]">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <h2 className="text-[#112437] text-2xl font-bold tracking-tight font-satoshi-bold">
                Notifications
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              {/* Email Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 size-10 shrink-0">
                    <span className="material-symbols-outlined text-[22px]">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#112437] text-base font-bold font-satoshi-bold">
                      Email Notifications
                    </p>
                    <p className="text-slate-500 text-sm font-satoshi">
                      Receive booking confirmations and updates
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0EAFA3]"></div>
                </label>
              </div>

              {/* WhatsApp Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-green-50 text-green-600 size-10 shrink-0">
                    <span className="material-symbols-outlined text-[22px]">chat</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#112437] text-base font-bold font-satoshi-bold">
                      WhatsApp Updates
                    </p>
                    <p className="text-slate-500 text-sm font-satoshi">
                      Get real-time alerts on WhatsApp
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0EAFA3]"></div>
                </label>
              </div>

              {/* Alerts Toggle */}
              <div className="flex items-center justify-between py-4 hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 size-10 shrink-0">
                    <span className="material-symbols-outlined text-[22px]">campaign</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#112437] text-base font-bold font-satoshi-bold">
                      Booking & Approval Alerts
                    </p>
                    <p className="text-slate-500 text-sm font-satoshi">
                      Instant notifications for trip changes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingAlerts}
                    onChange={(e) => setBookingAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0EAFA3]"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Section 2: Payments */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-900">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <h2 className="text-[#112437] text-2xl font-bold tracking-tight font-satoshi-bold">
                  Payments
                </h2>
              </div>
              <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#0EAFA3] hover:text-[#15677C] transition-colors font-satoshi-bold">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add Method
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Saved Card */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#112437] to-[#1e3a56] p-5 shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-white/80">
                    <span className="material-symbols-outlined text-3xl">
                      contactless
                    </span>
                  </div>
                  <img
                    alt="Mastercard Logo"
                    className="h-8 opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGEkHe1MW2Z-nQcmAl6c3fx4Bu5X8R0F1LySSNxBoi9cC3aohA0lgCHprYTUKR2hMCWxN5MEudrRuxnebPXJqrIHE4X-6yGyAW1hqePU-229FWPIUUmCCH6FO-cay_fYi4R_ei_T2yHwCVhjFQTsX88T8Mou48nZ8YRg_iABhpFrOBu4Tgt_oegjtPI4BL_B5bSRadD4v8zxvNC_M72Kh2BYQDxdJdKfJyaNDcUJAyWrsaT-LQnRluzzV64AGFclPo-0K5KPC93dsq"
                  />
                </div>
                <div className="mb-4">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1 font-satoshi-medium">
                    Card Number
                  </p>
                  <p className="text-white text-lg font-mono tracking-widest">
                    •••• •••• •••• 4289
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1 font-satoshi-medium">
                      Expiry
                    </p>
                    <p className="text-white text-sm font-medium font-satoshi-medium">
                      12/26
                    </p>
                  </div>
                  <button className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_horiz
                    </span>
                  </button>
                </div>
                {/* Decoration */}
                <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
              </div>

              {/* Add New Card Button */}
              <button className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition-all hover:border-[#0EAFA3] hover:bg-teal-50/30 min-h-[180px]">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform text-[#0EAFA3]">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
                <p className="font-bold text-[#112437] group-hover:text-[#0EAFA3] transition-colors font-satoshi-bold">
                  Add New Card
                </p>
                <p className="text-sm text-slate-400 mt-1 font-satoshi">
                  Visa, Mastercard, Amex
                </p>
              </button>
            </div>
          </section>

          {/* Section 3: Privacy & Support */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-900">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
              <h2 className="text-[#112437] text-2xl font-bold tracking-tight font-satoshi-bold">
                Privacy & Support
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-slate-50 text-[#112437] group-hover:bg-[#112437] group-hover:text-white transition-colors size-10 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      help_center
                    </span>
                  </div>
                  <span className="font-semibold text-[#112437] font-satoshi-bold">
                    Help & Support
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#112437] transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-red-100 hover:bg-red-50/30 transition-all w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors size-10 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                  </div>
                  <span className="font-semibold text-slate-600 group-hover:text-red-600 transition-colors font-satoshi-bold">
                    Log Out
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm font-satoshi">
              TripAbhi App v2.4.0 • Made with{" "}
              <span className="text-red-400">❤</span> for travelers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
