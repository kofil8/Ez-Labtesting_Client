"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { useCartRestrictionGuard } from "@/hook/useCartRestrictionGuard";
import { useAuth } from "@/lib/auth-context";
import {
  buildCartItemFromPublicTest,
  canAddCatalogTestToCart,
} from "@/lib/tests/cart-item";
import {
  formatStartingPriceLabel,
  formatTurnaroundDaysLabel,
  getCatalogTurnaroundDays,
  getTestStartingLab,
} from "@/lib/tests/storefront-display";
import { useCartStore } from "@/lib/store/cart-store";
import type { PublicCatalogTest } from "@/types/public-test";
import {
  ArrowRight,
  Beaker,
  ClipboardCheck,
  Clock3,
  Info,
  Layers3,
  LineChart,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  TestTube2,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TestCardProps {
  test: PublicCatalogTest;
  variant?: "compact" | "detailed" | "animated";
  index?: number;
}

export const SOLD_COUNT_VISIBILITY_THRESHOLD = 100;

const TEMP_PHYSICIAN_REVIEWED_SLUGS = new Set<string>();

export function getVisibleSoldLabel(test: PublicCatalogTest) {
  const soldCount =
    typeof test.soldCount === "number"
      ? test.soldCount
      : typeof test.totalOrders === "number"
        ? test.totalOrders
        : undefined;

  if (
    typeof soldCount !== "number" ||
    soldCount < SOLD_COUNT_VISIBILITY_THRESHOLD
  ) {
    return null;
  }

  return `${Intl.NumberFormat("en-US", {
    notation: soldCount >= 1000 ? "compact" : "standard",
    maximumFractionDigits: soldCount >= 1000 ? 1 : 0,
  }).format(soldCount)} sold`;
}

export function isPhysicianReviewedTest(test: PublicCatalogTest) {
  return (
    test.isPhysicianReviewed === true ||
    TEMP_PHYSICIAN_REVIEWED_SLUGS.has(test.slug)
  );
}

export function TestCard({
  test,
  variant = "compact",
  index = 0,
}: TestCardProps) {
  const { toast } = useToast();
  const { ensureCanOrder } = useCartRestrictionGuard();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const categoryName = test.category?.name || "General Health";
  const summary = test.shortDescription || test.description;
  const turnaroundLabel = formatTurnaroundDaysLabel(getCatalogTurnaroundDays(test));
  const startingLab = getTestStartingLab(test);
  const priceLabel = formatStartingPriceLabel(test);
  const prepLabel = test.requiresFasting
    ? "Fasting required"
    : test.preparation
      ? "Prep instructions included"
      : "No fasting noted";
  const specimenLabel = test.specimenType || "See test details";
  const whyThisTest =
    summary ||
    `Review ${test.testName} details, preparation, specimen type, and lab options before ordering.`;
  const bestFor = test.isPanel
    ? "Baseline review, clinician follow-up, and health tracking"
    : `${categoryName} questions, symptom checks, or routine screening`;
  const componentLabel = test.isPanel
    ? test.componentCount
      ? `${test.componentCount} included tests`
      : "Panel test"
    : "Single lab test";
  const cartItem = buildCartItemFromPublicTest(test);
  const canAddToCart = canAddCatalogTestToCart(test) && !!cartItem;
  const isAlreadyInCart = items.some((item) => item.id === `test-${test.id}`);
  const soldLabel = getVisibleSoldLabel(test);
  const physicianReviewed = isPhysicianReviewedTest(test);

  const renderHeroImage = (mode: "compact" | "detailed") => {
    const imageHeight =
      mode === "compact" ? "h-32 sm:h-36" : "h-40 sm:h-44";
    const iconSize =
      mode === "compact" ? "h-14 w-14" : "h-16 w-16";
    const iconClass = mode === "compact" ? "h-6 w-6" : "h-7 w-7";

    if (test.testImage) {
      return (
        <div className={`relative w-full overflow-hidden bg-muted ${imageHeight}`}>
          <Image
            src={test.testImage}
            alt={test.testName}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            loading={index === 0 ? "eager" : "lazy"}
            priority={index === 0}
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
          />
          {test.isPopular ? (
            <Badge className='absolute left-3 top-3 rounded-full border-0 bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-amber-500/25'>
              Popular
            </Badge>
          ) : null}
          {soldLabel ? (
            <Badge className='absolute right-3 top-3 rounded-full border border-white/70 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm'>
              {soldLabel}
            </Badge>
          ) : null}
        </div>
      );
    }

    return (
      <div
        className={`relative flex items-center justify-center bg-[linear-gradient(135deg,#eff8ff_0%,#f8fafc_100%)] dark:bg-muted ${imageHeight}`}
      >
        {test.isPopular ? (
          <Badge className='absolute left-3 top-3 rounded-full border-0 bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-amber-500/25'>
            Popular
          </Badge>
        ) : null}
        {soldLabel ? (
          <Badge className='absolute right-3 top-3 rounded-full border border-white/70 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm'>
            {soldLabel}
          </Badge>
        ) : null}
        <div
          className={`flex items-center justify-center rounded-xl bg-card text-sky-700 shadow-sm dark:text-cyan-300 ${iconSize}`}
        >
          <Beaker className={iconClass} />
        </div>
      </div>
    );
  };

  const renderCompactBadges = () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Badge className='rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 shadow-none hover:bg-sky-50 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300'>
        {categoryName}
      </Badge>
      {test.isPanel ? (
        <Badge className='rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 shadow-none hover:bg-cyan-50 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300'>
          <Layers3 className='mr-1 h-3 w-3' />
          Panel
        </Badge>
      ) : test.requiresFasting ? (
        <Badge
          variant='outline'
          className='rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'
        >
          Fasting
        </Badge>
      ) : null}
      {physicianReviewed ? (
        <Badge
          variant='outline'
          className='rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
        >
          <Stethoscope className='mr-1 h-3 w-3' />
          Physician Reviewed
        </Badge>
      ) : null}
    </div>
  );

  const renderCompactPriceBlock = () => (
    <div className='rounded-lg border border-border bg-muted/45 px-3 py-3'>
      <p className='text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
        Starting price
      </p>
      <p className='mt-1 text-lg font-semibold text-foreground'>
        {priceLabel}
      </p>
      <p className='mt-1 line-clamp-1 text-xs font-medium text-muted-foreground'>
        {startingLab
          ? `Lowest listed lab: ${startingLab.code}`
          : componentLabel}
      </p>
    </div>
  );

  const renderCompactCtaRow = () => (
    <Button
      asChild
      className='h-10 w-full rounded-lg bg-sky-600 text-white hover:bg-sky-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400'
    >
      <Link href={`/tests/${test.slug}`} scroll>
        View Details
        <ArrowRight className='ml-2 h-4 w-4' />
      </Link>
    </Button>
  );

  const handleAddToCart = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const from = query ? `${pathname}?${query}` : pathname;
      router.push(`/login?from=${encodeURIComponent(from)}`);
      return;
    }

    if (!cartItem) {
      toast({
        title: "Unavailable for cart",
        description: "This product does not currently have a public storefront price.",
        variant: "destructive",
      });
      return;
    }

    if (isAlreadyInCart) {
      toast({
        title: "Already in cart",
        description: `${test.testName} is already in your cart.`,
      });
      return;
    }

    const canOrder = await ensureCanOrder({
      laboratoryCode: "ACCESS",
      testId: test.id,
    });

    if (!canOrder) {
      return;
    }

    addItem(cartItem);
    toast({
      title: "Added to cart",
      description: `${test.testName} has been added to your cart.`,
    });
  };

  if (variant === "compact") {
    return (
      <Card className='group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-sky-200 hover:shadow-[0_18px_45px_-34px_rgba(2,132,199,0.5)] dark:hover:border-cyan-800'>
        {renderHeroImage("compact")}

        <CardContent className='flex flex-1 flex-col gap-4 p-4'>
          {renderCompactBadges()}

          <div className='space-y-2'>
            <h3 className='line-clamp-2 text-base font-semibold leading-snug text-foreground'>
              {test.testName}
            </h3>
          </div>

          <div className='mt-auto space-y-4'>
            {renderCompactPriceBlock()}
            {renderCompactCtaRow()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`group h-full overflow-hidden border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-sky-200 hover:shadow-[0_24px_60px_-42px_rgba(2,132,199,0.45)] dark:hover:border-cyan-800 ${
        variant === "detailed" ? "rounded-xl" : "rounded-xl"
      }`}
    >
      {renderHeroImage("detailed")}

      <CardContent className='flex h-full flex-col p-5'>
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <Badge className='rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 shadow-none hover:bg-sky-50 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300'>
            {categoryName}
          </Badge>
          {test.isPanel ? (
            <Badge className='rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 shadow-none hover:bg-cyan-50 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300'>
              <Layers3 className='mr-1 h-3 w-3' />
              Panel
            </Badge>
          ) : null}
          <Badge
            variant='outline'
            className='rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
          >
            <ShieldCheck className='mr-1 h-3 w-3' />
            Active Test
          </Badge>
          {physicianReviewed ? (
            <Badge
              variant='outline'
              className='rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
            >
              <Stethoscope className='mr-1 h-3 w-3' />
              Physician Reviewed
            </Badge>
          ) : null}
          {test.requiresFasting && (
            <Badge
              variant='outline'
              className='rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'
            >
              Fasting
            </Badge>
          )}
        </div>

        <div className='space-y-2'>
          <h3 className='line-clamp-2 text-lg font-semibold leading-snug text-foreground'>
            {test.testName}
          </h3>
          <p className='line-clamp-3 text-sm leading-6 text-muted-foreground'>
            {summary}
          </p>
        </div>

        <div className='mt-5 rounded-xl border border-border bg-muted/45 p-4'>
          <div className='flex items-start justify-between gap-3 border-b border-border pb-3'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                Cash price
              </p>
              <p className='mt-1 text-lg font-semibold text-foreground'>
                {priceLabel}
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                Includes lab processing and online results when available.
              </p>
            </div>
            <div className='rounded-lg bg-background p-2 text-sky-700 shadow-sm dark:text-cyan-300'>
              <Wallet className='h-5 w-5' />
            </div>
          </div>

          <div className='mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600'>
            {startingLab ? (
              <Badge
                variant='outline'
                className='rounded-full border-border bg-background px-3 py-1 text-[11px] font-semibold text-foreground'
              >
                Lowest listed lab: {startingLab.code}
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'
              >
                Price unavailable
              </Badge>
            )}
            <Badge
              variant='outline'
              className='rounded-full border-border bg-background px-3 py-1 text-[11px] font-semibold text-foreground'
            >
              {componentLabel}
            </Badge>
          </div>
        </div>

        <div className='mt-4 grid gap-3 rounded-xl border border-border bg-muted/45 p-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-background text-sky-700 shadow-sm dark:text-cyan-300'>
              <Clock3 className='h-4 w-4' />
            </div>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                Turnaround
              </p>
              <p className='text-sm text-foreground'>{turnaroundLabel}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-background text-sky-700 shadow-sm dark:text-cyan-300'>
              <TestTube2 className='h-4 w-4' />
            </div>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                {test.isPanel ? "Panel type" : "Specimen"}
              </p>
              <p className='truncate text-sm text-foreground'>
                {test.isPanel ? componentLabel : specimenLabel}
              </p>
            </div>
          </div>
        </div>

        <div className='mt-4 grid gap-3 rounded-xl border border-border bg-card p-3'>
          <div className='flex items-start gap-2'>
            <Info className='mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-cyan-300' />
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                Why this test
              </p>
              <p className='mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground'>
                {whyThisTest}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 rounded-xl bg-muted/55 px-3 py-2'>
            <ClipboardCheck className='h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300' />
            <p className='text-sm font-medium text-foreground'>
              {prepLabel}
            </p>
          </div>
          <div className='flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/25'>
            <LineChart className='mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300' />
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-200'>
                Best for
              </p>
              <p className='mt-1 line-clamp-2 text-sm leading-5 text-emerald-900 dark:text-emerald-100'>
                {bestFor}
              </p>
            </div>
          </div>
          <div className='flex items-center justify-between gap-3 rounded-xl bg-blue-50 px-3 py-2 dark:bg-cyan-950/25'>
            <span className='text-sm font-semibold text-blue-900 dark:text-cyan-100'>
              Sample result preview available
            </span>
            <span className='text-xs font-semibold text-blue-700 dark:text-cyan-300'>
              {soldLabel || "Popular"}
            </span>
          </div>
        </div>

        <div className='mt-5 grid gap-2 sm:grid-cols-3'>
          <Button
            asChild
            variant='ghost'
            className='h-11 rounded-lg text-foreground hover:bg-muted'
          >
            <Link href={`/tests/${test.slug}#preparation`} scroll>
              Quick Prep
            </Link>
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={
              isLoading ||
              (isAuthenticated && (!canAddToCart || isAlreadyInCart))
            }
            variant='outline'
            className='h-11 rounded-lg border-border text-foreground hover:bg-muted disabled:bg-muted disabled:text-muted-foreground'
          >
            <ShoppingCart className='mr-2 h-4 w-4' />
            {!isAuthenticated
              ? "Add to Cart"
              : isAlreadyInCart
              ? "In Cart"
              : canAddToCart
                ? "Add to Cart"
                : "Unavailable"}
          </Button>
          <Button
            asChild
            className='h-11 w-full rounded-lg bg-sky-600 text-white hover:bg-sky-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400'
          >
            <Link href={`/tests/${test.slug}`} scroll>
              View Details
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
