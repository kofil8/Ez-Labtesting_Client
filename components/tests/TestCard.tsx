"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
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
  Clock3,
  Layers3,
  ShieldCheck,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TestCardProps {
  test: PublicCatalogTest;
  variant?: "compact" | "detailed" | "animated";
  index?: number;
}

export function TestCard({
  test,
  variant = "compact",
  index = 0,
}: TestCardProps) {
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const categoryName = test.category?.name || "General Health";
  const summary = test.shortDescription || test.description;
  const turnaroundLabel = formatTurnaroundDaysLabel(getCatalogTurnaroundDays(test));
  const startingLab = getTestStartingLab(test);
  const priceLabel = formatStartingPriceLabel(test);
  const componentLabel = test.isPanel
    ? test.componentCount
      ? `${test.componentCount} included tests`
      : "Panel test"
    : "Single lab test";
  const cartItem = buildCartItemFromPublicTest(test);
  const canAddToCart = canAddCatalogTestToCart(test) && !!cartItem;
  const isAlreadyInCart = items.some((item) => item.id === `test-${test.id}`);

  const handleAddToCart = () => {
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

    addItem(cartItem);
    toast({
      title: "Added to cart",
      description: `${test.testName} has been added to your cart.`,
    });
  };

  return (
    <Card
      className={`group h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-colors hover:border-sky-200 hover:shadow-[0_24px_60px_-42px_rgba(2,132,199,0.45)] ${
        variant === "detailed" ? "rounded-[2rem]" : "rounded-[1.75rem]"
      }`}
    >
      {test.testImage ? (
        <div className='relative h-44 w-full overflow-hidden bg-slate-100'>
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
        </div>
      ) : (
        <div className='relative flex h-44 items-center justify-center bg-[linear-gradient(135deg,#eff8ff_0%,#f8fafc_100%)]'>
          {test.isPopular ? (
            <Badge className='absolute left-3 top-3 rounded-full border-0 bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-amber-500/25'>
              Popular
            </Badge>
          ) : null}
          <div className='flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-sm'>
            <Beaker className='h-7 w-7' />
          </div>
        </div>
      )}

      <CardContent className='flex h-full flex-col p-5'>
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <Badge className='rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 shadow-none hover:bg-sky-50'>
            {categoryName}
          </Badge>
          {test.isPanel ? (
            <Badge className='rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 shadow-none hover:bg-cyan-50'>
              <Layers3 className='mr-1 h-3 w-3' />
              Panel
            </Badge>
          ) : null}
          <Badge
            variant='outline'
            className='rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700'
          >
            <ShieldCheck className='mr-1 h-3 w-3' />
            Active Test
          </Badge>
          {test.requiresFasting && (
            <Badge
              variant='outline'
              className='rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700'
            >
              Fasting
            </Badge>
          )}
        </div>

        <div className='space-y-2'>
          <h3 className='line-clamp-2 text-lg font-semibold leading-snug text-slate-900'>
            {test.testName}
          </h3>
          <p className='line-clamp-3 text-sm leading-6 text-slate-600'>
            {summary}
          </p>
        </div>

        <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <div className='flex items-start justify-between gap-3 border-b border-slate-200 pb-3'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
                Best Price
              </p>
              <p className='mt-1 text-lg font-semibold text-slate-900'>
                {priceLabel}
              </p>
            </div>
            <div className='rounded-2xl bg-white p-2 text-sky-700 shadow-sm'>
              <Wallet className='h-5 w-5' />
            </div>
          </div>

          <div className='mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600'>
            {startingLab ? (
              <Badge
                variant='outline'
                className='rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700'
              >
                Best lab: {startingLab.code}
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700'
              >
                Price unavailable
              </Badge>
            )}
            <Badge
              variant='outline'
              className='rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700'
            >
              {componentLabel}
            </Badge>
          </div>
        </div>

        <div className='mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm'>
              <Clock3 className='h-4 w-4' />
            </div>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
                Turnaround
              </p>
              <p className='text-sm text-slate-800'>{turnaroundLabel}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm'>
              <Beaker className='h-4 w-4' />
            </div>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
                {test.isPanel ? "Panel type" : "Specimen"}
              </p>
              <p className='truncate text-sm text-slate-800'>
                {test.isPanel ? componentLabel : test.specimenType}
              </p>
            </div>
          </div>
        </div>

        <div className='mt-5 grid gap-2 sm:grid-cols-2'>
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAlreadyInCart}
            variant='outline'
            className='h-11 rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400'
          >
            <ShoppingCart className='mr-2 h-4 w-4' />
            {isAlreadyInCart
              ? "In Cart"
              : canAddToCart
                ? "Add to Cart"
                : "Unavailable"}
          </Button>
          <Button
            asChild
            className='h-11 w-full rounded-full bg-sky-600 text-white hover:bg-sky-700'
          >
            <Link href={`/tests/${test.slug}`}>
              View Details
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
