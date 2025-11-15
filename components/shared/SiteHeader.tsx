"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, ShoppingCart, Sparkles, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());
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
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo - Awsmd style */}
          <Link href='/' className='flex items-center gap-2 sm:gap-3 group'>
            <motion.div
              className='w-10 h-10 sm:w-12 sm:h-12 awsmd-rounded flex items-center justify-center transition-all'
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src='/images/logo.png'
                alt='Ez LabTesting'
                width={48}
                height={48}
                className='w-full h-full object-contain'
              />
            </motion.div>
            <span className='text-lg sm:text-xl md:text-2xl font-black awsmd-gradient-text truncate max-w-[120px] sm:max-w-none'>
              Ez LabTesting
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-1'>
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
                  className='relative px-5 py-2.5 text-base font-bold transition-all hover:text-primary group'
                >
                  {link.href === "/tests" && (
                    <svg
                      className='absolute -inset-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[50px] pointer-events-none'
                      viewBox='0 0 140 50'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <rect
                        x='5'
                        y='5'
                        width='130'
                        height='40'
                        rx='20'
                        ry='20'
                        stroke='currentColor'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        className='text-primary opacity-70 animate-pulse'
                        style={{ animationDuration: "3s" }}
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
          <div className='flex items-center gap-2'>
            {/* Cart */}
            <Link href='/cart'>
              <Button
                variant='ghost'
                size='icon'
                className='relative hover:bg-primary/10 transition-colors group'
              >
                <ShoppingCart className='h-5 w-5 group-hover:scale-110 transition-transform' />
                {isMounted && (
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs text-white flex items-center justify-center font-bold shadow-lg'
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </Button>
            </Link>

            {/* Auth - Desktop */}
            <div className='hidden md:flex items-center gap-2'>
              {isAuthenticated ? (
                <>
                  <Link href='/results'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:bg-primary/10 transition-colors group'
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
              className='md:hidden'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
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
            className='md:hidden overflow-hidden border-t bg-background/95 backdrop-blur-xl'
          >
            <div className='container mx-auto px-4 py-4 space-y-3'>
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
                    className='block px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 transition-colors'
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className='pt-3 border-t space-y-2'>
                {isAuthenticated ? (
                  <>
                    <Link
                      href='/results'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant='ghost' className='w-full justify-start'>
                        <User className='h-4 w-4 mr-2' />
                        My Profile
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
