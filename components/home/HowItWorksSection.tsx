"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CalendarIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: SearchIcon,
    title: "Choose Your Test",
    description:
      "Browse our comprehensive catalog of lab tests and health panels tailored to your needs.",
  },
  {
    icon: CalendarIcon,
    title: "Book Appointment",
    description:
      "Select a convenient lab center near you and schedule your visit at a time that works for you.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Get Tested",
    description:
      "Visit the lab center for a quick sample collection by our professional healthcare staff.",
  },
  {
    icon: FileTextIcon,
    title: "Receive Results",
    description:
      "Access your detailed test results securely online within 24-48 hours.",
  },
];

export function HowItWorksSection() {
  return (
    <section className='py-16 md:py-24 bg-gradient-to-b from-white to-gray-50'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
            How It Works
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Get your lab tests done in four simple steps. Fast, convenient, and
            reliable healthcare at your fingertips.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          {steps.map((step, index) => (
            <Card
              key={index}
              className='relative border-2 hover:shadow-lg transition-shadow duration-300'
            >
              <CardContent className='pt-12 pb-6 px-6'>
                <div className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
                  <div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg'>
                    <step.icon className='w-6 h-6 text-primary-foreground' />
                  </div>
                </div>
                <div className='absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <span className='text-sm font-bold text-primary'>
                    {index + 1}
                  </span>
                </div>
                <h3 className='text-xl font-semibold mb-3 text-center'>
                  {step.title}
                </h3>
                <p className='text-muted-foreground text-center text-sm'>
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='text-center'>
          <Link href='/how-it-works'>
            <Button size='lg' className='group'>
              Learn More
              <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
