"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Zap, ShieldCheck, Award, Clock } from "lucide-react";
import Image from "next/image";

export function TestsHero() {
  return (
    <>
      <div className='relative min-h-[450px] bg-slate-950 overflow-hidden flex items-center'>
        <div className='absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-blue-900/20 z-10' />
        <Image
          src='/images/Blood-Vial.webp'
          alt='Premium Lab Tests'
          fill
          className='object-cover opacity-60 z-0'
          priority
        />

        <div className='relative z-20 w-full'>
          <PageContainer>
            <div className='max-w-4xl'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-blue-200 text-sm font-bold mb-8 backdrop-blur-md'
              >
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
                </span>
                LIMITED TIME: Free Physician Review Included
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white'
              >
                Clinical-Grade <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>
                  Laboratory Testing
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-xl sm:text-2xl mb-10 text-slate-300 max-w-2xl leading-relaxed font-light'
              >
                Direct access to high-accuracy blood work and health panels. Fast, private, and trusted by leading providers.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='flex flex-col sm:flex-row gap-4'
              >
                <Button
                  size='lg'
                  className='bg-primary hover:bg-blue-500 text-white font-bold rounded-full h-14 px-10 text-lg shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-all'
                >
                  Browse Catalog
                </Button>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-2 border-white/20 text-white hover:bg-white/10 font-bold rounded-full h-14 px-10 text-lg backdrop-blur-md'
                >
                  <Phone className='h-5 w-5 mr-2' />
                  Speak to an Expert
                </Button>
              </motion.div>
            </div>
          </PageContainer>
        </div>
      </div>

      <div className='bg-primary/5 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 py-10'>
        <PageContainer>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
            <div className='flex items-center gap-4 group'>
              <div className='p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 text-primary group-hover:scale-110 transition-transform'>
                <Zap className='h-6 w-6' />
              </div>
              <div>
                <div className='font-bold text-slate-900 dark:text-white'>Fast Turnaround</div>
                <div className='text-sm text-slate-500'>Results in 24-48 hours</div>
              </div>
            </div>
            <div className='flex items-center gap-4 group'>
              <div className='p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 text-secondary group-hover:scale-110 transition-transform'>
                <ShieldCheck className='h-6 w-6' />
              </div>
              <div>
                <div className='font-bold text-slate-900 dark:text-white'>CLIA Certified</div>
                <div className='text-sm text-slate-500'>Gold-standard lab network</div>
              </div>
            </div>
            <div className='flex items-center gap-4 group'>
              <div className='p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 text-purple-500 group-hover:scale-110 transition-transform'>
                <Award className='h-6 w-6' />
              </div>
              <div>
                <div className='font-bold text-slate-900 dark:text-white'>Expert Review</div>
                <div className='text-sm text-slate-500'>Physician approved results</div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
}
