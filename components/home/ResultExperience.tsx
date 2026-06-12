import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Flag,
  History,
  LockKeyhole,
  Share2,
} from "lucide-react";

const features = [
  { icon: LockKeyhole, title: "Secure result portal" },
  { icon: Flag, title: "Normal / high / low marker flags" },
  { icon: FileText, title: "Plain-language explanations" },
  { icon: Download, title: "Downloadable PDF" },
  { icon: Share2, title: "Share with your provider" },
  { icon: History, title: "Order history" },
];

const markers = [
  { name: "Vitamin D", value: "31 ng/mL", status: "Normal", tone: "green", width: "58%" },
  { name: "A1C", value: "5.4%", status: "Normal", tone: "green", width: "48%" },
  { name: "LDL", value: "116 mg/dL", status: "High", tone: "amber", width: "74%" },
  { name: "TSH", value: "2.1 mIU/L", status: "Normal", tone: "green", width: "52%" },
];

export function ResultExperience() {
  return (
    <section id='result-disclaimer' className='border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center'>
          <div>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
            Result experience
          </p>
          <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
              Results that are easier to read
          </h2>
          <p className='mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300'>
              Your results return to your EzLabTesting account when available.
              Marker flags and educational context can make the report easier
              to discuss with a qualified provider.
          </p>

            <div className='mt-7 grid gap-3 sm:grid-cols-2'>
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className='group flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'>
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'>
                      <Icon className='h-4 w-4' />
                    </span>
                    {feature.title}
                  </div>
                );
              })}
            </div>

          </div>

          <div className='relative'>
            <div className='relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6'>
              <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                    Example dashboard
                  </p>
                  <h3 className='mt-1 text-2xl font-bold text-slate-950 dark:text-white'>Wellness panel results</h3>
                  <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>No real patient data shown.</p>
                </div>
                <Badge className='w-fit rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'>
                  Results available
                </Badge>
              </div>

              <div className='grid gap-4'>
                {markers.map((marker) => (
                  <div key={marker.name} className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
                    <div className='mb-3 flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-base font-bold text-slate-950 dark:text-white'>{marker.name}</p>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>{marker.value}</p>
                      </div>
                      <span
                        className={
                          marker.tone === "green"
                            ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        }
                      >
                        {marker.status}
                      </span>
                    </div>
                    <div className='h-2.5 rounded-full bg-white dark:bg-slate-900'>
                      <div
                        className={marker.tone === "green" ? "h-2.5 rounded-full bg-emerald-500" : "h-2.5 rounded-full bg-amber-500"}
                        style={{ width: marker.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-5 grid gap-3 sm:grid-cols-3'>
                {["Download PDF", "Share", "Order history"].map((action) => (
                  <div key={action} className='rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                    {action}
                  </div>
                ))}
              </div>

              <p className='mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-200'>
                Educational insights are not medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
