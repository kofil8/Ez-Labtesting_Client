"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { useCartStore } from "@/lib/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, ShoppingCart, Sparkles, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { toggleCart } = useCartSidebar();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/tests", label: "Browse Tests", showAlways: true },
    { href: "/panels", label: "Test Panels", showAlways: true },
    { href: "/find-lab-center", label: "Find a Lab Center", showAlways: true },
    { href: "/results", label: "My Results", showWhenAuth: true },
    { href: "/admin", label: "Admin", adminOnly: true },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        isScrolled
          ? "bg-kalles-card-strong border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-md"
          : "bg-kalles-card border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm"
      }`}
    >
      <div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        <div className='flex h-14 sm:h-16 items-center justify-between'>
          {/* Logo - Awsmd style */}
          <Link href='/' className='flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0'>
            <motion.div
              className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 awsmd-rounded flex items-center justify-center transition-all'
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src='https://ik.imagekit.io/an6uwgksy/logo.png'
                alt='Ez LabTesting'
                width={48}
                height={48}
                className='w-full h-full object-contain'
                priority
                unoptimized
              />
            </motion.div>
            <span className='text-base sm:text-lg md:text-xl lg:text-2xl font-black awsmd-gradient-text truncate max-w-[100px] xs:max-w-[120px] sm:max-w-none'>
              Ez LabTesting
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-1'>
            {navLinks.map((link) => {
              const shouldShow =
                link.showAlways ||
                (link.showWhenAuth && isAuthenticated) ||
                (link.adminOnly && user?.role === "admin");

              if (!shouldShow) return null;

              // Check if current pathname matches the link (exact match or starts with link + /)
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href + "/"));

              // Only show indicator for these three navigation items when active
              const showIndicator =
                (link.href === "/tests" ||
                  link.href === "/panels" ||
                  link.href === "/find-lab-center") &&
                isActive;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className='relative px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 text-sm lg:text-base font-bold transition-all hover:text-primary group'
                >
                  {showIndicator && (
                    <svg
                      className='absolute inset-0 pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:drop-shadow-lg'
                      viewBox='0 0 200 60'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      preserveAspectRatio='none'
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${link.href.replace(/\//g, "-")}`}
                          x1='0%'
                          y1='0%'
                          x2='0%'
                          y2='100%'
                        >
                          <stop
                            offset='0%'
                            stopColor='currentColor'
                            stopOpacity='0.1'
                          />
                          <stop
                            offset='100%'
                            stopColor='currentColor'
                            stopOpacity='0.05'
                          />
                        </linearGradient>
                        <filter id={`shadow-${link.href.replace(/\//g, "-")}`}>
                          <feGaussianBlur in='SourceAlpha' stdDeviation='3' />
                          <feOffset dx='0' dy='4' result='offsetblur' />
                          <feComponentTransfer>
                            <feFuncA type='linear' slope='0.3' />
                          </feComponentTransfer>
                          <feMerge>
                            <feMergeNode />
                            <feMergeNode in='SourceGraphic' />
                          </feMerge>
                        </filter>
                      </defs>
                      <rect
                        x='2.5'
                        y='2.5'
                        width='195'
                        height='55'
                        rx='20'
                        ry='20'
                        fill={`url(#gradient-${link.href.replace(/\//g, "-")})`}
                        className='group-hover:opacity-20 transition-all duration-300'
                      />
                      <rect
                        x='2.5'
                        y='2.5'
                        width='195'
                        height='55'
                        rx='20'
                        ry='20'
                        stroke='currentColor'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        className='text-primary opacity-70 animate-pulse group-hover:opacity-100 group-hover:stroke-[3] transition-all duration-300'
                        style={{ animationDuration: "3s" }}
                        filter={`url(#shadow-${link.href.replace(/\//g, "-")})`}
                      />
                    </svg>
                  )}
                  <span className='relative z-10'>{link.label}</span>
                  <span className='absolute inset-0 awsmd-rounded bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 scale-0 group-hover:scale-100 transition-all duration-300' />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-1 sm:gap-2'>
            {/* Cart */}
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleCart}
              className='relative hover:bg-primary/10 transition-colors group h-9 w-9 sm:h-10 sm:w-10'
            >
              <ShoppingCart className='h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform' />
              {isMounted && (
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold shadow-lg'
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </Button>

            {/* Auth - Desktop */}
            <div className='hidden lg:flex items-center gap-2'>
              {isAuthenticated ? (
                <>
                  <Link href='/profile'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:bg-primary/10 transition-colors group'
                      title='My Account'
                    >
                      <User className='h-5 w-5 group-hover:scale-110 transition-transform' />
                    </Button>
                  </Link>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={logout}
                    className='hover:bg-destructive/10 hover:text-destructive transition-colors group'
                  >
                    <LogOut className='h-5 w-5 group-hover:scale-110 transition-transform' />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='ghost'
                    asChild
                    className='hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 awsmd-rounded font-bold'
                  >
                    <Link href='/login'>Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className='awsmd-gradient-cosmic text-white hover:opacity-90 transition-all shadow-xl hover:shadow-2xl awsmd-rounded font-bold px-6 button-shine'
                  >
                    <Link href='/signup' className='flex items-center gap-2'>
                      <Sparkles className='h-5 w-5 group-hover:rotate-12 transition-transform' />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden h-9 w-9 sm:h-10 sm:w-10'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className='h-4 w-4 sm:h-5 sm:w-5' />
              ) : (
                <Menu className='h-4 w-4 sm:h-5 sm:w-5' />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='lg:hidden overflow-hidden border-t bg-background/95 backdrop-blur-xl'
          >
            <div className='container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3'>
              {navLinks.map((link) => {
                const shouldShow =
                  link.showAlways ||
                  (link.showWhenAuth && isAuthenticated) ||
                  (link.adminOnly && user?.role === "admin");

                if (!shouldShow) return null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block px-3 sm:px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 transition-colors'
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className='pt-2 sm:pt-3 border-t space-y-2'>
                {isAuthenticated ? (
                  <>
                    <Link
                      href='/profile'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant='ghost' className='w-full justify-start'>
                        <User className='h-4 w-4 mr-2' />
                        My Account
                      </Button>
                    </Link>
                    <Button
                      variant='ghost'
                      className='w-full justify-start text-destructive hover:bg-destructive/10'
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href='/login'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant='ghost' className='w-full'>
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href='/signup'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className='w-full gradient-cosmic'>
                        <Sparkles className='h-4 w-4 mr-2' />
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
