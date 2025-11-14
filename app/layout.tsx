import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { LocationInitializer } from "@/components/shared/LocationInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kevin Lab Testing - Order Lab Tests Without a Doctor",
  description: "Order lab tests online without a doctor's visit. HIPAA-secure, CLIA-certified labs, encrypted checkout. Fast turnaround times.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className={`${inter.className} antialiased custom-scrollbar`}>
        <AuthProvider>
          <LocationInitializer />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

