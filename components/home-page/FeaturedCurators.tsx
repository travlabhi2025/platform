"use client";

import { BadgeCheck, Camera, UtensilsCrossed, ArrowRight } from "lucide-react";

// Mock curator data - in production, this would come from an API
const curators = [
  {
    id: 1,
    name: "Jessica's Retreats",
    category: "Yoga & Wellness Agency",
    description:
      "Specializing in mindfulness and movement in the most serene locations on Earth.",
    trips: 12,
    rating: 4.9,
    badge: {
      icon: BadgeCheck,
      label: "Top Rated",
      color: "text-[var(--landing-primary)]",
    },
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA39OEJR2C5Gclkfms_f_G3fhlIO6h0AqhF9ZxjZIoI5J7VOxuGliy97IsBhwRLGW5CSjA9eDPHgpCSs9-Ez9nFRs6eJErm00cAQo1l1xkPrhItoB33QkkQPS5ElqZePXJ70u9bDl2r5Nj2GqNDq0CKNGtbFmgMNdqYXlhDEJVjLPruTwP6GYVO--fyLuAgwrQIlPu2lhu52958Mpfs_Y458W4w-eQuYVthw9LppTWPEYCbE9hgbSZEWvNWGG1Q9ch1h6apDNAJenfF",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ISk7BFSjfehO1BBN3HZzyQMF0UCDMTiZobq8AHSZAP7mgSJM9hmTf6BueUXhgBRQWfmxjzwYUKrCGW61Y99CBQ5kQAgOOP2ba-QATHXNSLwnGhHI1EL2XK6gE887w3Sb9o3OVpcUgjFm0YtcpdLYuinXw_kkJDrnD1HLHeuI-Qr6a3JqCC4NAQ4g5FDcM8pJilD43DRz2A09brJLoMCfIYlU__0hLWeUC-oR6iBhK472HTK63b5s-1QzH4qCrx8cZNaDGCK5-gGD",
  },
  {
    id: 2,
    name: "Alex Shoots",
    category: "Photography Expeditions",
    description:
      "Chasing light in the Arctic, the desert, and everywhere in between. Join the shot.",
    trips: 5,
    rating: 5.0,
    badge: { icon: Camera, label: "Expert", color: "text-blue-500" },
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj_wCmX5Xtr1ikGTthgKoCdKocU5N82XnuGTZd0hGWgsX2fyXhzO1UW-OAqcJPDsKtm9HvUhzNbgZABr3MynPERifdkaUaySGUll_CT-ooEI8wrtLjle0MiFmLZTBRJF68iUgWnCmjqVdXy4Inej-4OFg8jG_H8zme6ZXdovM8vQn-xLt16zbjpalefXYcXM9CQLlG-pMUgkAMb_gEYAesv962l1ifZYnGPPd-Oq2aim-ltGXhTyl23IfqN58lVNlbESBWuLYwYrXd",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vRQGUD137VkLd4ISvmqp_5LNWz0aLh4oNoEzP7uOMHVx9_6mcx-YE0mnz11lK02qiiA7DVvMzXA8SfdnRaIDv-iiJUf8PhIDG406mzLEpjVZDqNBepIcbAP4l_xpMGJYuJ8rtqdCcYX3V5U8xdHUYkVoDqWBV_HToKe0ZZxZFlquqeg4xArBp24BTS6VOrDdMZsGVdSPsY8-BiAdY-C83PefbJOwxwmoTZOBmMKQ4jXjgDbspHdNyeKyh69-GrRLiU-U0RlAcsTo",
  },
  {
    id: 3,
    name: "Nomad Sam",
    category: "Backpacking & Hiking",
    description:
      "Budget-friendly adventures for the wild at heart. Let's get lost together.",
    trips: 8,
    rating: 4.8,
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2jlOxcS_08jQ-mBzIPzrSBTCNwLIQBarZ7kO2Mmd6OUSkiwn8Aa7hRg_kfNNQ7PwCFZJKzgOehIoim-4K4mFBzAVwpRJE0n0I_zur34MrSy6jougTreRvSNT4dikmr4LdyT3Vfiwv-dwI6yOoR3YcCEJKDeQHvmYO1eJS8d2JkP6_zZ9-Z_VQaQjVKdZTD_YvTAmF6gcjBYPWKTdDUkjmsKk-a1N0QS9ynXDjmbjWdnWr9Mm2ecP1bYesZrcogs9IxiSCivky5KYf",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW-Gznbhfwwo8XI1amrJu6zYyndaqm_Ngy2eZ1n1g-gaI0ctBRDWLZr99sjePWiturtbLltsgUR9ARpCfpAoSCqxuKBLWLTUjEImOzozhgTz3iiAprAdMYsDS_eoT5CfUgv3o_eo66-QyRZpsIxkWhqK4nU0S4SEQ4O_CYCG-qPlamUaLT54bpGYG0n71qKBsfCoTdwIY1PhOef_TXCIBtM49YSeAiGa9QjaxUFkA0PjkA_wFGu-mclVSC7cF_j3M9PL-GJrBIqOTQ",
  },
  {
    id: 4,
    name: "Yumi Eats",
    category: "Culinary Tours",
    description:
      "Taste the world one bite at a time. Exclusive access to hidden kitchens.",
    trips: 4,
    rating: 5.0,
    badge: { icon: UtensilsCrossed, label: "Foodie", color: "text-pink-500" },
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnOuM3kyaZkzRIYUUbMkROFJU8L0EQzY7n6c1I7FMmI4xSvgr-clSiwRYXngGi22ACtj8yjGf1pBmiEkI2sqVvuChRERrvrW2o9dJS2DUCI51-wPvJBu_otOF_0CbhFm9gHXpqVY9m_4NwYi8ZyVyFSof9_lLRmxt01X4Op95hv_jqhmmG6OLj2-1ARqPgmr3XTpVRaXBoE5oWt2v1g-RIoRBqJTDPimTlLC55W6DtucvXczFojJK3cQALmWPYK8dX1M1LJLnY6a0P",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTv8-aZ7O87lLqJJ7tqqO28CNYdFZOYJT_KgQB-SLU_WoDOH41e3A1DgXAhOFqorrFu6g3igMwPjISLmkv2-s0V0kH0CkVMmOmlHKow_DL_OhgEosBdpED4fsgM213JWCR4sRAyCJpSwbE90mwoaDoxubLa68Fj2Nzld3qPejH6QAXEYlltChMHoFzXgSr4jCn3uWRKbf9ACKHK6aU9gmbDTwSJvhR-dn67BafpZK0MAdf-Mo4SMPI0E-McpFn_JGsKBiBZuFw6RrS",
  },
];

export default function FeaturedCurators() {
  return (
    <section className="py-16 bg-[var(--landing-brand-dark)] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-satoshi-bold">
              Featured Trip Curators
            </h2>
            <p className="text-slate-400 mt-2 font-satoshi">
              Connect with top organizers and agencies making travel magic.
            </p>
          </div>
          <a
            className="hidden md:flex items-center text-[var(--landing-primary)] font-bold text-sm hover:underline gap-1 font-satoshi-bold"
            href="#"
          >
            See all curators
            <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {curators.map((curator) => (
            <div
              key={curator.id}
              className="group relative flex flex-col rounded-[2rem] bg-white overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-2xl"
            >
              <div
                className="h-28 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${curator.coverImage})` }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="px-6 pb-6 pt-0 relative">
                <div className="-mt-10 mb-3 flex justify-between items-end">
                  <div
                    className="h-20 w-20 rounded-full border-4 border-white bg-cover bg-center shadow-md"
                    style={{ backgroundImage: `url(${curator.avatar})` }}
                  ></div>
                  {curator.badge && (
                    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                      <curator.badge.icon
                        className={`w-[14px] h-[14px] ${curator.badge.color}`}
                      />
                      <span className="font-satoshi-bold">{curator.badge.label}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-satoshi-bold">
                  {curator.name}
                </h3>
                <p className="text-xs font-bold text-[var(--landing-primary)] mb-2 font-satoshi-bold">
                  {curator.category}
                </p>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-satoshi">
                  {curator.description}
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 font-satoshi-bold">
                      {curator.trips}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-satoshi-bold">
                      Trips
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 font-satoshi-bold">
                      {curator.rating}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-satoshi-bold">
                      Rating
                    </span>
                  </div>
                  <button className="ml-auto flex h-8 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-bold text-white transition-colors hover:bg-[var(--landing-primary)] font-satoshi-bold">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
