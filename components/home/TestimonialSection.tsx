"use client";

import { Button } from "@/components/ui/button";
import { trackEzLabEvent } from "@/lib/analytics";
import { homepageTestimonials } from "@/lib/copyContent";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";

export function TestimonialSection() {
  return (
    <section className='border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
              Patient proof
            </p>
            <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
              Real stories from people getting clarity before the next visit.
            </h2>
            <p className='mt-4 text-base leading-7 text-slate-600 dark:text-slate-300'>
              Short reviews focus on the moments that reduce anxiety: privacy,
              local availability, transparent pricing, and useful results.
            </p>
          </div>
          <Button
            asChild
            variant='outline'
            className='w-full rounded-lg bg-white font-semibold dark:bg-slate-950 sm:w-auto'
          >
            <Link href='/tests'>
              Browse reviewed tests
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {homepageTestimonials.map((testimonial, index) => (
            <motion.article
              key={`${testimonial.name}-${testimonial.testName}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className='flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'
              data-experiment='testimonials-v1'
            >
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <p className='font-semibold text-slate-950 dark:text-white'>
                    {testimonial.name}
                  </p>
                  <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                    {testimonial.location}
                  </p>
                </div>
                <div
                  className='flex gap-0.5 text-amber-400'
                  aria-label={`${testimonial.rating} star rating`}
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-4 w-4 ${
                        starIndex < testimonial.rating
                          ? "fill-current"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Quote className='mb-3 h-5 w-5 text-sky-700 dark:text-sky-300' />
              <p className='flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300'>
                &quot;{testimonial.quote}&quot;
              </p>

              <Link
                href={testimonial.href}
                className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300'
                onClick={() => {
                  trackEzLabEvent("testimonial_click", {
                    testName: testimonial.testName,
                    index,
                  });
                }}
              >
                {testimonial.testName}
                <ArrowRight className='h-4 w-4' />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
