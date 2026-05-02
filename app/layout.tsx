import { CartSidebarWrapper } from "@/components/cart/CartSidebarWrapper";
import { PublicRouteAssistant } from "@/components/chat/PublicRouteAssistant";
import NotificationsProvider from "@/components/notifications/NotificationsProvider";
import { AppChrome } from "@/components/shared/AppChrome";
import { AuthenticatedRestrictionInitializer } from "@/components/shared/AuthenticatedRestrictionInitializer";
import { CartInitializer } from "@/components/shared/CartInitializer";
import { KallesBackground } from "@/components/shared/KallesBackground";
import { LocationInitializer } from "@/components/shared/LocationInitializer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { CartSidebarProvider } from "@/lib/cart-sidebar-context";
import { CheckoutProvider } from "@/lib/context/CheckoutContext";
import { RestrictionStatusProvider } from "@/lib/context/RestrictionStatusContext";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://ezlabtesting.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ez LabTesting - HIPAA-Secure Lab Tests Online",
    template: "%s | Ez LabTesting",
  },
  description:
    "Order lab tests online without a doctor's visit. HIPAA-secure, CLIA-certified labs, encrypted checkout. Access your lab results online securely.",
  keywords:
    "lab tests, online lab testing, health testing, medical tests, blood tests, diagnostic tests, wellness tests",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Ez LabTesting - Complete Lab Tests Without a Doctor's Visit",
    description:
      "Get comprehensive lab results from CLIA-certified facilities. Order online, visit your nearest collection center, and access secure reports.",
    siteName: "Ez LabTesting",
    images: [
      {
        url: "https://ezlabtesting.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ez LabTesting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ez LabTesting - HIPAA-Secure Lab Tests Online",
    description:
      "Get comprehensive lab results from CLIA-certified facilities. Order online, visit your nearest collection center, and access secure reports.",
    images: ["https://ezlabtesting.com/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ezlabtesting.com/#website",
      url: "https://ezlabtesting.com/",
      name: "Ez LabTesting",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://ezlabtesting.com/tests?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "MedicalOrganization",
      "@id": "https://ezlabtesting.com/#organization",
      name: "Ez LabTesting",
      url: "https://ezlabtesting.com/",
      logo: "https://ezlabtesting.com/logo.png",
      sameAs: [
        "https://www.facebook.com/ezlabtesting",
        "https://www.instagram.com/ezlabtesting",
      ],
      description:
        "Comprehensive online lab testing services utilizing CLIA-certified facilities.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className='smooth-scroll'
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className='antialiased custom-scrollbar' suppressHydrationWarning>
        <Script
          id='sanitize-browser-injected-attrs'
          strategy='beforeInteractive'
        >
          {`(() => {
  const BIS_ATTRS = ['bis_skin_checked', 'bis_register'];
  const SELECTOR = BIS_ATTRS.map(a => '[' + a + ']').join(',');

  function stripNode(node) {
    if (node.nodeType !== 1) return;
    for (var i = 0; i < BIS_ATTRS.length; i++) {
      if (node.hasAttribute(BIS_ATTRS[i])) node.removeAttribute(BIS_ATTRS[i]);
    }
  }

  function stripAll(root) {
    try {
      var nodes = root.querySelectorAll(SELECTOR);
      for (var i = 0; i < nodes.length; i++) stripNode(nodes[i]);
    } catch(e) {}
  }

  function startObserver() {
    stripAll(document.body);
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes') {
          stripNode(m.target);
        } else if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var n = m.addedNodes[j];
            if (n.nodeType === 1) { stripNode(n); stripAll(n); }
          }
        }
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: BIS_ATTRS,
      subtree: true,
      childList: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  } else {
    startObserver();
  }
})();`}
        </Script>
        <KallesBackground />

        <AuthProvider>
          <CartInitializer />
          <NotificationsProvider />
          <RestrictionStatusProvider>
            <AuthenticatedRestrictionInitializer />
            <CheckoutProvider>
              <CartSidebarProvider>
                <LocationInitializer />
                <AppChrome>{children}</AppChrome>
                <PublicRouteAssistant />
                <CartSidebarWrapper />
                <Toaster />
              </CartSidebarProvider>
            </CheckoutProvider>
          </RestrictionStatusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
