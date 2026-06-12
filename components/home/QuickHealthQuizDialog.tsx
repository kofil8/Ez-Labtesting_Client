"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Droplet,
  HeartPulse,
  Layers3,
  Microscope,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type QuizAnswer = {
  id: string;
  label: string;
  description: string;
  icon: typeof Sparkles;
  searchBoost?: string;
};

type QuizStep = {
  id: "concern" | "intent" | "preference" | "confidence";
  eyebrow: string;
  title: string;
  description: string;
  answers: QuizAnswer[];
};

const quizSteps: QuizStep[] = [
  {
    id: "concern",
    eyebrow: "Step 1",
    title: "What are you trying to understand?",
    description: "Pick the closest health goal. You can browse more later.",
    answers: [
      {
        id: "fatigue",
        label: "Tired or low energy",
        description: "Energy, thyroid, vitamins, and metabolism markers.",
        icon: Sparkles,
        searchBoost: "fatigue thyroid vitamin b12 metabolic",
      },
      {
        id: "annual",
        label: "Yearly wellness check",
        description: "Baseline labs for routine screening and follow-up.",
        icon: Stethoscope,
        searchBoost: "annual checkup cbc cmp lipid a1c",
      },
      {
        id: "blood-sugar",
        label: "Blood sugar or A1C",
        description: "Glucose and metabolic markers used for trends.",
        icon: Droplet,
        searchBoost: "diabetes a1c glucose metabolic",
      },
      {
        id: "thyroid",
        label: "Thyroid questions",
        description: "TSH and thyroid markers tied to energy and weight.",
        icon: Activity,
        searchBoost: "thyroid tsh free t4 free t3",
      },
      {
        id: "heart",
        label: "Heart markers",
        description: "Cholesterol and inflammation screening options.",
        icon: HeartPulse,
        searchBoost: "heart lipid cholesterol hs-crp apob",
      },
      {
        id: "hormones",
        label: "Hormones",
        description: "Common hormone markers for wellness questions.",
        icon: Microscope,
        searchBoost: "hormone testosterone cortisol dhea",
      },
      {
        id: "vitamins",
        label: "Vitamins or nutrients",
        description: "Vitamin D, B12, folate, and related wellness markers.",
        icon: TestTube2,
        searchBoost: "vitamin d b12 folate nutrient",
      },
      {
        id: "std-sti",
        label: "STD/STI screening",
        description: "Screening options for sexual health questions.",
        icon: ShieldCheck,
        searchBoost: "std sti screening",
      },
    ],
  },
  {
    id: "intent",
    eyebrow: "Step 2",
    title: "What best describes the reason?",
    description: "This helps decide whether a focused test or broader group fits.",
    answers: [
      {
        id: "routine-screening",
        label: "Routine screening",
        description: "I want a general snapshot before my next health conversation.",
        icon: ClipboardList,
        searchBoost: "screening wellness",
      },
      {
        id: "symptom-check",
        label: "Symptom check",
        description: "I have a specific concern and want relevant markers.",
        icon: Search,
        searchBoost: "symptom check",
      },
      {
        id: "monitoring",
        label: "Monitoring a marker",
        description: "I already know a marker or condition I am tracking.",
        icon: BadgeCheck,
        searchBoost: "monitoring follow up",
      },
      {
        id: "compare-bundles",
        label: "Compare bundled options",
        description: "I want grouped tests that cover more than one marker.",
        icon: Layers3,
        searchBoost: "panel bundle",
      },
    ],
  },
  {
    id: "preference",
    eyebrow: "Step 3",
    title: "How broad should the recommendation be?",
    description: "Choose how you prefer to start browsing.",
    answers: [
      {
        id: "single",
        label: "Single focused test",
        description: "Show me individual tests for a specific marker or topic.",
        icon: TestTube2,
      },
      {
        id: "panel",
        label: "Broader test panel",
        description: "Show me bundled panels when they fit this goal.",
        icon: Layers3,
        searchBoost: "panel",
      },
    ],
  },
  {
    id: "confidence",
    eyebrow: "Step 4",
    title: "How much guidance do you need?",
    description: "This sets the final browsing path and backup option.",
    answers: [
      {
        id: "know-need",
        label: "I know what I need",
        description: "Take me toward matching catalog results quickly.",
        icon: BadgeCheck,
      },
      {
        id: "help-narrow",
        label: "Help me narrow it down",
        description: "Start broader and let me compare options.",
        icon: Search,
        searchBoost: "popular",
      },
    ],
  },
];

const concernResults: Record<
  string,
  {
    title: string;
    summary: string;
    search: string;
    panelSearch: string;
    tags: string[];
  }
> = {
  fatigue: {
    title: "Start with energy, thyroid, and vitamin markers",
    summary:
      "These matches focus on common lab areas people review when low energy, metabolism, or nutrient status is the concern.",
    search: "fatigue thyroid vitamin b12 metabolic",
    panelSearch: "thyroid vitamin metabolic wellness panel",
    tags: ["TSH", "Vitamin D", "B12"],
  },
  annual: {
    title: "Start with a routine wellness baseline",
    summary:
      "These matches focus on broad screening markers often reviewed during annual wellness conversations.",
    search: "annual checkup cbc cmp lipid a1c",
    panelSearch: "annual wellness cbc cmp lipid panel",
    tags: ["CBC", "CMP", "Lipid"],
  },
  "blood-sugar": {
    title: "Start with blood sugar and metabolic markers",
    summary:
      "These matches focus on A1C, glucose, and related metabolic markers used to review blood sugar trends.",
    search: "diabetes a1c glucose metabolic",
    panelSearch: "diabetes a1c glucose metabolic panel",
    tags: ["A1C", "Glucose", "CMP"],
  },
  thyroid: {
    title: "Start with thyroid function markers",
    summary:
      "These matches focus on thyroid labs often reviewed for energy, weight, temperature, or thyroid follow-up questions.",
    search: "thyroid tsh free t4 free t3",
    panelSearch: "thyroid tsh free t4 free t3 panel",
    tags: ["TSH", "Free T4", "Free T3"],
  },
  heart: {
    title: "Start with cholesterol and heart markers",
    summary:
      "These matches focus on lipid and inflammation markers commonly used for heart-health screening.",
    search: "heart lipid cholesterol hs-crp apob",
    panelSearch: "heart lipid cholesterol cardiac panel",
    tags: ["Lipid", "hs-CRP", "ApoB"],
  },
  hormones: {
    title: "Start with hormone wellness markers",
    summary:
      "These matches focus on common hormone labs used for men's, women's, and general wellness questions.",
    search: "hormone testosterone cortisol dhea",
    panelSearch: "hormone testosterone cortisol dhea panel",
    tags: ["Testosterone", "Cortisol", "DHEA"],
  },
  vitamins: {
    title: "Start with vitamin and nutrient markers",
    summary:
      "These matches focus on nutrient labs often reviewed for wellness, energy, and deficiency questions.",
    search: "vitamin d b12 folate nutrient",
    panelSearch: "vitamin d b12 folate wellness panel",
    tags: ["Vitamin D", "B12", "Folate"],
  },
  "std-sti": {
    title: "Start with STD/STI screening options",
    summary:
      "These matches focus on sexual health screening options and related lab panels where available.",
    search: "std sti screening",
    panelSearch: "std sti screening panel",
    tags: ["STD", "STI", "Screening"],
  },
};

function buildCatalogUrl(pathname: "/tests" | "/panels", search: string) {
  return `${pathname}?search=${encodeURIComponent(search)}`;
}

function getResult(answers: Record<string, string>) {
  const concern = concernResults[answers.concern] ?? concernResults.annual;
  const wantsPanel =
    answers.preference === "panel" ||
    answers.intent === "compare-bundles" ||
    (answers.confidence === "help-narrow" && answers.intent === "routine-screening");
  const selectedStepAnswers = quizSteps
    .map((step) => step.answers.find((answer) => answer.id === answers[step.id]))
    .filter((answer): answer is QuizAnswer => Boolean(answer));
  const boosts = selectedStepAnswers
    .map((answer) => answer.searchBoost)
    .filter((value): value is string => Boolean(value));
  const primarySearch = wantsPanel ? concern.panelSearch : concern.search;
  const secondarySearch = wantsPanel ? concern.search : concern.panelSearch;
  const searchWithBoosts = Array.from(
    new Set(`${primarySearch} ${boosts.join(" ")}`.split(/\s+/).filter(Boolean)),
  ).join(" ");

  return {
    title: concern.title,
    summary: concern.summary,
    tags: concern.tags,
    primaryLabel: wantsPanel ? "See matching panels" : "See matching tests",
    primaryHref: buildCatalogUrl(wantsPanel ? "/panels" : "/tests", searchWithBoosts),
    secondaryLabel: wantsPanel ? "Browse individual tests" : "Compare test panels",
    secondaryHref: buildCatalogUrl(wantsPanel ? "/tests" : "/panels", secondarySearch),
  };
}

export function QuickHealthQuizDialog() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentStep = quizSteps[stepIndex];
  const isResultStep = stepIndex >= quizSteps.length;
  const progressValue = Math.round(
    (Math.min(stepIndex + 1, quizSteps.length) / quizSteps.length) * 100,
  );
  const currentAnswer = currentStep ? answers[currentStep.id] : undefined;
  const result = useMemo(() => getResult(answers), [answers]);

  const resetQuiz = () => {
    setStepIndex(0);
    setAnswers({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetQuiz();
    }
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    setStepIndex((value) => Math.min(value + 1, quizSteps.length));
  };

  const handleBack = () => {
    setStepIndex((value) => Math.max(value - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='h-11 rounded-lg bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-900'>
          Quick Health Quiz
          <ArrowRight className='h-4 w-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto rounded-3xl border-slate-200 p-0 shadow-2xl dark:border-slate-800'>
        <div className='border-b border-slate-200 bg-[linear-gradient(135deg,#fffaf0_0%,#f8fbff_58%,#eefbf6_100%)] px-5 py-5 dark:border-slate-800 dark:bg-slate-950 sm:px-7'>
          <DialogHeader className='space-y-3 text-left'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-amber-800 shadow-sm dark:border-amber-900/60 dark:bg-slate-900 dark:text-amber-300'>
              <Sparkles className='h-3.5 w-3.5' />
              Quick health quiz
            </div>
            <DialogTitle className='text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl'>
              {isResultStep ? "Your suggested starting point" : currentStep.title}
            </DialogTitle>
            <DialogDescription className='text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base'>
              {isResultStep
                ? "Use these matches as a browsing shortcut, then review each test or panel before checkout."
                : currentStep.description}
            </DialogDescription>
          </DialogHeader>

          <div className='mt-5 space-y-2'>
            <div className='flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              <span>{isResultStep ? "Results" : currentStep.eyebrow}</span>
              <span>{Math.min(stepIndex + 1, quizSteps.length)} of {quizSteps.length}</span>
            </div>
            <Progress
              value={isResultStep ? 100 : progressValue}
              className='h-2 bg-white/80 dark:bg-slate-800'
            />
          </div>
        </div>

        <div className='px-5 py-5 sm:px-7 sm:py-6'>
          {isResultStep ? (
            <div className='space-y-5'>
              <div className='rounded-2xl border border-sky-100 bg-sky-50/70 p-5 dark:border-cyan-900/50 dark:bg-cyan-950/20'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300'>
                    <BadgeCheck className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-xl font-black text-slate-950 dark:text-white'>
                      {result.title}
                    </h3>
                    <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
                      {result.summary}
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <Button
                  asChild
                  className='h-12 rounded-2xl bg-sky-700 font-black text-white hover:bg-sky-800'
                >
                  <Link href={result.primaryHref} onClick={() => setOpen(false)}>
                    {result.primaryLabel}
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='h-12 rounded-2xl bg-white font-bold dark:bg-slate-950'
                >
                  <Link href={result.secondaryHref} onClick={() => setOpen(false)}>
                    {result.secondaryLabel}
                  </Link>
                </Button>
              </div>

              <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200'>
                This quiz is educational browsing guidance only. It is not
                medical advice, diagnosis, or treatment.
              </div>
            </div>
          ) : (
            <div className='grid gap-3 sm:grid-cols-2'>
              {currentStep.answers.map((answer) => {
                const Icon = answer.icon;
                const selected = currentAnswer === answer.id;
                return (
                  <button
                    key={answer.id}
                    type='button'
                    onClick={() =>
                      setAnswers((value) => ({
                        ...value,
                        [currentStep.id]: answer.id,
                      }))
                    }
                    className={cn(
                      "group flex min-h-[124px] gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 dark:bg-slate-950 dark:focus:ring-cyan-400",
                      selected
                        ? "border-sky-500 bg-sky-50 shadow-sky-100 dark:border-cyan-500 dark:bg-cyan-950/20"
                        : "border-slate-200 hover:border-amber-200 hover:bg-amber-50/40 dark:border-slate-800 dark:hover:border-amber-900/60 dark:hover:bg-slate-900",
                    )}
                    aria-pressed={selected}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
                        selected
                          ? "border-sky-200 bg-white text-sky-700 dark:border-cyan-900 dark:bg-slate-950 dark:text-cyan-300"
                          : "border-slate-200 bg-slate-50 text-slate-500 group-hover:text-amber-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
                      )}
                    >
                      <Icon className='h-5 w-5' />
                    </span>
                    <span>
                      <span className='block text-base font-black leading-snug text-slate-950 dark:text-white'>
                        {answer.label}
                      </span>
                      <span className='mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {answer.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className='flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-7'>
          <Button
            type='button'
            variant='ghost'
            onClick={resetQuiz}
            className='rounded-2xl font-bold text-slate-600 dark:text-slate-300'
          >
            <RotateCcw className='h-4 w-4' />
            Start over
          </Button>

          <div className='grid gap-2 sm:flex sm:items-center'>
            <Button
              type='button'
              variant='outline'
              onClick={handleBack}
              disabled={stepIndex === 0}
              className='rounded-2xl bg-white font-bold dark:bg-slate-950'
            >
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
            {isResultStep ? (
              <Button
                type='button'
                onClick={() => setOpen(false)}
                className='rounded-2xl bg-slate-950 font-black text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
              >
                Close
              </Button>
            ) : (
              <Button
                type='button'
                onClick={handleNext}
                disabled={!currentAnswer}
                className='rounded-2xl bg-slate-950 font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
              >
                {stepIndex === quizSteps.length - 1 ? "Show results" : "Next"}
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
