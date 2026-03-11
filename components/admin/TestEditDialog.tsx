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
import { normalizeTurnaround, parseTurnaroundInput } from "@/lib/test-utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TestDetailInput, TestDetailsForm } from "./TestDetailsForm";

type TestFormData = {
  testCode: string;
  testName: string;
  categoryId: string;
  price: number | string;
  turnaround?: number | string;
  specimenType?: string;
  description?: string;
  testImage?: string;
  testDetails: TestDetailInput[];
  isPublished: boolean;
  isActive: boolean;
};

type TestItem = {
  id?: string;
  testCode?: string;
  testName?: string;
  categoryId?: string;
  price?: number;
  turnaround?: number;
  specimenType?: string;
  description?: string;
  testImage?: string;
  testDetails?: TestDetailInput[];
  isPublished?: boolean;
  isActive?: boolean;
  category?: Category;
};

interface TestEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: TestItem | null;
  onSave: (testData: any, imageFile?: File) => void;
}

export function TestEditDialog({
  open,
  onOpenChange,
  test,
  onSave,
}: TestEditDialogProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<TestFormData>({
    testCode: "",
    testName: "",
    categoryId: "",
    price: 0,
    description: "",
    testImage: "",
    testDetails: [],
    isPublished: false,
    isActive: true,
  });

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
    if (test) {
      setFormData({
        testCode: test.testCode || "",
        testName: test.testName || "",
        categoryId: test.categoryId || "",
        price: test.price || 0,
        turnaround: test.turnaround || 0,
        specimenType: test.specimenType || "",
        description: test.description || "",
        testImage: test.testImage || "",
        testDetails: test.testDetails || [],
        isPublished: test.isPublished ?? false,
        isActive: test.isActive ?? true,
      });
      if (test.testImage) {
        setImagePreview(test.testImage);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        testCode: "",
        testName: "",
        categoryId: "",
        price: 0,
        turnaround: 0,
        specimenType: "",
        description: "",
        testImage: "",
        testDetails: [],
        isPublished: false,
        isActive: true,
      });
      setImagePreview(null);
    }
    setSelectedImageFile(null);
  }, [test]);

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
    setFormData({ ...formData, testImage: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.testCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Test code is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.testName.trim()) {
      toast({
        title: "Validation Error",
        description: "Test name is required",
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

    const priceNum = Number(formData.price);
    if (!priceNum || priceNum <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    // Validate image is required for new tests
    if (!test && !imagePreview && !selectedImageFile) {
      toast({
        title: "Validation Error",
        description: "Test image is required",
        variant: "destructive",
      });
      return;
    }

    // Validate turnaround
    if (!formData.turnaround) {
      toast({
        title: "Validation Error",
        description: "Turnaround time is required",
        variant: "destructive",
      });
      return;
    }

    try {
      normalizeTurnaround(formData.turnaround);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: `Invalid turnaround time: ${(error as Error).message}`,
        variant: "destructive",
      });
      return;
    }

    // Validate specimen type
    if (!formData.specimenType?.trim()) {
      toast({
        title: "Validation Error",
        description: "Specimen type is required",
        variant: "destructive",
      });
      return;
    }

    // Filter valid test details (optional)
    const validDetails = formData.testDetails.filter((d) => {
      // Only include details with all required fields filled
      return (
        d.component?.trim() &&
        d.method?.trim() &&
        d.cptCode?.trim() &&
        d.testingLocatiion?.trim()
      );
    });

    // Build payload
    const payload = {
      testCode: formData.testCode.trim(),
      testName: formData.testName.trim(),
      categoryId: formData.categoryId,
      price: priceNum,
      turnaround: formData.turnaround, // Send as-is, backend will normalize
      specimenType: formData.specimenType?.trim() || "",
      description: formData.description?.trim() || null,
      testDetails: validDetails.length > 0 ? validDetails : undefined,
      isPublished: formData.isPublished,
      isActive: formData.isActive,
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
                <Label htmlFor='testCode'>
                  Test Code <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='testCode'
                  value={formData.testCode}
                  onChange={(e) =>
                    setFormData({ ...formData, testCode: e.target.value })
                  }
                  placeholder='e.g., CBC-001'
                  required
                />
              </div>

              <div>
                <Label htmlFor='testName'>
                  Test Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='testName'
                  value={formData.testName}
                  onChange={(e) =>
                    setFormData({ ...formData, testName: e.target.value })
                  }
                  placeholder='e.g., Complete Blood Count'
                  required
                />
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
                <Label htmlFor='price'>
                  Price ($) <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  min='0'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder='0.00'
                  required
                />
              </div>

              <div>
                <Label htmlFor='turnaround'>
                  Turnaround Time <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='turnaround'
                  type='text'
                  value={formData.turnaround}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, turnaround: value });
                  }}
                  placeholder='e.g., 24h, 3-4 days, 48-72h'
                  required
                />
                {formData.turnaround &&
                  (() => {
                    const parsed = parseTurnaroundInput(formData.turnaround);
                    if (parsed) {
                      return (
                        <p className='text-xs text-muted-foreground mt-1'>
                          Will be stored as: {parsed.hours}h (
                          {parsed.displayFormat})
                        </p>
                      );
                    } else if (formData.turnaround) {
                      return (
                        <p className='text-xs text-destructive mt-1'>
                          Invalid format. Use: 24h, 3 days, 24-48 hours, 3-5d
                        </p>
                      );
                    }
                    return null;
                  })()}
              </div>

              <div>
                <Label htmlFor='specimenType'>
                  Specimen Type <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='specimenType'
                  value={formData.specimenType}
                  onChange={(e) =>
                    setFormData({ ...formData, specimenType: e.target.value })
                  }
                  placeholder='e.g., Blood, Urine, Saliva'
                  required
                />
              </div>
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
          </div>

          {/* Test Image */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Test Image</h3>

            <div>
              <Label htmlFor='testImage'>
                Upload Image <span className='text-destructive'>*</span>
              </Label>
              <div className='mt-2'>
                {imagePreview ? (
                  <div className='relative inline-block'>
                    <Image
                      src={imagePreview}
                      alt='Test preview'
                      width={200}
                      height={200}
                      className='rounded-lg border object-cover'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      className='absolute right-2 top-2'
                      onClick={handleRemoveImage}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor='testImage'
                    className='flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400'
                  >
                    <div className='text-center'>
                      <Upload className='mx-auto h-8 w-8 text-gray-400' />
                      <p className='mt-2 text-sm text-gray-600'>
                        Click to upload image{" "}
                        <span className='text-destructive'>*</span>
                      </p>
                      <p className='text-xs text-gray-500'>
                        PNG, JPG up to 5MB (Required)
                      </p>
                    </div>
                    <Input
                      id='testImage'
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Test Details - Optional */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>Test Details (Optional)</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                Add detailed specifications for this test. You can skip this
                section if not needed.
              </p>
            </div>
            <TestDetailsForm
              value={formData.testDetails}
              onChange={(details) =>
                setFormData({ ...formData, testDetails: details })
              }
            />
          </div>

          {/* Status Toggles */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Status</h3>

            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isPublished'
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isPublished: checked === true,
                    })
                  }
                />
                <Label htmlFor='isPublished' className='cursor-pointer'>
                  Published (visible to customers)
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isActive'
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked === true })
                  }
                />
                <Label htmlFor='isActive' className='cursor-pointer'>
                  Active
                </Label>
              </div>
            </div>
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
