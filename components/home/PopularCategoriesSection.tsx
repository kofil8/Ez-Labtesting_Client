"use client";

import { getCategories } from "@/app/actions/get-categories";
import { motion } from "framer-motion";
import {
  Activity,
  Apple,
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

  if (!loading && categories.length === 0) return null;

  return (
    <section className='py-16 sm:py-20 lg:py-24 bg-white'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto max-w-3xl text-center mb-12 lg:mb-16'
        >
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
            Test Categories
          </p>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4'>
            Popular Test Categories
          </h2>
          <p className='text-base sm:text-lg text-slate-600 leading-relaxed'>
            Find the right tests for your health goals.
          </p>
        </motion.div>

        {/* Category Grid */}
        {loading ? (
          <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className='h-28 rounded-2xl bg-slate-100 animate-pulse'
              />
            ))}
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
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
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border bg-white text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${colors.border} ${colors.hover}`}
                  >
                    <span
                      className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </span>
                    <div>
                      <h3 className='text-sm font-bold text-slate-800 leading-tight'>
                        {cat.name}
                      </h3>
                      <span className='text-xs text-slate-500 mt-0.5 block'>
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

        {/* View All link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className='mt-10 text-center'
        >
          <Link
            href='/tests'
            className='inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors'
          >
            View All{categories.length > 0 ? ` ${categories.length}` : ""}{" "}
            Categories →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
