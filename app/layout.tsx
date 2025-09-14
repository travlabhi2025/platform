import type { Metadata } from "next";
import { Poppins, Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import GaretBook from "next/font/local";
import GaretHeavy from "next/font/local";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebasneue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const plusjakartasans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarata-sans",
  subsets: ["latin"],
  weight: ["700"],
});

const garetbook = GaretBook({
  src: "../public/fonts/Garet-Book.otf",
  variable: "--font-garetbook",
});

const garetheavy = GaretHeavy({
  src: "../public/fonts/Garet-Heavy.otf",
  variable: "--font-garetheavy",
});

export const metadata: Metadata = {
  title: "TravlAbhi - Travel More with TravlAbhi",
  description:
    "Discover amazing travel destinations and book your next adventure with TravlAbhi. Explore the world with confidence and create unforgettable memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${bebasneue.variable} ${garetbook.variable} ${garetheavy.variable} ${plusjakartasans.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
