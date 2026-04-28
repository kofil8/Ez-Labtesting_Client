"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { useCartSync } from "@/hook/useCartSync";
import { useCartStore } from "@/lib/store/cart-store";
import {
  buildCartItemFromPublicTest,
  canAddCatalogTestToCart,
} from "@/lib/tests/cart-item";
import {
  formatStartingPriceLabel,
  getTestStartingLab,
} from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";
import {
  ArrowRight,
  ClipboardList,
  Layers3,
  LifeBuoy,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { WhatsIncluded } from "./purchase/WhatsIncluded";

interface TestPurchaseCardProps {
  test: PublicCatalogTest;
}

export function TestPurchaseCard({ test }: TestPurchaseCardProps) {
  const { toast } = useToast();
  const { manualSync } = useCartSync({ autoSync: false });
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const categoryName = test.category?.name;
  const ageLabel =
    typeof test.minAge === "number" || typeof test.maxAge === "number"
      ? `${test.minAge ?? 0}-${test.maxAge ?? "adult"} yrs`
      : "Most adults";
  const startingLab = getTestStartingLab(test);
  const primaryBrowseHref = test.isPanel ? "/panels" : "/tests";
  const primaryBrowseLabel = test.isPanel
    ? "Browse More Panels"
    : "Browse More Tests";
  const primaryHeading = test.isPanel
    ? "Review This Panel"
    : "Review This Test";
  const cartItem = buildCartItemFromPublicTest(test);
  const canAddToCart = canAddCatalogTestToCart(test) && !!cartItem;
  const isAlreadyInCart = items.some((item) => item.id === `test-${test.id}`);

  const handleAddToCart = async () => {
    if (!cartItem) {
      toast({
        title: "Unavailable for cart",
        description:
          "This product does not currently have a public storefront price.",
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

    // Sync with server after adding item
    await manualSync();

    toast({
      title: "Added to cart",
      description: `${test.testName} has been added to your cart.`,
    });
  };

  return (
    <Card className='lg:sticky lg:top-6 border border-border shadow-sm rounded-xl bg-card'>
      <div className='flex justify-center pt-5 px-5 sm:px-6'>
        <Badge className='bg-blue-600 hover:bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold rounded-full'>
          <TrendingUp className='h-3.5 w-3.5 mr-1.5' />
          Test Planning
        </Badge>
      </div>

      <CardHeader className='pb-3 pt-4 space-y-4 px-5 sm:px-6'>
        <div className='space-y-2 text-center'>
          <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
            {primaryHeading}
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
            {test.isPanel
              ? "Compare included component tests, pricing, and storefront lab availability before moving deeper into the ordering flow."
              : "Browse the clinical details, preparation guidance, and the current storefront lab availability before moving deeper into the ordering flow."}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              Category
            </p>
            <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>
              {categoryName || "General Health"}
            </p>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              Age guide
            </p>
            <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>
              {ageLabel}
            </p>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              Best price
            </p>
            <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>
              {formatStartingPriceLabel(test)}
            </p>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              Best lab
            </p>
            <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>
              {startingLab?.code || "Unavailable"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 px-5 sm:px-6 pb-6'>
        <div className='rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40'>
          <div className='flex items-start gap-3'>
            <div className='rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'>
              <ClipboardList className='h-5 w-5' />
            </div>
            <div>
              <h4 className='font-semibold text-slate-900 dark:text-white'>
                {test.isPanel
                  ? "What to expect from this panel"
                  : "What to expect"}
              </h4>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                {test.isPanel
                  ? "Use this page to review included tests, lab-specific price visibility, and turnaround guidance before choosing your next step."
                  : "Use this page to understand the specimen type, expected turnaround, and lab-specific pricing before choosing your next step."}
              </p>
            </div>
          </div>
        </div>

        {test.isPanel ? (
          <div className='rounded-2xl border border-cyan-200 bg-cyan-50 p-4'>
            <div className='flex items-start gap-3'>
              <div className='rounded-xl bg-white p-2 text-cyan-700 shadow-sm'>
                <Layers3 className='h-5 w-5' />
              </div>
              <div>
                <h4 className='font-semibold text-slate-900'>
                  Panel composition
                </h4>
                <p className='mt-1 text-sm text-slate-600'>
                  This panel currently includes {test.componentCount ?? 0}{" "}
                  active component{" "}
                  {test.componentCount === 1 ? "test" : "tests"} in the order
                  defined by the backend catalog.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <WhatsIncluded category={categoryName} />

        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart || isAlreadyInCart}
          className='h-11 w-full bg-blue-600 text-base font-semibold shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600'
          size='lg'
        >
          <ShoppingCart className='mr-2 h-4 w-4' />
          {isAlreadyInCart
            ? "Already in Cart"
            : canAddToCart
              ? "Add to Cart"
              : "Price Unavailable"}
        </Button>

        <Button
          asChild
          variant='outline'
          className='w-full h-11 text-base font-semibold'
          size='lg'
        >
          <Link href={primaryBrowseHref}>
            {primaryBrowseLabel}
            <ArrowRight className='h-4 w-4 ml-2' />
          </Link>
        </Button>

        <Button asChild variant='outline' className='w-full h-11 text-base'>
          <Link href='/help-center'>
            <LifeBuoy className='h-4 w-4 mr-2' />
            Get Help Choosing
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
