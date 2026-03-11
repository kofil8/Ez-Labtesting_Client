"use client";

import { useAuth } from "@/lib/auth-context";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { getPushToken } from "@/lib/firebase/getPushToken";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderAuthButtons } from "./header/HeaderAuthButtons";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderNav } from "./header/HeaderNav";
import { MobileHeaderMenu } from "./header/MobileHeaderMenu";

interface NavLink {
  href: string;
  label: string;
}

const PUBLIC_NAV_LINKS: NavLink[] = [
  { href: "/tests", label: "Browse Tests" },
  { href: "/panels", label: "Health Panels" },
  { href: "/find-lab-center", label: "Find Lab Center" },
  { href: "/help-center", label: "Support" },
];

const CUSTOMER_NAV_LINKS: NavLink[] = [
  { href: "/dashboard/customer", label: "Dashboard" },
  { href: "/transactions", label: "Orders" },
  { href: "/results", label: "Results" },
];

const ADMIN_NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Admin" },
  { href: "/help-center", label: "Support" },
];

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { toggleCart } = useCartSidebar();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const normalizedRole = user?.role?.toString().toLowerCase();
  const isCustomer = normalizedRole === "customer";
  const isSuperAdmin = normalizedRole === "super_admin";
  const isAdmin = normalizedRole === "admin";

  const filteredLinks = useMemo(
    () => {
      if (!isAuthenticated) {
        return PUBLIC_NAV_LINKS;
      }

      if (isCustomer) {
        return [...PUBLIC_NAV_LINKS, ...CUSTOMER_NAV_LINKS];
      }

      if (isAdmin || isSuperAdmin) {
        return ADMIN_NAV_LINKS;
      }

      return PUBLIC_NAV_LINKS;
    },
    [isAuthenticated, isCustomer, isAdmin, isSuperAdmin],
  );

  const handleLogout = async () => {
    const shouldAttachPushToken =
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted";

    const token = shouldAttachPushToken ? await getPushToken() : null;
    await logout(token);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <a
        href='#page-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-border/80 bg-background/95 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-background/85 backdrop-blur-lg"
        }`}
      >
        <div className='container mx-auto px-4 min-[600px]:px-6 lg:px-8 xl:px-10 min-[1536px]:px-12'>
          <div className='flex h-16 items-center justify-between gap-2 min-[600px]:h-[4.25rem] min-[600px]:gap-3 min-[1536px]:h-[4.5rem]'>
            <HeaderLogo onClick={handleLinkClick} />
            <HeaderNav links={filteredLinks} onLinkClick={handleLinkClick} />

            {isMounted && (
              <HeaderAuthButtons
                isAuthenticated={isAuthenticated}
                userEmail={user?.email}
                onLinkClick={handleLinkClick}
                onLogout={handleLogout}
              />
            )}

            {isMounted && (
              <HeaderActions
                cartCount={itemCount}
                onCartClick={toggleCart}
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
                isAuthenticated={isAuthenticated}
                showCart={!isAuthenticated || isCustomer}
              />
            )}
          </div>
        </div>
      </header>

      <MobileHeaderMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={filteredLinks}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
    </>
  );
}
