import Link from "next/link";
import { Flame, Calendar, ArrowRight } from "lucide-react";

// Placeholder trip data - will be replaced with real API later
const placeholderTrips = [
  {
    id: "1",
    title: "Bali Bliss: Yoga & Culture Retreat",
    heroImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA39OEJR2C5Gclkfms_f_G3fhlIO6h0AqhF9ZxjZIoI5J7VOxuGliy97IsBhwRLGW5CSjA9eDPHgpCSs9-Ez9nFRs6eJErm00cAQo1l1xkPrhItoB33QkkQPS5ElqZePXJ70u9bDl2r5Nj2GqNDq0CKNGtbFmgMNdqYXlhDEJVjLPruTwP6GYVO--fyLuAgwrQIlPu2lhu52958Mpfs_Y458W4w-eQuYVthw9LppTWPEYCbE9hgbSZEWvNWGG1Q9ch1h6apDNAJenfF",
    packages: [{ priceInInr: 1499, currency: "USD" }],
    about: {
      startDate: "2024-08-12",
      endDate: "2024-08-19",
      groupSizeMax: 10,
    },
    host: {
      name: "Jessica",
      organizerImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ISk7BFSjfehO1BBN3HZzyQMF0UCDMTiZobq8AHSZAP7mgSJM9hmTf6BueUXhgBRQWfmxjzwYUKrCGW61Y99CBQ5kQAgOOP2ba-QATHXNSLwnGhHI1EL2XK6gE887w3Sb9o3OVpcUgjFm0YtcpdLYuinXw_kkJDrnD1HLHeuI-Qr6a3JqCC4NAQ4g5FDcM8pJilD43DRz2A09brJLoMCfIYlU__0hLWeUC-oR6iBhK472HTK63b5s-1QzH4qCrx8cZNaDGCK5-gGD",
    },
    spotsLeft: 2, // Deterministic value for SSR
  },
  {
    id: "2",
    title: "Iceland Ring Road Expedition",
    heroImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj_wCmX5Xtr1ikGTthgKoCdKocU5N82XnuGTZd0hGWgsX2fyXhzO1UW-OAqcJPDsKtm9HvUhzNbgZABr3MynPERifdkaUaySGUll_CT-ooEI8wrtLjle0MiFmLZTBRJF68iUgWnCmjqVdXy4Inej-4OFg8jG_H8zme6ZXdovM8vQn-xLt16zbjpalefXYcXM9CQLlG-pMUgkAMb_gEYAesv962l1ifZYnGPPd-Oq2aim-ltGXhTyl23IfqN58lVNlbESBWuLYwYrXd",
    packages: [{ priceInInr: 2150, currency: "USD" }],
    about: {
      startDate: "2024-09-01",
      endDate: "2024-09-10",
      groupSizeMax: 12,
    },
    host: {
      name: "Alex",
      organizerImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vRQGUD137VkLd4ISvmqp_5LNWz0aLh4oNoEzP7uOMHVx9_6mcx-YE0mnz11lK02qiiA7DVvMzXA8SfdnRaIDv-iiJUf8PhIDG406mzLEpjVZDqNBepIcbAP4l_xpMGJYuJ8rtqdCcYX3V5U8xdHUYkVoDqWBV_HToKe0ZZxZFlquqeg4xArBp24BTS6VOrDdMZsGVdSPsY8-BiAdY-C83PefbJOwxwmoTZOBmMKQ4jXjgDbspHdNyeKyh69-GrRLiU-U0RlAcsTo",
    },
    spotsLeft: null, // No spots left indicator for this trip
  },
  {
    id: "3",
    title: "Morocco: Desert Nights & Souks",
    heroImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2jlOxcS_08jQ-mBzIPzrSBTCNwLIQBarZ7kO2Mmd6OUSkiwn8Aa7hRg_kfNNQ7PwCFZJKzgOehIoim-4K4mFBzAVwpRJE0n0I_zur34MrSy6jougTreRvSNT4dikmr4LdyT3Vfiwv-dwI6yOoR3YcCEJKDeQHvmYO1eJS8d2JkP6_zZ9-Z_VQaQjVKdZTD_YvTAmF6gcjBYPWKTdDUkjmsKk-a1N0QS9ynXDjmbjWdnWr9Mm2ecP1bYesZrcogs9IxiSCivky5KYf",
    packages: [{ priceInInr: 950, currency: "USD" }],
    about: {
      startDate: "2024-10-05",
      endDate: "2024-10-12",
      groupSizeMax: 8,
    },
    host: {
      name: "Sam",
      organizerImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDW-Gznbhfwwo8XI1amrJu6zYyndaqm_Ngy2eZ1n1g-gaI0ctBRDWLZr99sjePWiturtbLltsgUR9ARpCfpAoSCqxuKBLWLTUjEImOzozhgTz3iiAprAdMYsDS_eoT5CfUgv3o_eo66-QyRZpsIxkWhqK4nU0S4SEQ4O_CYCG-qPlamUaLT54bpGYG0n71qKBsfCoTdwIY1PhOef_TXCIBtM49YSeAiGa9QjaxUFkA0PjkA_wFGu-mclVSC7cF_j3M9PL-GJrBIqOTQ",
    },
    spotsLeft: 3, // Deterministic value for SSR
  },
  {
    id: "4",
    title: "Japan: Cherry Blossoms & Sushi",
    heroImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnOuM3kyaZkzRIYUUbMkROFJU8L0EQzY7n6c1I7FMmI4xSvgr-clSiwRYXngGi22ACtj8yjGf1pBmiEkI2sqVvuChRERrvrW2o9dJS2DUCI51-wPvJBu_otOF_0CbhFm9gHXpqVY9m_4NwYi8ZyVyFSof9_lLRmxt01X4Op95hv_jqhmmG6OLj2-1ARqPgmr3XTpVRaXBoE5oWt2v1g-RIoRBqJTDPimTlLC55W6DtucvXczFojJK3cQALmWPYK8dX1M1LJLnY6a0P",
    packages: [{ priceInInr: 3200, currency: "USD" }],
    about: {
      startDate: "2024-04-01",
      endDate: "2024-04-10",
      groupSizeMax: 15,
    },
    host: {
      name: "Yumi",
      organizerImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTv8-aZ7O87lLqJJ7tqqO28CNYdFZOYJT_KgQB-SLU_WoDOH41e3A1DgXAhOFqorrFu6g3igMwPjISLmkv2-s0V0kH0CkVMmOmlHKow_DL_OhgEosBdpED4fsgM213JWCR4sRAyCJpSwbE90mwoaDoxubLa68Fj2Nzld3qPejH6QAXEYlltChMHoFzXgSr4jCn3uWRKbf9ACKHK6aU9gmbDTwSJvhR-dn67BafpZK0MAdf-Mo4SMPI0E-McpFn_JGsKBiBZuFw6RrS",
    },
    spotsLeft: null, // No spots left indicator for this trip
  },
];

interface TrendingAdventureCardProps {
  trip: typeof placeholderTrips[0];
}

function TrendingAdventureCard({ trip }: TrendingAdventureCardProps) {
  const price =
    trip.packages && trip.packages.length > 0
      ? trip.packages[0].priceInInr
      : trip.priceInInr || 0;
  const currency = trip.packages?.[0]?.currency || trip.currency || "INR";
  const displayPrice = currency === "INR" ? `₹${price}` : `$${price}`;

  const startDate = trip.about?.startDate
    ? new Date(trip.about.startDate)
    : null;
  const endDate = trip.about?.endDate ? new Date(trip.about.endDate) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDuration = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Days`;
    }
    return "8 Days";
  };

  // Use deterministic spotsLeft from trip data
  const spotsLeft = trip.spotsLeft ?? null;

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="group relative flex flex-col gap-4 rounded-[2rem] bg-white p-3 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--landing-primary)]/10"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${trip.heroImageUrl || "/images/placeholder-trip.jpg"})`,
          }}
        ></div>
        {spotsLeft && spotsLeft <= 3 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm shadow-sm">
            <Flame className="text-orange-500 w-[14px] h-[14px]" />
            <span className="font-satoshi-bold">{spotsLeft} spots left</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="rounded-xl bg-black/40 p-3 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold font-satoshi-medium">
                {startDate && endDate
                  ? `${formatDate(startDate)} - ${formatDate(endDate)} • ${getDuration()}`
                  : getDuration()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-2 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2 font-satoshi-bold">
            {trip.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {trip.host?.organizerImage ? (
              <div
                className="h-8 w-8 rounded-full bg-gray-300 bg-cover bg-center ring-2 ring-white"
                style={{
                  backgroundImage: `url(${trip.host.organizerImage})`,
                }}
              ></div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white"></div>
            )}
            <span className="text-sm font-medium text-slate-600 font-satoshi">
              {trip.host?.name || "Host"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-400 font-satoshi">
              from
            </span>
            <span className="text-lg font-extrabold text-[var(--landing-primary)] font-satoshi-black">
              {displayPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TrendingAdventures() {
  // Using placeholder data - will be replaced with real API later
  const displayTrips = placeholderTrips.slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-satoshi-bold">
              Trending Adventures
            </h2>
            <p className="text-slate-400 mt-2 font-satoshi">
              Book unique trips led by inspiring curators.
            </p>
          </div>
          <Link
            className="hidden md:flex items-center text-[var(--landing-primary)] font-bold text-sm hover:underline gap-1 font-satoshi-bold"
            href="#"
          >
            View all
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayTrips.map((trip) => (
            <TrendingAdventureCard key={trip.id} trip={trip} />
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <button className="flex h-12 w-full items-center justify-center rounded-full border border-white/20 bg-[var(--landing-card-dark)] text-white font-bold hover:bg-[var(--landing-surface-dark)] font-satoshi-bold">
            View all adventures
          </button>
        </div>
      </div>
    </section>
  );
}
