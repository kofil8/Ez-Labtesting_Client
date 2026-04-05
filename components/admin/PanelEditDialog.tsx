"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { CreatePanelInput, Panel, UpdatePanelInput } from "@/types/panel";
import { Test } from "@/types/test";
import {
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  Loader2,
  Package,
  Search,
  Settings,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type PanelFormPayload = Omit<CreatePanelInput, "startsAt" | "endsAt"> & {
  startsAt?: string;
  endsAt?: string;
};

interface PanelEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: Panel | null;
  tests: Test[];
  onSave: (
    payload: PanelFormPayload | UpdatePanelInput,
    imageFile?: File | null,
  ) => Promise<void>;
}

type Step = "info" | "tests" | "pricing";

const STEP_ORDER: Step[] = ["info", "tests", "pricing"];

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Basic Info", icon: <Tag className='h-4 w-4' /> },
  { id: "tests", label: "Select Tests", icon: <Package className='h-4 w-4' /> },
  { id: "pricing", label: "Pricing", icon: <Settings className='h-4 w-4' /> },
];

const resolveCategoryLabel = (category: unknown): string => {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  if (typeof category === "object" && category !== null) {
    const c = category as Record<string, unknown>;
    return String(c.name ?? c.label ?? c.value ?? "Uncategorized");
  }
  return String(category);
};

export function PanelEditDialog({
  open,
  onOpenChange,
  panel,
  tests,
  onSave,
}: PanelEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<
    Partial<Panel>
  >({ defaultValues: { isActive: true, tests: [] } });

  const [step, setStep] = useState<Step>("info");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [testSearch, setTestSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bundlePrice = watch("bundlePrice") ?? 0;
  const basePrice = watch("basePrice") ?? 0;
  const discountPercent = watch("discountPercent") ?? 0;
  const isActive = watch("isActive");

  // Reset on open / panel change
  useEffect(() => {
    if (!open) return;
    setStep("info");
    setTestSearch("");
    setCategoryFilter("all");
    setImageFile(null);
    if (panel) {
      reset({
        name: panel.name,
        description: panel.description,
        basePrice: panel.basePrice,
        discountPercent: panel.discountPercent,
        bundlePrice: panel.bundlePrice,
        isActive: panel.isActive,
      });
      setImagePreview(panel.panelImage ?? null);
      setSelectedTestIds(panel.tests.map((t) => t.id));
    } else {
      reset({
        name: "",
        description: "",
        basePrice: 0,
        discountPercent: 0,
        bundlePrice: 0,
        isActive: true,
        tests: [],
      });
      setImagePreview(null);
      setSelectedTestIds([]);
    }
  }, [panel, reset, open]);

  // Bundle price from discount %
  useEffect(() => {
    if (basePrice && discountPercent !== undefined) {
      const bundle = basePrice * (1 - discountPercent / 100);
      setValue("bundlePrice", Math.round(bundle * 100) / 100);
    }
  }, [basePrice, discountPercent, setValue]);

  // Base price from selected tests
  useEffect(() => {
    const total = selectedTestIds.reduce((sum, id) => {
      const t = tests.find((t) => t.id === id);
      return sum + (t?.price ?? 0);
    }, 0);
    setValue("basePrice", total);
  }, [selectedTestIds, tests, setValue]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tests.forEach((t) => cats.add(resolveCategoryLabel(t.category)));
    return Array.from(cats).sort();
  }, [tests]);

  const filteredTests = useMemo(
    () =>
      tests.filter((t) => {
        const matchCat =
          categoryFilter === "all" ||
          resolveCategoryLabel(t.category) === categoryFilter;
        const matchSearch =
          !testSearch ||
          t.testName.toLowerCase().includes(testSearch.toLowerCase()) ||
          (t.labCode ?? "").toLowerCase().includes(testSearch.toLowerCase());
        return matchCat && matchSearch;
      }),
    [tests, categoryFilter, testSearch],
  );

  const selectedTests = useMemo(
    () => tests.filter((t) => selectedTestIds.includes(t.id)),
    [tests, selectedTestIds],
  );

  const toggleTest = (testId: string) =>
    setSelectedTestIds((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId],
    );

  const onSubmit = async (data: Partial<Panel>) => {
    setFormError(null);
    const panelName = (data.name ?? "").trim();
    const bp = Number(data.basePrice ?? 0);
    const bundle = Number(data.bundlePrice ?? 0);
    const discountFromBundle = bp > 0 ? ((bp - bundle) / bp) * 100 : 0;
    const discount = Math.max(
      0,
      Math.min(100, Number(data.discountPercent ?? discountFromBundle)),
    );
    if (!panelName) {
      setFormError("Panel name is required.");
      return;
    }

    if (selectedTestIds.length === 0) {
      setFormError("Please select at least one test.");
      return;
    }

    if (!bundle || Number.isNaN(bundle) || bundle <= 0) {
      setFormError("Bundle price must be a positive number.");
      return;
    }

    const payload: PanelFormPayload = {
      name: panelName,
      description: data.description ?? "",
      basePrice: bp,
      discountPercent: Number(discount.toFixed(2)),
      isActive: data.isActive ?? true,
      testIds: selectedTestIds,
    };

    setIsSubmitting(true);
    try {
      await onSave(payload, imageFile);
    } catch (err: any) {
      setFormError(err?.message || "Failed to save panel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const savings = basePrice > bundlePrice ? basePrice - bundlePrice : 0;
  const savingsPct =
    basePrice > 0 && savings > 0 ? Math.round((savings / basePrice) * 100) : 0;

  const currentStepIndex = STEP_ORDER.indexOf(step);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='p-0 gap-0 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* ── Header ── */}
        <div className='px-6 pt-6 pb-4 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex-shrink-0'>
          <DialogTitle className='text-xl font-bold text-slate-900 dark:text-white'>
            {panel ? "Edit Panel" : "Create Test Panel"}
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground mt-0.5'>
            {panel
              ? `Editing "${panel.name}"`
              : "Bundle multiple tests into a discounted panel"}
          </DialogDescription>

          {/* Step pills */}
          <div className='flex items-center gap-1 mt-4'>
            {STEPS.map((s, i) => (
              <div key={s.id} className='flex items-center gap-1'>
                <button
                  type='button'
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    step === s.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {s.icon}
                  {s.label}
                  {s.id === "tests" && selectedTestIds.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold ${
                        step === s.id
                          ? "bg-white/25 text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      {selectedTestIds.length}
                    </span>
                  )}
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight className='h-3 w-3 text-slate-300 flex-shrink-0' />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col flex-1 min-h-0'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Prevent Enter from submitting unless focused on a textarea
              if (
                e.target &&
                (e.target as HTMLElement).tagName !== "TEXTAREA"
              ) {
                e.preventDefault();
              }
            }
          }}
        >
          <div className='flex-1 overflow-y-auto px-6 py-5'>
            {/* Step 1: Basic Info */}
            {step === "info" && (
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 space-y-1.5'>
                  <Label htmlFor='name' className='text-sm font-semibold'>
                    Panel Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='name'
                    placeholder='e.g. Complete Health Panel'
                    {...register("name", { required: true })}
                  />
                </div>

                <div className='col-span-2 space-y-1.5'>
                  <Label
                    htmlFor='description'
                    className='text-sm font-semibold'
                  >
                    Full Description
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='Detailed description of what is included...'
                    {...register("description")}
                    rows={3}
                    className='resize-none'
                  />
                </div>

                {/* ── Image Upload ── */}
                <div className='col-span-2 space-y-1.5'>
                  <Label className='text-sm font-semibold'>Panel Image</Label>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/webp,image/gif'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />

                  {imagePreview ? (
                    <div className='relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt='Panel preview'
                        className='w-full h-40 object-cover'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                        <button
                          type='button'
                          onClick={() => fileInputRef.current?.click()}
                          className='bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors'
                        >
                          Change
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className='bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1'
                        >
                          <Trash2 className='h-3 w-3' /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }}
                      className={`w-full h-36 border-2 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <ImagePlus className='h-8 w-8 text-muted-foreground' />
                      <div className='text-center'>
                        <p className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                          Click to upload or drag &amp; drop
                        </p>
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          PNG, JPG, WebP, GIF — max 10 MB
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Select Tests */}
            {step === "tests" && (
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                    <Input
                      placeholder='Search by name or code...'
                      value={testSearch}
                      onChange={(e) => setTestSearch(e.target.value)}
                      className='pl-9'
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className='w-44'>
                      <SelectValue placeholder='All Categories' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='border rounded-xl overflow-hidden'>
                  <div className='max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800'>
                    {filteredTests.length === 0 ? (
                      <div className='py-10 text-center text-sm text-muted-foreground'>
                        No tests match your search
                      </div>
                    ) : (
                      filteredTests.map((test) => {
                        const selected = selectedTestIds.includes(test.id);
                        return (
                          <button
                            key={test.id}
                            type='button'
                            onClick={() => toggleTest(test.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              selected
                                ? "bg-primary/5 dark:bg-primary/10"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                                selected
                                  ? "bg-primary border-primary"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {selected && (
                                <CheckCircle2 className='h-3.5 w-3.5 text-white' />
                              )}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
                                {test.testName}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {resolveCategoryLabel(test.category)}
                                {test.labCode && ` • ${test.labCode}`}
                              </p>
                            </div>
                            <span className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0'>
                              {formatCurrency(test.price)}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {selectedTests.length > 0 && (
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2'>
                      Selected ({selectedTests.length})
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {selectedTests.map((test) => (
                        <span
                          key={test.id}
                          className='inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full'
                        >
                          {test.testName}
                          <button
                            type='button'
                            onClick={() => toggleTest(test.id)}
                            className='hover:text-red-500 transition-colors ml-0.5'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pricing */}
            {step === "pricing" && (
              <div className='space-y-5'>
                {/* Live summary card */}
                <div className='rounded-xl border bg-slate-50 dark:bg-slate-800/50 p-4 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 text-center'>
                  <div className='pr-4'>
                    <p className='text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mb-1'>
                      Base Price
                    </p>
                    <p className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {formatCurrency(basePrice)}
                    </p>
                    <p className='text-[11px] text-muted-foreground mt-0.5'>
                      {selectedTestIds.length} test
                      {selectedTestIds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className='px-4'>
                    <p className='text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mb-1'>
                      Bundle Price
                    </p>
                    <p className='text-2xl font-bold text-primary'>
                      {formatCurrency(bundlePrice)}
                    </p>
                    <p className='text-[11px] text-muted-foreground mt-0.5'>
                      customer pays
                    </p>
                  </div>
                  <div className='pl-4'>
                    <p className='text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mb-1'>
                      Savings
                    </p>
                    <p className='text-2xl font-bold text-emerald-600'>
                      {savingsPct}%
                    </p>
                    <p className='text-[11px] text-muted-foreground mt-0.5'>
                      {formatCurrency(savings)} off
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label
                      htmlFor='basePrice'
                      className='text-sm font-semibold'
                    >
                      Base Price ($)
                    </Label>
                    <Input
                      id='basePrice'
                      type='number'
                      step='0.01'
                      {...register("basePrice", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      readOnly
                      className='bg-muted cursor-not-allowed'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Auto-calculated from selected tests
                    </p>
                  </div>

                  <div className='space-y-1.5'>
                    <Label
                      htmlFor='discountPercent'
                      className='text-sm font-semibold'
                    >
                      Discount (%)
                    </Label>
                    <Input
                      id='discountPercent'
                      type='number'
                      step='0.01'
                      min='0'
                      max='100'
                      placeholder='0'
                      {...register("discountPercent", { valueAsNumber: true })}
                    />
                  </div>

                  <div className='col-span-2 space-y-1.5'>
                    <Label
                      htmlFor='bundlePrice'
                      className='text-sm font-semibold'
                    >
                      Bundle Price ($) <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='bundlePrice'
                      type='number'
                      step='0.01'
                      {...register("bundlePrice", {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Override the auto-calculated bundle price if needed
                    </p>
                  </div>
                </div>

                {/* Active toggle */}
                <button
                  type='button'
                  onClick={() => setValue("isActive", !isActive)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 transition-colors text-left ${
                    isActive
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                      : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                  }`}
                >
                  <div>
                    <p className='text-sm font-semibold'>
                      {isActive ? "Active" : "Inactive"}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {isActive
                        ? "Panel is visible and available for purchase"
                        : "Panel is hidden from customers"}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      isActive
                        ? "bg-emerald-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className='px-6 py-4 border-t bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 flex-shrink-0'>
            {formError && (
              <div className='absolute left-6 bottom-16 text-sm text-red-600'>
                {formError}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              {selectedTestIds.length > 0
                ? `${selectedTestIds.length} test${selectedTestIds.length !== 1 ? "s" : ""} • Base: ${formatCurrency(basePrice)}`
                : "No tests selected yet"}
            </p>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {step !== "pricing" ? (
                <Button
                  type='button'
                  size='sm'
                  onClick={() => setStep(STEP_ORDER[currentStepIndex + 1])}
                >
                  Next
                  <ChevronRight className='ml-1 h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='button'
                  size='sm'
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={
                    isSubmitting ||
                    !watch("name") ||
                    selectedTestIds.length === 0 ||
                    !watch("bundlePrice") ||
                    Number(watch("bundlePrice")) <= 0
                  }
                >
                  {isSubmitting ? (
                    <span className='inline-flex items-center gap-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Saving...
                    </span>
                  ) : panel ? (
                    "Save Changes"
                  ) : (
                    "Create Panel"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
