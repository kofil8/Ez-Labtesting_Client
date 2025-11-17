import { CartSidebarWrapper } from "@/components/cart/CartSidebarWrapper";
import { KallesBackground } from "@/components/shared/KallesBackground";
import { LocationInitializer } from "@/components/shared/LocationInitializer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { CartSidebarProvider } from "@/lib/cart-sidebar-context";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Ez LabTesting",
  description:
    "Order lab tests online without a doctor's visit. HIPAA-secure, CLIA-certified labs, encrypted checkout. Fast turnaround times.",
  keywords:
    "lab tests, online lab testing, at-home lab tests, health testing, medical tests, blood tests, urine tests, diagnostic tests, wellness tests, health screenings",
  authors: [{ name: "Ez LabTesting", url: "https://ezlabtesting.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='smooth-scroll' suppressHydrationWarning>
      <body
        className={`${manrope.className} antialiased custom-scrollbar`}
        suppressHydrationWarning
      >
        <KallesBackground />
        <AuthProvider>
          <CartSidebarProvider>
            <LocationInitializer />
            {children}
            <CartSidebarWrapper />
            <Toaster />
          </CartSidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
