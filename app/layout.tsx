import { CartSidebarWrapper } from "@/components/cart/CartSidebarWrapper";
import { PublicRouteAssistant } from "@/components/chat/PublicRouteAssistant";
import EmailNotificationCenter from "@/components/checkout/EmailNotificationCenter";
import NotificationsProvider from "@/components/notifications/NotificationsProvider";
import { AppChrome } from "@/components/shared/AppChrome";
import { AuthenticatedRestrictionInitializer } from "@/components/shared/AuthenticatedRestrictionInitializer";
import { CartInitializer } from "@/components/shared/CartInitializer";
import { KallesBackground } from "@/components/shared/KallesBackground";
import { LocationInitializer } from "@/components/shared/LocationInitializer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { CartSidebarProvider } from "@/lib/cart-sidebar-context";
import { CheckoutErrorProvider } from "@/lib/checkout-error-context";
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
    default: "EzLabTesting - Order Lab Tests Online",
    template: "%s | Ez LabTesting",
  },
  description:
    "Browse, purchase, and manage lab testing online. Sample collection and testing are handled by authorized partner labs.",
  keywords:
    "lab tests, online lab testing, health testing, medical tests, blood tests, diagnostic tests, wellness tests",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "EzLabTesting - Order Lab Tests Online",
    description:
      "Check availability, order eligible tests, visit an authorized partner location, and access secure results online.",
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
    title: "EzLabTesting - Order Lab Tests Online",
    description:
      "Check availability, order eligible tests, visit an authorized partner location, and access secure results online.",
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
      "@type": "Organization",
      "@id": "https://ezlabtesting.com/#organization",
      name: "Ez LabTesting",
      url: "https://ezlabtesting.com/",
      logo: "https://ezlabtesting.com/logo.png",
      sameAs: [
        "https://www.facebook.com/ezlabtesting",
        "https://www.instagram.com/ezlabtesting",
      ],
      description:
        "Online lab test ordering, checkout, account management, and result access platform.",
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
        <Script id='init-theme' strategy='beforeInteractive'>
          {`(() => {
  try {
    var key = 'ezlab-theme';
    var stored = window.localStorage.getItem(key);
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();`}
        </Script>
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
            <CheckoutErrorProvider>
              <CheckoutProvider>
                <CartSidebarProvider>
                  <LocationInitializer />
                  <AppChrome>{children}</AppChrome>
                  <PublicRouteAssistant />
                  <CartSidebarWrapper />
                  <EmailNotificationCenter />
                  <Toaster />
                </CartSidebarProvider>
              </CheckoutProvider>
            </CheckoutErrorProvider>
          </RestrictionStatusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
