"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    image: "👩‍💼",
    rating: 5,
    text: "Getting my hormone panel done was so easy! Results in 48 hours and the dashboard is incredibly intuitive. Highly recommend!",
  },
  {
    name: "Michael Chen",
    role: "Tech Professional",
    image: "👨‍💻",
    rating: 5,
    text: "No more waiting weeks for doctor appointments. I ordered my metabolic panel online and had results the next day. Game changer!",
  },
  {
    name: "Emily Rodriguez",
    role: "Healthcare Worker",
    image: "👩‍⚕️",
    rating: 5,
    text: "As a nurse, I appreciate the CLIA certification and detailed results. The platform makes it easy to track my health markers over time.",
  },
  {
    name: "John Doe",
    role: "Customer",
    image: "👨‍💻",
    rating: 5,
    text: "I have been using this service for a few months now and I am very satisfied with the results. The tests are accurate and the results are delivered quickly.",
  },
  {
    name: "Sophia Lee",
    role: "Customer",
    image: "👩‍💼",
    rating: 4,
    text: "I have been using this service for a few months now and I am very satisfied with the results. The tests are accurate and the results are delivered quickly.",
  },
];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Get visible testimonials (show 3 at a time)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], displayIndex: i });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className='py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900'>
      {/* Subtle background patterns */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-20' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent dark:from-blue-900/10' />

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-12 sm:mb-14 md:mb-16'
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-semibold mb-4'>
            <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
            <span>4.9/5 Rating • 2,500+ Reviews</span>
          </div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
            Loved by{" "}
            <span className='bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent'>
              Thousands
            </span>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
            Don&#39;t just take our word for it — hear from our satisfied
            customers
          </p>
        </motion.div>

        <div className='relative overflow-hidden'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className='h-full relative group'>
                  {/* Card with improved styling */}
                  <div className='h-full bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-7 shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-slate-700/50 group-hover:border-blue-200 dark:group-hover:border-blue-800/50 group-hover:shadow-xl group-hover:shadow-blue-100/30 dark:group-hover:shadow-none transition-all duration-300'>
                    {/* Rating stars with count */}
                    <div className='flex items-center gap-2 mb-5'>
                      <div className='flex items-center gap-0.5'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                        {testimonial.rating}.0
                      </span>
                    </div>

                    {/* Quote with better typography */}
                    <div className='relative mb-6'>
                      <Quote className='absolute -top-2 -left-1 h-8 w-8 text-blue-100 dark:text-blue-900/50' />
                      <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed relative z-10 pl-4'>
                        &quot;{testimonial.text}&quot;
                      </p>
                    </div>

                    {/* Profile with clearer visual hierarchy */}
                    <div className='flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-slate-700/50'>
                      <div className='relative flex-shrink-0'>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center text-2xl'>
                          {testimonial.image}
                        </div>
                        <div className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900 dark:text-white'>
                          {testimonial.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel indicators - improved */}
        <div className='flex justify-center gap-2 mt-10'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-blue-500 to-cyan-500"
                  : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Social proof banner - enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className='mt-14 sm:mt-16 text-center'
        >
          <div className='inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white dark:bg-slate-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-slate-700/50'>
            <div className='flex -space-x-3'>
              {["👨‍💼", "👩‍💻", "👨‍⚕️", "👩‍🔬", "👨‍🔬"].map((emoji, i) => (
                <div
                  key={i}
                  className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center border-2 border-white dark:border-slate-800 text-lg shadow-sm'
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className='text-center sm:text-left'>
              <p className='text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                50,000+
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                Happy customers and counting
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
