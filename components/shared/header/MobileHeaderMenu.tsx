"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface MobileHeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export function MobileHeaderMenu({
  isOpen,
  onClose,
  links,
  isAuthenticated,
  onLogout,
}: MobileHeaderMenuProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className='fixed inset-0 z-[60] bg-slate-900/45 backdrop-blur-sm lg:hidden'
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className='fixed right-0 top-0 z-[70] h-screen w-[86%] max-w-sm overflow-y-auto border-l border-border bg-background lg:hidden'
          >
            <div className='sticky top-0 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md'>
              <span className='text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground'>
                Navigation
              </span>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
                aria-label='Close menu'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            <div className='space-y-4 p-4'>
              <div className='rounded-2xl border border-border bg-muted/20 p-3'>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
                  Patient Navigation
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Book tests, track results, and manage your account.
                </p>
              </div>

              <div className='space-y-1'>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isLinkActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className='border-t border-border pt-4'>
                {isAuthenticated ? (
                  <div className='space-y-2'>
                    <Link href='/dashboard/customer/profile' onClick={onClose}>
                      <Button
                        variant='ghost'
                        className='w-full justify-start rounded-xl text-foreground hover:bg-muted'
                      >
                        <User className='mr-2 h-4 w-4 text-primary' />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant='ghost'
                      className='w-full justify-start rounded-xl text-destructive hover:bg-destructive/10'
                      onClick={() => {
                        onLogout?.();
                        onClose();
                      }}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-3'>
                    <Button
                      variant='outline'
                      asChild
                      className='rounded-xl border-border'
                    >
                      <Link href='/login' onClick={onClose}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className='rounded-xl bg-primary text-primary-foreground hover:bg-primary/90'
                    >
                      <Link href='/register' onClick={onClose}>
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
