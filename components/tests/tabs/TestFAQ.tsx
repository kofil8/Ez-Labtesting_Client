"use client";

import { getTestDetailConfig } from "@/app/(shop)/tests/data/test-detail-config";
import { Button } from "@/components/ui/button";
import { Test } from "@/types/test";
import { AlertCircle, ChevronDown, ChevronUp, Phone } from "lucide-react";
import { useState } from "react";

interface TestFAQProps {
  test: Test;
}

export function TestFAQ({ test }: TestFAQProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const config = getTestDetailConfig(
    typeof test.category === "string" ? test.category : test.category?.name,
  );

  return (
    <div className='space-y-4 animate-in fade-in duration-300'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold'>Frequently Asked Questions</h3>
        <p className='text-sm text-muted-foreground'>
          Find answers to common questions about this test
        </p>
      </div>

      <div className='space-y-2'>
        {config.faqs.map((faq, index) => (
          <div
            key={index}
            className='border rounded-lg overflow-hidden hover:border-primary/50 transition-colors'
          >
            <button
              onClick={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
              className='w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-muted/30 transition-colors'
            >
              <span className='font-semibold pr-3 sm:pr-4 text-sm sm:text-base'>
                {faq.question}
              </span>
              {expandedFaq === index ? (
                <ChevronUp className='h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary' />
              ) : (
                <ChevronDown className='h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground' />
              )}
            </button>
            {expandedFaq === index && (
              <div className='px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in slide-in-from-top duration-200'>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted/50 border'>
        <div className='flex items-start gap-2 sm:gap-3'>
          <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5' />
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-xs sm:text-sm mb-1'>
              Still have questions?
            </div>
            <p className='text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3'>
              Our support team is available to answer any questions about this
              test.
            </p>
            <Button variant='outline' size='sm'>
              <Phone className='h-4 w-4 mr-2' />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
