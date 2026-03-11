"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { motion } from "framer-motion";
import Image from "next/image";

export function PanelsHero() {
  return (
    <div className='relative min-h-[350px] bg-slate-950 overflow-hidden flex items-center'>
      <Image
        src='/images/Manual-testing.webp'
        alt='Featured Panels'
        fill
        className='object-cover opacity-60 z-0'
        priority
      />
      <div className='absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-blue-900/10 z-10' />

      <div className='relative z-20 w-full'>
        <PageContainer>
          <div className='max-w-4xl text-left'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-blue-300 text-xs font-bold mb-6 tracking-wider uppercase backdrop-blur-sm'
            >
              Curated Health Bundles
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white'
            >
              Comprehensive <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>
                Test Panels
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-xl text-slate-300 max-w-2xl leading-relaxed font-light'
            >
              Get a complete picture of your health with our carefully organized test bundles. Professional analysis with significant cost savings.
            </motion.p>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
