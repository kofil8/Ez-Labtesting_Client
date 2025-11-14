"use client";

import { GlassmorphicCard } from "@/components/shared/GlassmorphicCard";
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
    <section className='py-12 sm:py-16 md:py-24 relative overflow-hidden bg-kalles-card'>
      {/* Kalles-style subtle background pattern */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-40' />
      <div className='absolute inset-0 bg-kalles-dots opacity-30' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-16'
        >
          <div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4'>
            <Star className='h-3 w-3 sm:h-4 sm:w-4 fill-current' />
            <span>4.9/5 Rating</span>
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0'>
            Loved by <span className='text-gradient-cosmic'>Thousands</span>
          </h2>
          <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0'>
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className='relative overflow-hidden'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8'>
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className='h-full relative group'>
                  {/* Gradient border effect */}
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300' />

                  <GlassmorphicCard className='h-full p-8 relative border-2 border-transparent group-hover:border-primary/20 transition-all duration-300'>
                    {/* Rating stars */}
                    <div className='flex items-center gap-1 mb-6'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + i * 0.05 }}
                        >
                          <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className='relative mb-6'>
                      <Quote className='absolute -top-4 -left-2 h-12 w-12 text-primary/10 -rotate-6' />
                      <p className='text-sm text-muted-foreground pl-6 leading-relaxed relative z-10'>
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Profile */}
                    <div className='flex items-center gap-4 pt-6 border-t border-border/50'>
                      <div className='relative'>
                        <div className='text-5xl'>{testimonial.image}</div>
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background' />
                      </div>
                      <div>
                        <p className='font-bold text-base'>
                          {testimonial.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel indicators */}
        <div className='flex justify-center gap-2 mt-8'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Social proof banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className='mt-16 text-center'
        >
          <div className='inline-flex items-center gap-6 px-8 py-4 rounded-full glass border-2 border-white/20 dark:border-gray-700/20'>
            <div className='flex -space-x-2'>
              {["👨‍💼", "👩‍💻", "👨‍⚕️", "👩‍🔬"].map((emoji, i) => (
                <div
                  key={i}
                  className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-background text-lg'
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className='text-sm font-medium'>
              <span className='font-bold text-primary'>50,000+</span> happy
              customers and counting
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
