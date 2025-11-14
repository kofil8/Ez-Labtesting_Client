import { KallesBackground } from "@/components/shared/KallesBackground";
import { LocationInitializer } from "@/components/shared/LocationInitializer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZ Lab Testing",
  description:
    "Order lab tests online without a doctor's visit. HIPAA-secure, CLIA-certified labs, encrypted checkout. Fast turnaround times.",
  keywords:
    "lab tests, online lab testing, at-home lab tests, health testing, medical tests, blood tests, urine tests, diagnostic tests, wellness tests, health screenings",
  authors: [{ name: "EZ Lab Testing", url: "https://ezlabtesting.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='smooth-scroll' suppressHydrationWarning>
      <body className={`${inter.className} antialiased custom-scrollbar`}>
        <KallesBackground />
        <AuthProvider>
          <LocationInitializer />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
