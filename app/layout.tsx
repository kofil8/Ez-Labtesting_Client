import { TokenRefreshManager } from "@/components/auth/TokenRefreshManager";
import { CartSidebarWrapper } from "@/components/cart/CartSidebarWrapper";
import { ClientInit } from "@/components/ClientInit";
import NotificationsProvider from "@/components/notifications/NotificationsProvider";
import { KallesBackground } from "@/components/shared/KallesBackground";
import { LocationInitializer } from "@/components/shared/LocationInitializer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { CartSidebarProvider } from "@/lib/cart-sidebar-context";
import { CheckoutProvider } from "@/lib/context/CheckoutContext";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ez LabTesting",
  description:
    "Order lab tests online without a doctor's visit. HIPAA-secure, CLIA-certified labs, encrypted checkout.",
  keywords:
    "lab tests, online lab testing, at-home lab tests, health testing, medical tests, blood tests, urine tests, diagnostic tests, wellness tests, health screenings",
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
        <ClientInit />

        <AuthProvider>
          <TokenRefreshManager />
          <NotificationsProvider />
          <CheckoutProvider>
            <CartSidebarProvider>
              <LocationInitializer />
              <SiteHeader />
              <div id='page-content' className='min-h-screen flex flex-col'>
                {children}
              </div>
              <CartSidebarWrapper />
              <Toaster />
            </CartSidebarProvider>
          </CheckoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
