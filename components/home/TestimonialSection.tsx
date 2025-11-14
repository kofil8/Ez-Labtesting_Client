'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { GlassmorphicCard } from '@/components/shared/GlassmorphicCard'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    image: '👩‍💼',
    rating: 5,
    text: 'Getting my hormone panel done was so easy! Results in 48 hours and the dashboard is incredibly intuitive. Highly recommend!'
  },
  {
    name: 'Michael Chen',
    role: 'Tech Professional',
    image: '👨‍💻',
    rating: 5,
    text: 'No more waiting weeks for doctor appointments. I ordered my metabolic panel online and had results the next day. Game changer!'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Healthcare Worker',
    image: '👩‍⚕️',
    rating: 5,
    text: 'As a nurse, I appreciate the CLIA certification and detailed results. The platform makes it easy to track my health markers over time.'
  }
]

export function TestimonialSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float animation-delay-2000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9/5 Rating</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by{' '}
            <span className="text-gradient-cosmic">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="h-full relative group">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                
                <GlassmorphicCard className="h-full p-8 relative border-2 border-transparent group-hover:border-primary/20 transition-all duration-300">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + i * 0.05 }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-4 -left-2 h-12 w-12 text-primary/10 -rotate-6" />
                    <p className="text-base text-muted-foreground pl-6 leading-relaxed relative z-10">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="relative">
                      <div className="text-5xl">{testimonial.image}</div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassmorphicCard>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full glass border-2 border-white/20 dark:border-gray-700/20">
            <div className="flex -space-x-2">
              {['👨‍💼', '👩‍💻', '👨‍⚕️', '👩‍🔬'].map((emoji, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-background text-lg">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">
              <span className="font-bold text-primary">50,000+</span> happy customers and counting
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

