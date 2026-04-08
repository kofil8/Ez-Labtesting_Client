"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { useCartStore } from "@/lib/store/cart-store";
import { LifeBuoy, ShieldCheck } from "lucide-react";
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
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoginPage) {
    return (
      <>
        <a
          href='#page-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        >
          Skip to main content
        </a>

        <header className='sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl'>
          <div className='container mx-auto px-4 min-[600px]:px-6 lg:px-8 xl:px-10 min-[1536px]:px-12'>
            <div className='flex h-16 items-center justify-between gap-2 min-[600px]:h-[4.25rem]'>
              <HeaderLogo onClick={handleLinkClick} />

              <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
                <span className='hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  Secure access
                </span>

                <Button
                  variant='ghost'
                  asChild
                  className='h-10 min-w-10 rounded-full px-0 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 xs:px-3.5'
                >
                  <Link href='/help-center' onClick={handleLinkClick}>
                    <LifeBuoy className='h-4 w-4' />
                    <span className='sr-only xs:not-sr-only'>Support</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>
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
