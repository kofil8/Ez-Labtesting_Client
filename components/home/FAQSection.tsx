"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "Is EzLabTesting a laboratory?",
    answer:
      "No. EzLabTesting is an online ordering and result access platform. Sample collection and laboratory testing are performed by authorized partner laboratories.",
  },
  {
    question: "Which lab partner is currently active?",
    answer:
      "ACCESS is currently active for eligible orders. Additional partner networks such as CPL, Labcorp, and Quest are planned.",
  },
  {
    question: "Which states are restricted?",
    answer:
      "New York, New Jersey, Maryland, Massachusetts, and Rhode Island are restricted or may require additional physician involvement.",
  },
  {
    question: "Do I need a doctor's order?",
    answer:
      "Requirements vary by state and test. Some states or tests may require physician involvement or may not be available.",
  },
  {
    question: "How do I get my sample collected?",
    answer:
      "After order confirmation, you will receive instructions for an approved partner draw center or collection process when available.",
  },
  {
    question: "How fast will I get results?",
    answer:
      "Many results may be available within 24-72 hours after lab processing, depending on the test type and partner lab.",
  },
  {
    question: "Can I use insurance?",
    answer:
      "EzLabTesting is designed for transparent cash-pay pricing. Insurance billing is not required unless explicitly shown during checkout.",
  },
  {
    question: "Are result insights medical advice?",
    answer:
      "No. Result insights are educational and do not replace medical advice, diagnosis, or treatment.",
  },
];

export function FAQSection() {
  return (
    <section id='faq' className='bg-slate-50 py-14 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8 text-center'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
              FAQ
            </p>
            <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
              Common questions
            </h2>
          </div>

          <Accordion
            type='single'
            collapsible
            className='rounded-xl border border-slate-200 bg-white px-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className='border-slate-200 dark:border-slate-800'
              >
                <AccordionTrigger className='py-5 text-left text-base font-semibold text-slate-950 hover:no-underline dark:text-white'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-sm leading-7 text-slate-600 dark:text-slate-400'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className='mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row'>
            <p className='text-sm font-semibold text-slate-600 dark:text-slate-300'>
              Still have questions? Contact our support team before placing an
              order.
            </p>
            <Button
              asChild
              variant='outline'
              className='rounded-lg bg-white font-semibold dark:bg-slate-950'
            >
              <Link href='/help-center'>Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
