"use client";

import { Play } from "lucide-react";

const reels = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBil5SEDidygr6p8ymW31mJECrjdnjZw3kSrkgFadk0oGcMxujmC_XcCDFLbYXOQ09h-LNq8XIB0L4GNAUjfngPOFY2fmekUJpdyIhX4cMerCGPS8kDIXn6QgRcIzfwWE0SqjKl0gLswjxrYqfIxTcpAptUW_FftqNsDrRAwUbCTh4G8LcOd2YpdekkFbi7xueYbDIFX5_ctyj3zJjx5jEm4JzRK1Rs7j_K6zqjBDVxAESRxLFdivlih5gROJLNeChVsde2h8IzXjbL",
    username: "@jessica_yoga",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ISk7BFSjfehO1BBN3HZzyQMF0UCDMTiZobq8AHSZAP7mgSJM9hmTf6BueUXhgBRQWfmxjzwYUKrCGW61Y99CBQ5kQAgOOP2ba-QATHXNSLwnGhHI1EL2XK6gE887w3Sb9o3OVpcUgjFm0YtcpdLYuinXw_kkJDrnD1HLHeuI-Qr6a3JqCC4NAQ4g5FDcM8pJilD43DRz2A09brJLoMCfIYlU__0hLWeUC-oR6iBhK472HTK63b5s-1QzH4qCrx8cZNaDGCK5-gGD",
    caption: "Morning meditation in Bali 🧘‍♀️",
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhYGCCLa3yHtL_CGfmKrC7rykMEyJ_I8QzVnM66uNICvFPKKpH_dUQD02fQBGzsbT28vy6j7kMdYO30iGmGC9crttuG7SoSBbK-PB9mSocVI_Z813DqxCQXC93K_n1mhdVf9yecBB8ei5ryv18qyA10AQFCxXuY5AkRrOPALZifEtIluMlHpQDM-7Ky8d1ZoVWSa_b-W7bxRg1XVxXt1aNo8Xd1_TlfvbTIMz_E7hvJUuilJni4c7lWiGcehUodKKpcNgbbk3jKBpW",
    username: "@alex_shoots",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vRQGUD137VkLd4ISvmqp_5LNWz0aLh4oNoEzP7uOMHVx9_6mcx-YE0mnz11lK02qiiA7DVvMzXA8SfdnRaIDv-iiJUf8PhIDG406mzLEpjVZDqNBepIcbAP4l_xpMGJYuJ8rtqdCcYX3V5U8xdHUYkVoDqWBV_HToKe0ZZxZFlquqeg4xArBp24BTS6VOrDdMZsGVdSPsY8-BiAdY-C83PefbJOwxwmoTZOBmMKQ4jXjgDbspHdNyeKyh69-GrRLiU-U0RlAcsTo",
    caption: "Chasing waterfalls in Iceland 🧊",
  },
  {
    id: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA39OEJR2C5Gclkfms_f_G3fhlIO6h0AqhF9ZxjZIoI5J7VOxuGliy97IsBhwRLGW5CSjA9eDPHgpCSs9-Ez9nFRs6eJErm00cAQo1l1xkPrhItoB33QkkQPS5ElqZePXJ70u9bDl2r5Nj2GqNDq0CKNGtbFmgMNdqYXlhDEJVjLPruTwP6GYVO--fyLuAgwrQIlPu2lhu52958Mpfs_Y458W4w-eQuYVthw9LppTWPEYCbE9hgbSZEWvNWGG1Q9ch1h6apDNAJenfF",
    username: "@nomad_sam",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW-Gznbhfwwo8XI1amrJu6zYyndaqm_Ngy2eZ1n1g-gaI0ctBRDWLZr99sjePWiturtbLltsgUR9ARpCfpAoSCqxuKBLWLTUjEImOzozhgTz3iiAprAdMYsDS_eoT5CfUgv3o_eo66-QyRZpsIxkWhqK4nU0S4SEQ4O_CYCG-qPlamUaLT54bpGYG0n71qKBsfCoTdwIY1PhOef_TXCIBtM49YSeAiGa9QjaxUFkA0PjkA_wFGu-mclVSC7cF_j3M9PL-GJrBIqOTQ",
    caption: "Rice terrace walk was unreal!",
  },
  {
    id: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2jlOxcS_08jQ-mBzIPzrSBTCNwLIQBarZ7kO2Mmd6OUSkiwn8Aa7hRg_kfNNQ7PwCFZJKzgOehIoim-4K4mFBzAVwpRJE0n0I_zur34MrSy6jougTreRvSNT4dikmr4LdyT3Vfiwv-dwI6yOoR3YcCEJKDeQHvmYO1eJS8d2JkP6_zZ9-Z_VQaQjVKdZTD_YvTAmF6gcjBYPWKTdDUkjmsKk-a1N0QS9ynXDjmbjWdnWr9Mm2ecP1bYesZrcogs9IxiSCivky5KYf",
    username: "@sarah_travels",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwCVLhKCKQoJIeB4mdJMNc71ZRBzO0c2atB5XWc-H6eWncjj-CX7rM2ur6dYAR4kT7WhhbkPFFFu8uYUPfTpBB0HWOO3x3Xz6rd-5Wu85pHcoKlkw0Mh_9GWep04u9E43mM7PjWIHgsSfkqbLK3fvT1oLfr7Cix_TvAlqge-IOWtqlQ12BMuFqnT7elhHy8P69neqr2BGBkS8JUX7RekvTKV65OOiE6E6sM5duBka2OqUqa0RmPWHI3nv0axde9XQeiCZjv8uvAJyb",
    caption: "Sunset dunes 🐪 #morocco",
  },
  {
    id: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnOuM3kyaZkzRIYUUbMkROFJU8L0EQzY7n6c1I7FMmI4xSvgr-clSiwRYXngGi22ACtj8yjGf1pBmiEkI2sqVvuChRERrvrW2o9dJS2DUCI51-wPvJBu_otOF_0CbhFm9gHXpqVY9m_4NwYi8ZyVyFSof9_lLRmxt01X4Op95hv_jqhmmG6OLj2-1ARqPgmr3XTpVRaXBoE5oWt2v1g-RIoRBqJTDPimTlLC55W6DtucvXczFojJK3cQALmWPYK8dX1M1LJLnY6a0P",
    username: "@yumi_eats",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTv8-aZ7O87lLqJJ7tqqO28CNYdFZOYJT_KgQB-SLU_WoDOH41e3A1DgXAhOFqorrFu6g3igMwPjISLmkv2-s0V0kH0CkVMmOmlHKow_DL_OhgEosBdpED4fsgM213JWCR4sRAyCJpSwbE90mwoaDoxubLa68Fj2Nzld3qPejH6QAXEYlltChMHoFzXgSr4jCn3uWRKbf9ACKHK6aU9gmbDTwSJvhR-dn67BafpZK0MAdf-Mo4SMPI0E-McpFn_JGsKBiBZuFw6RrS",
    caption: "Best sushi I've ever had! 🍣",
  },
];

export default function TravelReels() {
  return (
    <section className="py-16 bg-[var(--landing-background-dark)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-white">
            <Play className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-white font-satoshi-bold">
            Travel Reels
          </h2>
        </div>
        <p className="text-slate-400 ml-11 font-satoshi">
          Watch moments captured by our community.
        </p>
      </div>
      <div className="flex w-full overflow-x-auto no-scrollbar gap-4 px-4 lg:px-10 pb-4">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative shrink-0 w-[200px] h-[350px] rounded-[1.5rem] overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${reel.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 bg-cover"
                  style={{ backgroundImage: `url(${reel.avatar})` }}
                ></div>
                <span className="text-xs font-bold shadow-black drop-shadow-md font-satoshi-bold">
                  {reel.username}
                </span>
              </div>
              <p className="text-sm font-medium leading-tight font-satoshi-medium">
                {reel.caption}
              </p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="text-white w-6 h-6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
