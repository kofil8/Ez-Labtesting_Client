"use client";

import { Category, getCategories } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { useToast } from "@/hook/use-toast";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyForm(): TestFormData {
  return {
    name: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    specimenType: "",
    cptCode: "",
    baseTurnaroundDays: "",
    isPanel: false,
    isActive: true,
    isPopular: false,
    requiresFasting: false,
    minAge: "",
    maxAge: "",
    preparationInstructions: "",
    internalNotes: "",
    seoTitle: "",
    seoDescription: "",
    searchKeywords: "",
  };
}

function testToForm(test: TestItem | null): TestFormData {
  if (!test) return emptyForm();
  return {
    name: test.name || "",
    slug: test.slug || "",
    categoryId: test.categoryId || test.category?.id || "",
    shortDescription: test.shortDescription || "",
    description: test.description || "",
    specimenType: test.specimenType || "",
    cptCode: (test.cptCode || []).join(", "),
    baseTurnaroundDays:
      test.baseTurnaroundDays != null ? String(test.baseTurnaroundDays) : "",
    isPanel: test.isPanel ?? false,
    isActive: test.isActive ?? true,
    isPopular: test.isPopular ?? false,
    requiresFasting: test.requiresFasting ?? false,
    minAge: test.minAge != null ? String(test.minAge) : "",
    maxAge: test.maxAge != null ? String(test.maxAge) : "",
    preparationInstructions: test.preparationInstructions || "",
    internalNotes: test.internalNotes || "",
    seoTitle: test.seoTitle || "",
    seoDescription: test.seoDescription || "",
    searchKeywords: (test.searchKeywords || []).join(", "),
    testImageUrl: test.testImageUrl || undefined,
  };
}

type TestFormData = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  specimenType: string;
  cptCode: string; // comma-separated UI string
  baseTurnaroundDays: string; // number-like input
  isPanel: boolean;
  isActive: boolean;
  isPopular: boolean;
  requiresFasting: boolean;
  minAge: string;
  maxAge: string;
  preparationInstructions: string;
  internalNotes: string;
  seoTitle: string;
  seoDescription: string;
  searchKeywords: string; // comma-separated UI string
  testImageUrl?: string;
};

// Matches the payload accepted by `createTest`/`updateTest` server actions.
// Inlined here because re-exporting types from a `"use server"` module is unreliable.
type TestPayload = {
  name?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  categoryId?: string;
  specimenType?: string | null;
  cptCode?: string[] | string;
  baseTurnaroundDays?: number | string;
  isPanel?: boolean;
  preparationInstructions?: string | null;
  internalNotes?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  searchKeywords?: string[] | string;
  requiresFasting?: boolean;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isPopular?: boolean;
  removeTestImage?: boolean;
  componentTestIds?: string[];
};

type TestItem = {
  id?: string;
  name?: string;
  slug?: string;
  categoryId?: string;
  shortDescription?: string | null;
  description?: string | null;
  specimenType?: string | null;
  cptCode?: string[];
  baseTurnaroundDays?: number | null;
  isPanel?: boolean;
  isActive?: boolean;
  isPopular?: boolean;
  requiresFasting?: boolean;
  minAge?: number | null;
  maxAge?: number | null;
  preparationInstructions?: string | null;
  internalNotes?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  searchKeywords?: string[];
  testImageUrl?: string | null;
  category?: Pick<Category, "id" | "name"> | Category | null;
};

interface TestEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: TestItem | null;
  onSave: (testData: any, imageFile?: File) => void;
  allowPanels?: boolean;
}

export function TestEditDialog({
  open,
  onOpenChange,
  test,
  onSave,
  allowPanels = true,
}: TestEditDialogProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeTestImage, setRemoveTestImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState<TestFormData>(emptyForm());

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const result = await getCategories();
        setCategories(result.data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [toast]);

  // Reset form when test changes
  useEffect(() => {
    const nextForm = testToForm(test);
    if (!allowPanels) nextForm.isPanel = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(nextForm);
    setSlugTouched(Boolean(test?.slug));
    setImagePreview(test?.testImageUrl || null);
    setSelectedImageFile(null);
    setRemoveTestImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [allowPanels, test]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImageFile(file);
      setRemoveTestImage(false);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImageFile(null);
    setImagePreview(null);
    setRemoveTestImage(Boolean(test?.testImageUrl));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const slug = (formData.slug || toSlug(name)).trim();

    if (!name) {
      toast({
        title: "Validation Error",
        description: "Test name is required",
        variant: "destructive",
      });
      return;
    }

    if (!slug) {
      toast({
        title: "Validation Error",
        description: "Test slug is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return;
    }

    // baseTurnaroundDays: optional but if present must parse as positive int.
    // Backend normalizer treats a bare number as HOURS, so explicitly suffix
    // " days" to keep this dialog's semantic (the label says "days").
    let baseTurnaroundDays: string | undefined;
    if (formData.baseTurnaroundDays.trim() !== "") {
      const parsed = Number(formData.baseTurnaroundDays);
      if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
        toast({
          title: "Validation Error",
          description: "Turnaround days must be a non-negative whole number",
          variant: "destructive",
        });
        return;
      }
      baseTurnaroundDays = `${parsed} days`;
    }

    const parseAge = (value: string): number | undefined => {
      if (value.trim() === "") return undefined;
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n))
        return NaN as any;
      return n;
    };

    const minAge = parseAge(formData.minAge);
    const maxAge = parseAge(formData.maxAge);

    if (Number.isNaN(minAge as any) || Number.isNaN(maxAge as any)) {
      toast({
        title: "Validation Error",
        description: "Ages must be non-negative whole numbers",
        variant: "destructive",
      });
      return;
    }

    if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
      toast({
        title: "Validation Error",
        description: "Min age cannot be greater than max age",
        variant: "destructive",
      });
      return;
    }

    const splitCsv = (value: string): string[] =>
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

    const payload: TestPayload = {
      name,
      slug,
      categoryId: formData.categoryId,
      shortDescription: formData.shortDescription.trim() || null,
      description: formData.description.trim() || null,
      specimenType: formData.specimenType.trim() || null,
      cptCode: splitCsv(formData.cptCode),
      baseTurnaroundDays,
      isPanel: allowPanels ? formData.isPanel : false,
      isActive: formData.isActive,
      isPopular: formData.isPopular,
      requiresFasting: formData.requiresFasting,
      minAge,
      maxAge,
      preparationInstructions: formData.preparationInstructions.trim() || null,
      internalNotes: formData.internalNotes.trim() || null,
      seoTitle: formData.seoTitle.trim() || null,
      seoDescription: formData.seoDescription.trim() || null,
      searchKeywords: splitCsv(formData.searchKeywords),
      ...(removeTestImage ? { removeTestImage: true } : {}),
    };

    onSave(payload, selectedImageFile || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{test ? "Edit Test" : "Add New Test"}</DialogTitle>
          <DialogDescription>
            {test
              ? "Update test information and details"
              : "Create a new lab test with details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Basic Information</h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='name'>
                  Test Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: value,
                      slug: slugTouched ? prev.slug : toSlug(value),
                    }));
                  }}
                  placeholder='e.g., Complete Blood Count'
                  required
                />
              </div>

              <div>
                <Label htmlFor='slug'>
                  Slug <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='slug'
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  placeholder='complete-blood-count'
                  required
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Used in URLs. Must be unique. Auto-generated from name.
                </p>
              </div>

              <div>
                <Label htmlFor='categoryId'>
                  Category <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  disabled={loadingCategories}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='specimenType'>Specimen Type</Label>
                <Input
                  id='specimenType'
                  value={formData.specimenType}
                  onChange={(e) =>
                    setFormData({ ...formData, specimenType: e.target.value })
                  }
                  placeholder='e.g., Blood, Urine, Saliva'
                />
              </div>

              <div>
                <Label htmlFor='cptCode'>CPT Codes</Label>
                <Input
                  id='cptCode'
                  value={formData.cptCode}
                  onChange={(e) =>
                    setFormData({ ...formData, cptCode: e.target.value })
                  }
                  placeholder='Comma separated, e.g. 80053, 85025'
                />
              </div>

              <div>
                <Label htmlFor='baseTurnaroundDays'>Turnaround (days)</Label>
                <Input
                  id='baseTurnaroundDays'
                  type='number'
                  min='0'
                  step='1'
                  value={formData.baseTurnaroundDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      baseTurnaroundDays: e.target.value,
                    })
                  }
                  placeholder='e.g. 3'
                />
              </div>

              <div>
                <Label htmlFor='minAge'>Minimum age</Label>
                <Input
                  id='minAge'
                  type='number'
                  min='0'
                  step='1'
                  value={formData.minAge}
                  onChange={(e) =>
                    setFormData({ ...formData, minAge: e.target.value })
                  }
                  placeholder='e.g. 18'
                />
              </div>

              <div>
                <Label htmlFor='maxAge'>Maximum age</Label>
                <Input
                  id='maxAge'
                  type='number'
                  min='0'
                  step='1'
                  value={formData.maxAge}
                  onChange={(e) =>
                    setFormData({ ...formData, maxAge: e.target.value })
                  }
                  placeholder='e.g. 99'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='shortDescription'>Short description</Label>
              <Input
                id='shortDescription'
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                placeholder='One-line summary for catalog cards'
              />
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what this test measures and why it's important..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor='preparationInstructions'>
                Preparation instructions
              </Label>
              <Textarea
                id='preparationInstructions'
                value={formData.preparationInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationInstructions: e.target.value,
                  })
                }
                placeholder='Fasting, hydration, medication notes for patients'
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor='internalNotes'>Internal notes</Label>
              <Textarea
                id='internalNotes'
                value={formData.internalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, internalNotes: e.target.value })
                }
                placeholder='Notes for staff (not shown to customers)'
                rows={2}
              />
            </div>
          </div>

          {/* SEO */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>SEO</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='seoTitle'>SEO title</Label>
                <Input
                  id='seoTitle'
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='searchKeywords'>Search keywords</Label>
                <Input
                  id='searchKeywords'
                  value={formData.searchKeywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      searchKeywords: e.target.value,
                    })
                  }
                  placeholder='Comma separated keywords'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='seoDescription'>SEO description</Label>
              <Textarea
                id='seoDescription'
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>

          {/* Test Image */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Test Image</h3>

            <div className='space-y-2'>
              <Label htmlFor='testImage'>Catalog image</Label>
              <Input
                ref={fileInputRef}
                id='testImage'
                type='file'
                accept='image/png,image/jpeg,image/webp,image/gif'
                onChange={handleImageChange}
                className='hidden'
              />

              {imagePreview ? (
                <div className='overflow-hidden rounded-lg border bg-muted/20'>
                  <div className='relative aspect-[16/9] max-h-64 w-full bg-muted'>
                    {/* Plain img avoids next/image domain restrictions for admin S3 previews. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt='Test preview'
                      className='h-full w-full object-cover'
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-3 p-3'>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium'>
                        {selectedImageFile?.name || "Current test image"}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        PNG, JPG, WebP or GIF up to 5MB.
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className='mr-2 h-4 w-4' />
                        Change
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const file = e.dataTransfer.files?.[0];
                    if (!file) return;
                    const input = fileInputRef.current;
                    if (input) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      input.files = dataTransfer.files;
                    }
                    handleImageChange({
                      target: { files: [file] },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    isDraggingImage
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <ImagePlus className='h-9 w-9 text-muted-foreground' />
                  <span className='mt-2 text-sm font-medium'>
                    Upload test image
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    Click or drag an image here. Max 5MB.
                  </span>
                  {removeTestImage && (
                    <span className='mt-2 text-xs text-destructive'>
                      Current image will be removed on save.
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Status Toggles */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Flags</h3>

            <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isActive'
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked === true })
                  }
                />
                <Label htmlFor='isActive' className='cursor-pointer'>
                  Active (visible in catalog)
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isPopular'
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked === true })
                  }
                />
                <Label htmlFor='isPopular' className='cursor-pointer'>
                  Popular
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='requiresFasting'
                  checked={formData.requiresFasting}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      requiresFasting: checked === true,
                    })
                  }
                />
                <Label htmlFor='requiresFasting' className='cursor-pointer'>
                  Requires fasting
                </Label>
              </div>

              {allowPanels && (
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='isPanel'
                    checked={formData.isPanel}
                    disabled={Boolean(test?.id)}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPanel: checked === true })
                    }
                  />
                  <Label htmlFor='isPanel' className='cursor-pointer'>
                    Panel test
                  </Label>
                </div>
              )}
            </div>
            {allowPanels && formData.isPanel && (
              <p className='text-xs text-muted-foreground'>
                Use the panel components manager (separate screen) to attach
                component tests.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>
              {test ? "Update Test" : "Create Test"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
