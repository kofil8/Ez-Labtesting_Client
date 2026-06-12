"use client";

import { Badge } from "@/components/ui/badge";
import { getSortedPanelComponents } from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";
import { ArrowRight, Clock3, Layers3, TestTube2 } from "lucide-react";
import Link from "next/link";

export function TestComponentsList({ test }: { test: PublicCatalogTest }) {
  const components = getSortedPanelComponents(test);

  if (!test.isPanel) {
    return null;
  }

  if (components.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600'>
        Panel component details are not available for this panel yet.
      </div>
    );
  }

  return (
    <div className='space-y-4 animate-in fade-in duration-300'>
      <div className='rounded-xl border border-cyan-200 bg-cyan-50 p-4 sm:p-5'>
        <div className='flex items-start gap-3'>
          <div className='rounded-2xl bg-white p-2 text-cyan-700 shadow-sm'>
            <Layers3 className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-base font-semibold text-slate-900'>
              Included in this panel
            </h3>
            <p className='mt-1 text-sm leading-6 text-slate-600'>
              This panel currently includes {components.length} active component
              {components.length === 1 ? "" : "s"} in the same order used by the
              backend catalog.
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        {components.map((component) => (
          <Link key={component.id} href={`/tests/${component.slug}`}>
            <div className='group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                  <div className='mb-2 flex flex-wrap items-center gap-2'>
                    <Badge className='rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 shadow-none'>
                      Component #{component.sortOrder + 1}
                    </Badge>
                    {component.category?.name ? (
                      <Badge
                        variant='outline'
                        className='rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700'
                      >
                        {component.category.name}
                      </Badge>
                    ) : null}
                  </div>

                  <h4 className='text-base font-semibold text-slate-900 group-hover:text-cyan-700'>
                    {component.name}
                  </h4>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    {component.shortDescription || "Open the test detail page for more information."}
                  </p>

                  <div className='mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500'>
                    {component.specimenType ? (
                      <span className='inline-flex items-center gap-1.5'>
                        <TestTube2 className='h-3.5 w-3.5 text-cyan-700' />
                        {component.specimenType}
                      </span>
                    ) : null}
                    {component.baseTurnaroundDays ? (
                      <span className='inline-flex items-center gap-1.5'>
                        <Clock3 className='h-3.5 w-3.5 text-cyan-700' />
                        {component.baseTurnaroundDays}{" "}
                        {component.baseTurnaroundDays === 1 ? "day" : "days"}
                      </span>
                    ) : null}
                  </div>
                </div>

                <ArrowRight className='mt-1 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-cyan-700' />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
