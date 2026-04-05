"use client";

import { motion } from "framer-motion";
import { Clock, Heart, Lock, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Remote Worker, California",
    text: "I can order tests from my home and visit any of thousands of draw centers near my office. No time wasted, no hassle. EzLabTesting fits perfectly into my busy schedule and I trust my data is secure.",
    rating: 5,
    icon: MapPin,
    highlight: "Mobility",
  },
  {
    name: "Jessica Thompson",
    role: "Healthcare Advocate, Texas",
    text: "As someone who values my privacy, I was impressed by their HIPAA-compliant process. My results are encrypted, and I have complete control over who sees my health information. Finally, a lab service I can trust.",
    rating: 5,
    icon: Lock,
    highlight: "Security & Trust",
  },
  {
    name: "David Park",
    role: "Small Business Owner, New York",
    text: "With 4,000+ partner locations, I can get tested anywhere. Whether I'm traveling or working, accessing quality lab services has never been easier. The mobile-friendly results portal is amazing.",
    rating: 5,
    icon: Heart,
    highlight: "Accessibility",
  },
];

const metrics = [
  { label: "Happy Patients", value: "50K+", icon: Heart },
  { label: "Tests Completed", value: "500K+", icon: Clock },
  { label: "Partner Labs", value: "4,000+", icon: MapPin },
];

export function TestimonialSection() {
  return (
    <section className='py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50/50 to-slate-50'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mb-16 text-center'
        >
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
            Real Patient Stories
          </p>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4'>
            Trusted by Thousands.
            <br className='hidden sm:block' />
            Accessible Everywhere.
          </h2>
          <p className='mx-auto max-w-3xl text-base sm:text-lg text-slate-600'>
            Hear from patients who benefit from our commitment to trust,
            security, and accessibility across all 4,000+ partner locations.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className='mb-16 grid gap-6 lg:grid-cols-3'>
          {testimonials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className='group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden'
              >
                {/* Gradient Accent */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></div>

                {/* Highlight Badge */}
                <div className='mb-4 inline-flex items-center gap-2 w-fit'>
                  <div className='h-2 w-2 rounded-full bg-blue-600'></div>
                  <p className='text-xs font-semibold text-blue-600 uppercase tracking-wider'>
                    {item.highlight}
                  </p>
                </div>

                {/* Rating */}
                <div className='mb-4 flex gap-1'>
                  {[...Array(item.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className='h-4 w-4 fill-amber-400 text-amber-400'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className='mb-6 text-slate-700 leading-relaxed flex-1 text-sm sm:text-base'>
                  "{item.text}"
                </p>

                {/* Divider */}
                <div className='mb-5 border-t border-slate-100'></div>

                {/* Author with Icon */}
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0'>
                    <Icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-bold text-slate-900 truncate'>
                      {item.name}
                    </p>
                    <p className='text-xs text-slate-500 truncate'>
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm'
        >
          <h3 className='mb-10 text-center text-2xl sm:text-3xl font-bold text-slate-900'>
            Powering Healthcare Access Nationwide
          </h3>
          <div className='grid gap-8 sm:grid-cols-3'>
            {metrics.map((metric, index) => {
              const MetricIcon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className='text-center group'
                >
                  <div className='mb-4 flex justify-center'>
                    <div className='p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors duration-300'>
                      <MetricIcon className='h-6 w-6 text-blue-600' />
                    </div>
                  </div>
                  <div className='mb-2 text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                    {metric.value}
                  </div>
                  <p className='text-sm sm:text-base font-medium text-slate-600'>
                    {metric.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mt-10 mx-auto max-w-2xl'
        >
          <div className='rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 sm:px-8 py-5 text-center'>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'>
              <Lock className='h-5 w-5 flex-shrink-0 text-emerald-600' />
              <span className='text-xs sm:text-sm font-semibold text-emerald-900 text-center'>
                HIPAA-compliant • Clinical-grade Security • 256-bit Encryption
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
