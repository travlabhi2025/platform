import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";

import GaretBook from "next/font/local";
import GaretHeavy from "next/font/local";
import SatoshiLight from "next/font/local";
import SatoshiLightItalic from "next/font/local";
import SatoshiRegular from "next/font/local";
import SatoshiItalic from "next/font/local";
import SatoshiMedium from "next/font/local";
import SatoshiMediumItalic from "next/font/local";
import SatoshiBold from "next/font/local";
import SatoshiBoldItalic from "next/font/local";
import SatoshiBlack from "next/font/local";
import SatoshiBlackItalic from "next/font/local";
// Add more as needed

const satoshiLight = SatoshiLight({
  src: "../public/fonts/Satoshi-Light.otf", // Adjust filename
  variable: "--font-satoshi-light",
  weight: "300",
});

const satoshiLightItalic = SatoshiLightItalic({
  src: "../public/fonts/Satoshi-LightItalic.otf", // Adjust filename
  variable: "--font-satoshi-light-italic",
  weight: "300",
});

const satoshiRegular = SatoshiRegular({
  src: "../public/fonts/Satoshi-Regular.otf", // Adjust filename
  variable: "--font-satoshi-regular",
  weight: "400",
});

const satoshiItalic = SatoshiItalic({
  src: "../public/fonts/Satoshi-Italic.otf", // Adjust filename
  variable: "--font-satoshi-italic",
  weight: "400",
});

const satoshiMedium = SatoshiMedium({
  src: "../public/fonts/Satoshi-Medium.otf", // Adjust filename
  variable: "--font-satoshi-medium",
  weight: "500",
});

const satoshiMediumItalic = SatoshiMediumItalic({
  src: "../public/fonts/Satoshi-MediumItalic.otf", // Adjust filename
  variable: "--font-satoshi-medium-italic",
  weight: "500",
});

const satoshiBold = SatoshiBold({
  src: "../public/fonts/Satoshi-Bold.otf", // Adjust filename
  variable: "--font-satoshi-bold",
  weight: "700",
});

const satoshiBoldItalic = SatoshiBoldItalic({
  src: "../public/fonts/Satoshi-BoldItalic.otf", // Adjust filename
  variable: "--font-satoshi-bold-italic",
  weight: "700",
});

const satoshiBlack = SatoshiBlack({
  src: "../public/fonts/Satoshi-Black.otf", // Adjust filename
  variable: "--font-satoshi-black",
  weight: "900",
});

const satoshiBlackItalic = SatoshiBlackItalic({
  src: "../public/fonts/Satoshi-BlackItalic.otf", // Adjust filename
  variable: "--font-satoshi-black-italic",
  weight: "900",
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
  title: "TripAbhi - Travel More with TripAbhi",
  description:
    "Discover amazing travel destinations and book your next adventure with TripAbhi. Explore the world with confidence and create unforgettable memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${garetbook.variable} ${garetheavy.variable} ${satoshiLight.variable} ${satoshiLightItalic.variable} ${satoshiRegular.variable} ${satoshiItalic.variable} ${satoshiMedium.variable} ${satoshiMediumItalic.variable} ${satoshiBold.variable} ${satoshiBoldItalic.variable} ${satoshiBlack.variable} ${satoshiBlackItalic.variable} antialiased bg-background text-foreground`}
      >
        <MaterialSymbolsLoader />
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
