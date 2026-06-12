"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, ClipboardList, HelpCircle, Stethoscope } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "How to prepare",
    description: "Fasting, hydration, what to bring, and lab visit basics.",
    href: "/test-preparation",
    icon: ClipboardList,
  },
  {
    title: "Common questions",
    description: "Ordering, refunds, privacy, results timing, and account help.",
    href: "/faqs",
    icon: HelpCircle,
  },
  {
    title: "When to call your doctor",
    description: "Use your results as a starting point for a clinician conversation.",
    href: "/help-center",
    icon: Stethoscope,
  },
];

const microLessons = [
  {
    question: "What does this test show?",
    answer:
      "Each test detail page explains the marker, specimen type, and why someone may discuss it with a clinician.",
  },
  {
    question: "Do I need to prepare?",
    answer:
      "Cards now surface fasting or preparation notes before checkout. Detailed prep is also available on the test page.",
  },
  {
    question: "What if my result is abnormal?",
    answer:
      "Use the report as a starting point for a doctor or qualified clinician. Ez LabTesting does not diagnose or treat conditions.",
  },
];

export function EducationalHubSection() {
  return (
    <section className='bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-8 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]'>
          <div>
            <div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-slate-950 dark:text-cyan-300'>
              <BookOpenCheck className='h-5 w-5' />
            </div>
            <p className='text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300'>
              Health Knowledge
            </p>
            <h2 className='mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
              Build confidence before you order.
            </h2>
            <p className='mt-3 text-base leading-7 text-slate-600 dark:text-slate-300'>
              Plain-language resources help you understand preparation, privacy, and what to do after results are ready.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-3'>
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className='group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/20'
                >
                  <Icon className='mb-4 h-5 w-5 text-blue-600 dark:text-cyan-300' />
                  <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                    {resource.title}
                  </h3>
                  <p className='mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    {resource.description}
                  </p>
                  <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-cyan-300'>
                    Open
                    <ArrowRight className='h-4 w-4' />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className='lg:col-span-2'>
            <div className='grid gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1fr_auto] lg:items-start'>
              <Accordion type='single' collapsible className='w-full'>
                {microLessons.map((lesson) => (
                  <AccordionItem key={lesson.question} value={lesson.question}>
                    <AccordionTrigger className='text-left text-sm font-semibold text-slate-900 hover:no-underline dark:text-white'>
                      {lesson.question}
                    </AccordionTrigger>
                    <AccordionContent className='text-sm leading-6 text-slate-600 dark:text-slate-400'>
                      {lesson.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button asChild variant='outline' className='w-full rounded-lg bg-white dark:bg-slate-950 sm:w-auto'>
                <Link href='/help-center'>
                  Visit support center
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
