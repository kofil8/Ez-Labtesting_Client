"use client";

import { getCategories } from "@/app/actions/get-categories";
import { motion } from "framer-motion";
import {
  Activity,
  Apple,
  ArrowRight,
  Baby,
  Beaker,
  Bone,
  Brain,
  Dna,
  Droplets,
  FileText,
  Flame,
  FlaskConical,
  Heart,
  Leaf,
  Microscope,
  Shield,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Thermometer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HomeCategory {
  id: string;
  name: string;
  createdAt: string;
  _count: { tests: number };
}

const COLOR_CLASSES = [
  {
    icon: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    hover: "hover:border-red-300 hover:bg-red-50/80",
  },
  {
    icon: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    hover: "hover:border-blue-300 hover:bg-blue-50/80",
  },
  {
    icon: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    hover: "hover:border-purple-300 hover:bg-purple-50/80",
  },
  {
    icon: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    hover: "hover:border-rose-300 hover:bg-rose-50/80",
  },
  {
    icon: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    hover: "hover:border-orange-300 hover:bg-orange-50/80",
  },
  {
    icon: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    hover: "hover:border-cyan-300 hover:bg-cyan-50/80",
  },
  {
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    hover: "hover:border-emerald-300 hover:bg-emerald-50/80",
  },
  {
    icon: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    hover: "hover:border-indigo-300 hover:bg-indigo-50/80",
  },
];

const concernGroups = [
  {
    group: "By symptom or concern",
    items: [
      { label: "Tired all the time", search: "fatigue thyroid vitamin" },
      { label: "Joint and muscle pain", search: "inflammation autoimmune" },
      { label: "Digestive issues", search: "digestive food sensitivity" },
      { label: "Brain fog", search: "thyroid vitamin metabolic" },
    ],
  },
  {
    group: "By life stage",
    items: [
      { label: "Pregnancy and fertility", search: "pregnancy fertility hormone" },
      { label: "Fitness and youth", search: "fitness hormone vitamin" },
      { label: "Preventive age 40+", search: "preventive lipid a1c" },
      { label: "Senior health", search: "kidney liver metabolic" },
    ],
  },
  {
    group: "By health goal",
    items: [
      { label: "Optimize performance", search: "performance hormone nutrition" },
      { label: "Weight management", search: "weight metabolic thyroid" },
      { label: "Heart health", search: "lipid cholesterol cardiac" },
      { label: "Routine screening", search: "cbc cmp lipid a1c" },
    ],
  },
];

function getCategoryIcon(nameOrSlug: string) {
  const n = nameOrSlug.toLowerCase();
  if (n.includes("std") || n.includes("sexual")) return ShieldCheck;
  if (n.includes("general") || n.includes("wellness")) return Heart;
  if (n.includes("hormone") || n.includes("endocrine")) return Zap;
  if (n.includes("thyroid")) return Activity;
  if (n.includes("cardiac") || n.includes("heart")) return Flame;
  if (n.includes("metabolic") || n.includes("diabetes")) return Beaker;
  if (n.includes("nutrition") || n.includes("vitamin")) return Apple;
  if (n.includes("liver") || n.includes("hepatic")) return Droplets;
  if (n.includes("renal") || n.includes("kidney")) return TestTube2;
  if (n.includes("allerg") || n.includes("immunology")) return Shield;
  if (n.includes("autoimmune") || n.includes("rheumatol")) return Brain;
  if (n.includes("cancer") || n.includes("oncolog")) return Microscope;
  if (n.includes("hematol") || n.includes("blood")) return FlaskConical;
  if (n.includes("prenatal") || n.includes("reproductive")) return Baby;
  if (n.includes("genetic") || n.includes("dna")) return Dna;
  if (n.includes("digestive") || n.includes("gastroint")) return Leaf;
  if (n.includes("bone") || n.includes("orthop")) return Bone;
  if (n.includes("mental") || n.includes("neuro")) return Brain;
  if (n.includes("women")) return Heart;
  if (n.includes("men")) return Stethoscope;
  if (n.includes("toxicol") || n.includes("drug")) return Thermometer;
  return FileText;
}

export function PopularCategoriesSection() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data as HomeCategory[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id='popular-categories'
      className='scroll-mt-24 bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto mb-12 max-w-3xl text-center lg:mb-16'
        >
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300'>
            Easier Browsing
          </p>
          <h2 className='mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl'>
            Browse by concern first
          </h2>
          <p className='text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg'>
            Medical categories are useful when you know the terminology. These plain-language paths help you start from what you are trying to understand.
          </p>
        </motion.div>

        <div className='mb-10 grid gap-4 lg:grid-cols-3'>
          {concernGroups.map((group) => (
            <div
              key={group.group}
              className='rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70'
            >
              <h3 className='mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200'>
                {group.group}
              </h3>
              <div className='grid gap-2'>
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={`/tests?search=${encodeURIComponent(item.search)}`}
                    className='group flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/20 dark:hover:text-cyan-300'
                  >
                    {item.label}
                    <ArrowRight className='h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300' />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(loading || categories.length > 0) && (
          <>
            <div className='mb-6'>
              <p className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Medical categories
              </p>
              <h3 className='mt-1 text-xl font-bold text-slate-900 dark:text-white'>
                For shoppers who already know the test area
              </h3>
            </div>

            {loading ? (
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900'
                  />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {categories.map((cat, i) => {
                  const colors = COLOR_CLASSES[i % COLOR_CLASSES.length];
                  const Icon = getCategoryIcon(cat.name);
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.35, delay: (i % 5) * 0.06 }}
                    >
                      <Link
                        href={`/tests?category=${cat.id}`}
                        className={`flex flex-col items-center gap-3 rounded-xl border bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${colors.border} ${colors.hover}`}
                      >
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
                        >
                          <Icon className={`h-6 w-6 ${colors.icon}`} />
                        </span>
                        <div>
                          <h3 className='text-sm font-bold leading-tight text-slate-800 dark:text-white'>
                            {cat.name}
                          </h3>
                          <span className='mt-0.5 block text-xs text-slate-500 dark:text-slate-400'>
                            {cat._count?.tests ?? 0} test
                            {(cat._count?.tests ?? 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className='mt-10 text-center'
        >
          <Link
            href='/tests'
            className='inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-cyan-300'
          >
            View all{categories.length > 0 ? ` ${categories.length}` : ""} categories
            <ArrowRight className='h-4 w-4' />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
