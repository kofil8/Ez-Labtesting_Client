"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MapPinned,
  ReceiptText,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentType, useMemo, useTransition } from "react";
import { useAuth } from "@/lib/auth-context";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";

type CustomerShellItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: CustomerShellItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutGrid },
  { href: "/profile/orders", label: "Orders", icon: FlaskConical },
  { href: "/results", label: "Results", icon: ReceiptText },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/security", label: "Security", icon: Shield },
  { href: "/help-center", label: "Support", icon: LifeBuoy },
];

function buildInitials(firstName?: string, lastName?: string, email?: string) {
  const source = [firstName, lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  if (source) {
    return source
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  return email?.charAt(0).toUpperCase() || "C";
}

function formatMemberSince(createdAt?: string) {
  if (!createdAt) {
    return "New member";
  }

  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) {
    return "New member";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function CustomerDashboardShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer?: CustomerDashboardViewer | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const displayUser = user ?? viewer ?? null;

  const pageMeta = useMemo(() => {
    if (pathname === "/dashboard/customer") {
      return {
        title: "Overview",
        subtitle:
          "Track orders, results, and the next step for your account.",
      };
    }

    if (pathname?.startsWith("/profile/orders")) {
      return {
        title: "Order History",
        subtitle: "Monitor current orders, requisitions, and past activity.",
      };
    }

    if (pathname?.startsWith("/results")) {
      return {
        title: "Results",
        subtitle: "Open reports, check timelines, and download documents.",
      };
    }

    if (pathname?.startsWith("/profile/security")) {
      return {
        title: "Security",
        subtitle: "Protect your account with stronger sign-in controls.",
      };
    }

    if (pathname?.startsWith("/help-center")) {
      return {
        title: "Support",
        subtitle: "Get help with orders, billing, or result access.",
      };
    }

    if (pathname?.startsWith("/profile")) {
      return {
        title: "Profile",
        subtitle: "Keep patient, contact, and account details current.",
      };
    }

    return {
      title: "Dashboard",
      subtitle: "Secure account workspace.",
    };
  }, [pathname]);

  const initials = buildInitials(
    displayUser?.firstName,
    displayUser?.lastName,
    displayUser?.email,
  );
  const accountLabel = displayUser?.mfaEnabled
    ? "MFA protected"
    : "Standard access";

  const handleLogout = async () => {
    startSignOutTransition(() => {
      void (async () => {
        await logout();
        router.push("/");
      })();
    });
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f6fbff_0%,#edf7ff_32%,#f8fbfd_100%)]'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-[-10rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-300/20 blur-3xl' />
        <div className='absolute right-[-8rem] top-24 h-[18rem] w-[18rem] rounded-full bg-cyan-300/20 blur-3xl' />
        <div className='absolute bottom-[-10rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl' />
        <div className='absolute inset-0 bg-medical-grid opacity-60' />
      </div>

      <div className='relative mx-auto flex min-h-screen w-full max-w-[1680px] gap-4 px-3 py-3 sm:px-4 lg:px-5 lg:py-5'>
        <aside className='sticky top-0 hidden h-[calc(100vh-2.5rem)] w-[300px] shrink-0 rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-36px_rgba(14,116,144,0.42)] backdrop-blur-xl lg:flex lg:flex-col'>
          <Link
            href='/dashboard/customer'
            className='flex items-center gap-3 rounded-[24px] border border-sky-100 bg-sky-50/70 px-3 py-3'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200'>
              <FlaskConical className='h-5 w-5' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-950'>Ez LabTesting</p>
              <p className='text-xs uppercase tracking-[0.24em] text-sky-700'>
                Customer Portal
              </p>
            </div>
          </Link>

          <div className='mt-7 rounded-[28px] border border-slate-200 bg-slate-50/90 px-4 py-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-500'>
              Quick access
            </p>
            <div className='mt-3 grid gap-2'>
              <Button
                asChild
                variant='outline'
                className='justify-start rounded-2xl border-slate-200 bg-white'
              >
                <Link href='/tests'>Browse Tests</Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='justify-start rounded-2xl bg-white text-slate-700 hover:bg-slate-100'
              >
                <Link href='/find-lab-center'>Find Lab Center</Link>
              </Button>
            </div>
          </div>

          <nav className='mt-7 space-y-2'>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard/customer" &&
                  pathname?.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200"
                      : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-950",
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className='mt-auto space-y-4 rounded-[28px] border border-slate-200/80 bg-slate-50/90 px-4 py-4'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-500'>
                Account Snapshot
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-950'>
                {displayUser?.email || "Customer"}
              </p>
              <p className='mt-1 text-sm text-slate-600'>{accountLabel}</p>
            </div>

            <div className='grid grid-cols-2 gap-2 text-xs font-medium'>
              <div className='rounded-2xl bg-white px-3 py-3 text-slate-600 shadow-sm'>
                <p className='text-[11px] uppercase tracking-[0.18em] text-slate-400'>
                  Verified
                </p>
                <p className='mt-1 text-sm font-semibold text-slate-900'>
                  {displayUser?.isVerified ? "Yes" : "Pending"}
                </p>
              </div>
              <div className='rounded-2xl bg-white px-3 py-3 text-slate-600 shadow-sm'>
                <p className='text-[11px] uppercase tracking-[0.18em] text-slate-400'>
                  Member Since
                </p>
                <p className='mt-1 text-sm font-semibold text-slate-900'>
                  {formatMemberSince(displayUser?.createdAt)}
                </p>
              </div>
            </div>

            <Button
              type='button'
              variant='ghost'
              onClick={handleLogout}
              disabled={isSigningOut}
              className='w-full justify-start rounded-2xl border border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-100'
            >
              <LogOut className='mr-2 h-4 w-4' />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </aside>

        <div className='flex min-h-screen min-w-0 flex-1 flex-col'>
          <header className='rounded-[32px] border border-white/70 bg-white/75 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl'>
            <div className='flex flex-col gap-4 px-4 py-4 sm:px-5 lg:px-7'>
              <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
                <div className='min-w-0'>
                  <h1 className='text-2xl font-semibold text-slate-950'>
                    {pageMeta.title}
                  </h1>
                  <p className='mt-1 max-w-2xl text-sm leading-6 text-slate-600'>
                    {pageMeta.subtitle}
                  </p>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                  <Button
                    asChild
                    variant='outline'
                    className='hidden rounded-full border-sky-200 bg-sky-50/70 text-sky-900 hover:bg-sky-100 sm:inline-flex'
                  >
                    <Link href='/find-lab-center'>
                      <MapPinned className='h-4 w-4' />
                      Find Lab
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className='hidden rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200 hover:from-sky-700 hover:to-cyan-600 sm:inline-flex'
                  >
                    <Link href='/tests'>
                      Browse Tests
                    </Link>
                  </Button>
                  <NotificationsBell />
                  <Link
                    href='/profile'
                    className='flex max-w-full items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-2.5 py-2 text-left shadow-sm transition-colors hover:border-slate-300'
                  >
                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-sm font-semibold text-white shadow-md shadow-sky-200'>
                      {initials}
                    </div>
                    <div className='hidden min-w-0 sm:block'>
                      <p className='truncate text-sm font-medium text-slate-900'>
                        {displayUser?.firstName || "Customer"}
                      </p>
                      <div className='flex items-center gap-2 text-xs text-slate-500'>
                        <span className='truncate'>{displayUser?.email}</span>
                        {displayUser?.mfaEnabled ? (
                          <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700'>
                            <ShieldCheck className='h-3 w-3' />
                            Secured
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <nav className='flex gap-2 overflow-x-auto pb-1 lg:hidden'>
                  {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive =
                      pathname === href ||
                      (href !== "/dashboard/customer" &&
                        pathname?.startsWith(`${href}/`));

                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-slate-200 bg-white text-slate-600",
                        )}
                      >
                        <Icon className='h-4 w-4' />
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                <div className='ml-auto flex items-center gap-2 lg:hidden'>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='rounded-full border-sky-200 bg-sky-50/70 text-sky-900 hover:bg-sky-100'
                  >
                    <Link href='/tests'>Browse Tests</Link>
                  </Button>
                  <button
                    type='button'
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600'
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className='flex-1 px-0 py-4 sm:py-5 lg:py-6'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
