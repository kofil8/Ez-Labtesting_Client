"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import {
  getRestrictionMessage,
  getRestrictionStateLabel,
  isRestrictionBlocked,
} from "@/lib/restrictions/presentation";
import { useCartStore } from "@/lib/store/cart-store";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
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
  { href: "/panels", label: "Test Panels" },
  { href: "/find-lab-center", label: "Find Lab Center" },
  { href: "/help-center", label: "Support" },
];

const CUSTOMER_NAV_LINKS: NavLink[] = [
  { href: "/dashboard/customer", label: "Dashboard" },
  { href: "/dashboard/customer/orders", label: "Orders" },
  { href: "/dashboard/customer/results", label: "Results" },
];

const ADMIN_NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Admin" },
  { href: "/help-center", label: "Support" },
];

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const { status: restrictionStatus } = useRestrictionStatus();
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { toggleCart } = useCartSidebar();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

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
  const isLoginPage = pathname === "/login";

  const filteredLinks = useMemo(() => {
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
  }, [isAuthenticated, isCustomer, isAdmin, isSuperAdmin]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const restrictionMessage = getRestrictionMessage(restrictionStatus);
  const restrictionState = getRestrictionStateLabel(restrictionStatus);
  const showRestrictionBanner =
    isRestrictionBlocked(restrictionStatus) && Boolean(restrictionMessage);
  const restrictionBanner = showRestrictionBanner ? (
    <div className='border-b border-amber-200 bg-amber-50/95 text-amber-950 backdrop-blur'>
      <div className='container mx-auto flex items-center gap-3 px-4 py-2 text-sm min-[600px]:px-6 lg:px-8 xl:px-10 min-[1536px]:px-12'>
        <AlertTriangle className='h-4 w-4 shrink-0 text-amber-700' />
        <p className='font-medium'>
          {restrictionMessage}
          {restrictionState ? ` State: ${restrictionState}.` : ""}
        </p>
      </div>
    </div>
  ) : null;

  if (isLoginPage) {
    return (
      <>
        <a
          href='#page-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        >
          Skip to main content
        </a>

        <header className='sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl'>
          {restrictionBanner}
          <div className='container mx-auto px-4 min-[600px]:px-6 lg:px-8 xl:px-10 min-[1536px]:px-12'>
            <div className='flex h-16 items-center justify-between gap-2 min-[600px]:h-[4.5rem] min-[600px]:gap-3'>
              <HeaderLogo onClick={handleLinkClick} />

              <HeaderNav
                links={PUBLIC_NAV_LINKS}
                onLinkClick={handleLinkClick}
              />

              <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
                <span className='hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  Secure access
                </span>

                <Button
                  className='hidden rounded-full bg-[#2b63df] px-5 text-white shadow-[0_10px_20px_-13px_rgba(37,99,235,0.95)] hover:bg-[#1f55cf] lg:inline-flex'
                  asChild
                >
                  <Link href='/register' onClick={handleLinkClick}>
                    Create Account
                  </Link>
                </Button>

                <HeaderActions
                  cartCount={0}
                  onCartClick={() => {}}
                  onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  isMobileMenuOpen={isMobileMenuOpen}
                  isAuthenticated={false}
                  showCart={false}
                />
              </div>
            </div>
          </div>
        </header>

        <MobileHeaderMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          links={PUBLIC_NAV_LINKS}
          isAuthenticated={false}
        />
      </>
    );
  }

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
        {restrictionBanner}
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
