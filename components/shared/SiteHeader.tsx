"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { getPushToken } from "@/lib/firebase/getPushToken";
import { useCartStore } from "@/lib/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Shield,
  ShoppingCart,
  Sparkles,
  TestTube2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationTestButton } from "../notifications/SendTestNotificationButton";

// Icon mapping for navigation links
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/tests": TestTube2,
  "/panels": Package,
  "/find-lab-center": MapPin,
  "/results": FileText,
  "/admin": Shield,
};

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/tests", label: "Browse Tests", showAlways: true },
    { href: "/panels", label: "Test Panels", showAlways: true },
    { href: "/find-lab-center", label: "Find a Lab Center", showAlways: true },
    { href: "/results", label: "My Results", showWhenAuth: true },
    { href: "/admin", label: "Admin", adminOnly: true },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
          isScrolled
            ? "bg-kalles-card-strong border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-md"
            : "bg-kalles-card border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm"
        }`}
      >
        <div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          <div className='flex h-14 sm:h-16 items-center justify-between'>
            {/* Logo */}
            <Link
              href='/'
              className='flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0 min-w-0'
              onClick={handleLinkClick}
            >
              <motion.div
                className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 awsmd-rounded flex items-center justify-center transition-all flex-shrink-0'
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
              <span className='text-base sm:text-lg md:text-xl lg:text-2xl font-black awsmd-gradient-text truncate'>
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

                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href + "/"));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='relative px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 text-sm lg:text-base font-bold transition-all hover:text-primary group'
                  >
                    <span className='relative z-10'>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId='activeIndicatorDesktop'
                        className='absolute bottom-0 left-0 right-0 border-b-2 border-dotted border-red-500 group-hover:hidden'
                        initial={false}
                      />
                    )}
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
                className='relative hover:bg-primary/10 transition-colors group h-10 w-10 sm:h-11 sm:w-11 touch-manipulation'
                aria-label={
                  isMounted
                    ? `Shopping cart${
                        itemCount > 0 ? ` with ${itemCount} items` : ""
                      }`
                    : "Shopping cart"
                }
              >
                <ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform' />

                {isMounted && (
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className='absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold shadow-lg'
                      >
                        {itemCount > 99 ? "99+" : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </Button>

              {/* Auth - Desktop */}
              {/* 🔥 Test Push Button (desktop only) */}
              {isAuthenticated && (
                <div className='hidden lg:flex'>
                  <NotificationTestButton />
                </div>
              )}
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
                      onClick={async () => {
                        const token = await getPushToken();
                        await logout(token);
                        router.push("/");
                      }}
                      className='hover:bg-destructive/10 hover:text-destructive transition-colors group'
                      title='Sign Out'
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
                        Register
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden h-10 w-10 sm:h-11 sm:w-11 touch-manipulation'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className='h-5 w-5 sm:h-6 sm:w-6' />
                  ) : (
                    <Menu className='h-5 w-5 sm:h-6 sm:w-6' />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide in from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden'
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className='fixed right-0 top-0 z-[70] h-screen w-full max-w-sm bg-background border-l border-gray-200 dark:border-gray-700 shadow-2xl overflow-y-auto lg:hidden'
            >
              {/* Mobile Menu Header */}
              <div className='flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-kalles-card-strong sticky top-0 z-10'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='w-8 h-8 sm:w-10 sm:h-10 awsmd-rounded flex items-center justify-center flex-shrink-0'>
                    <Image
                      src='https://ik.imagekit.io/an6uwgksy/logo.png'
                      alt='Ez LabTesting'
                      width={40}
                      height={40}
                      className='w-full h-full object-contain'
                      unoptimized
                    />
                  </div>
                  <span className='text-lg sm:text-xl font-black awsmd-gradient-text'>
                    Menu
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='h-10 w-10 sm:h-11 sm:w-11 touch-manipulation'
                  aria-label='Close menu'
                >
                  <X className='h-5 w-5 sm:h-6 sm:w-6' />
                </Button>
              </div>

              {/* Mobile Menu Content */}
              <div className='p-4 sm:p-5 space-y-1'>
                {/* Navigation Links */}
                <nav className='space-y-1 mb-4'>
                  {navLinks.map((link, index) => {
                    const shouldShow =
                      link.showAlways ||
                      (link.showWhenAuth && isAuthenticated) ||
                      (link.adminOnly && user?.role === "admin");

                    if (!shouldShow) return null;

                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" &&
                        pathname?.startsWith(link.href + "/"));

                    const IconComponent = iconMap[link.href] || Home;

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className='group relative flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground'
                        >
                          <IconComponent className='h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-muted-foreground' />
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId='activeIndicator'
                              className='absolute bottom-0 left-0 right-0 border-b-2 border-dotted border-red-500 group-hover:hidden'
                              initial={false}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Divider */}
                <div className='my-4 sm:my-5 border-t border-gray-200 dark:border-gray-700' />

                {/* Auth Section */}
                <div className='space-y-2'>
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link href='/profile' onClick={handleLinkClick}>
                          <Button
                            variant='ghost'
                            className='w-full justify-start h-12 sm:h-14 text-base sm:text-lg font-semibold touch-manipulation'
                          >
                            <User className='h-5 w-5 sm:h-6 sm:w-6 mr-3' />
                            My Account
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Button
                          variant='ghost'
                          className='w-full justify-start h-12 sm:h-14 text-base sm:text-lg font-semibold text-destructive hover:bg-destructive/10 touch-manipulation'
                          onClick={async () => {
                            const token = await getPushToken();
                            await logout(token);
                            setIsMobileMenuOpen(false);
                            router.push("/");
                          }}
                        >
                          <LogOut className='h-5 w-5 sm:h-6 sm:w-6 mr-3' />
                          Sign Out
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link href='/login' onClick={handleLinkClick}>
                          <Button
                            variant='outline'
                            className='w-full h-12 sm:h-14 text-base sm:text-lg font-semibold touch-manipulation'
                          >
                            Sign In
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Link href='/signup' onClick={handleLinkClick}>
                          <Button className='w-full h-12 sm:h-14 text-base sm:text-lg font-semibold awsmd-gradient-cosmic text-white shadow-xl hover:shadow-2xl touch-manipulation'>
                            <Sparkles className='h-5 w-5 sm:h-6 sm:w-6 mr-2' />
                            Register
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* User Info (if authenticated) */}
                {isAuthenticated && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  >
                    <p className='text-sm font-medium text-muted-foreground mb-1'>
                      Signed in as
                    </p>
                    <p className='text-base sm:text-lg font-semibold'>
                      {user.email}
                    </p>
                    {user.role === "admin" && (
                      <span className='inline-block mt-2 px-2 py-1 text-xs font-bold rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                        Admin
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
