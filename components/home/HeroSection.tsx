"use client";

import { QuickHealthQuizDialog } from "@/components/home/QuickHealthQuizDialog";
import { ZipSearchForm } from "@/components/shared/ZipSearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEzLabEvent } from "@/lib/analytics";
import { homepageHeroCopy } from "@/lib/copyContent";
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  MapPinned,
  Search,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const journeySteps = [
  {
    label: "Search",
    text: "Find tests by health goal, marker, condition, or partner network.",
    icon: Search,
  },
  {
    label: "Check",
    text: "Confirm state and ZIP availability before checkout.",
    icon: MapPinned,
  },
  {
    label: "Review",
    text: "Compare price, specimen notes, timing, and result access.",
    icon: Stethoscope,
  },
];

const labPartners = [
  { name: "ACCESS", status: "Active" },
  { name: "Labcorp", status: "Network" },
  { name: "CPL", status: "Network" },
  { name: "Quest", status: "Network" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-sky-100 bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_50%,#f0f9ff_100%)] pb-12 pt-8 dark:border-slate-800 dark:bg-slate-950 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-emerald-100/30 blur-3xl dark:from-sky-950/20 dark:to-emerald-950/20"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Left Column: Human Hook, Value Prop, Search & Trust */}
          <div className="min-w-0 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-3.5 py-1.5 shadow-sm dark:border-sky-800 dark:bg-slate-900">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                {homepageHeroCopy.eyebrow}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 font-heading dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] [text-wrap:balance]">
                Doctor-Approved Lab Tests.{" "}
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-teal-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-300">
                  On Your Own Terms.
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
                {homepageHeroCopy.description}
              </p>
            </div>

            {/* Reassurance Checklist Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4">
              {[
                { title: "No Doctor Visit", sub: "Physician order included" },
                { title: "No Insurance Needed", sub: "Upfront cash pricing" },
                { title: "4,000+ Draw Labs", sub: "Quest, Labcorp & ACCESS" },
                { title: "Fast 24-72h Results", sub: "Confidential & secure" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-sky-100 bg-white/90 p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{item.title}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* ZIP & Search Action Box */}
            <div
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-sky-950/5 dark:border-slate-800 dark:bg-slate-900"
              onClickCapture={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("button")) {
                  trackEzLabEvent("hero_zip_cta_click", {
                    placement: "hero",
                  });
                }
              }}
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Check lab availability near you:
              </p>
              <ZipSearchForm
                buttonLabel="Find Local Labs"
                buttonClassName="bg-blue-600 hover:bg-blue-700 font-semibold"
                helperText={homepageHeroCopy.helperText}
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuickHealthQuizDialog />
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-slate-300 bg-white px-6 font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <Link href="/tests">
                  {homepageHeroCopy.secondaryCta}
                  <ArrowRight className="ml-2 h-4 w-4 text-blue-600" />
                </Link>
              </Button>
            </div>

            {/* Social Proof Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1 text-amber-500">
                {"★".repeat(5)}
                <span className="ml-1 font-bold text-slate-900 dark:text-white">
                  4.9/5
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Over 50,000+ Tests Completed Across the USA
              </span>
            </div>
          </div>

          {/* Right Column: Visual Human Empathetic Image with Positioned Floating Card & Clean Spacing */}
          <div className="relative min-w-0 pb-6 lg:pb-0">
            {/* Ambient Background Decorative Glow */}
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-sky-400/20 via-blue-500/10 to-teal-400/20 blur-2xl dark:from-sky-500/10 dark:to-teal-500/10"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Empathy Image Container */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-100 shadow-xl shadow-sky-950/10 dark:border-slate-800 dark:bg-slate-900">
                <div className="relative aspect-[4/3.4] w-full overflow-hidden sm:aspect-[4/3.2]">
                  <Image
                    src="/images/consultation.webp"
                    alt="Friendly doctor consulting with a relaxed patient about lab results"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle top & bottom shading for badge readability */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/40" />
                </div>

                {/* Top Left: Empathetic & Trusted Care Eyebrow */}
                <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
                  <div className="rounded-xl border border-white/40 bg-slate-950/60 px-3 py-1.5 backdrop-blur-md">
                    <p className="text-[11px] font-semibold text-sky-200">
                      Empathetic & Trusted Care
                    </p>
                    <p className="text-xs font-bold text-white">
                      Clear answers & peace of mind
                    </p>
                  </div>
                </div>

                {/* Top Right Floating Badge: Verified CLIA Lab */}
                <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified CLIA Lab</span>
                  </div>
                </div>
              </div>

              {/* Floating Requisition & Lab Results Card - Perfectly Centered at Bottom with Ultra-Clear Glassmorphic Design */}
              <div className="relative -mt-16 mx-auto w-[92%] sm:w-[88%] rounded-2xl border border-white/60 bg-white/75 p-3.5 shadow-[0_12px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/75 sm:-mt-20 sm:p-4">
                {/* Floating Card Header */}
                <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100/70 text-sky-700 backdrop-blur-sm dark:bg-sky-950/80 dark:text-sky-300">
                      <FlaskConical className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Patient Requisition & Results
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Doctor-reviewed digital report
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 backdrop-blur-sm dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20">
                    Ready in 24-48h
                  </span>
                </div>

                {/* Compact Sample Markers List with Glassy Pills */}
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-white/60 px-2.5 py-2 shadow-xs backdrop-blur-md dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                          Vitamin D, 25-OH
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400">
                          Normal Range
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      48.2 (Normal)
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/60 px-2.5 py-2 shadow-xs backdrop-blur-md dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                          Lipid Panel
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400">
                          Cardiovascular
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-500/20 dark:text-sky-300">
                      Optimal
                    </span>
                  </div>
                </div>

                {/* Bottom Trust Line & Link */}
                <div className="mt-2.5 flex items-center justify-between pt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> No
                    doctor referral required
                  </span>
                  <Link
                    href="/tests"
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                  >
                    Browse 300+ Tests →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
