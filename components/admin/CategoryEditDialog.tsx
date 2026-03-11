"use client";

import type { Category } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hook/use-toast";
import { useEffect, useState } from "react";

type CategoryFormData = {
  name: string;
};

interface CategoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSave: (categoryData: any) => void;
}

export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || "" });
    } else {
      setFormData({ name: "" });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    onSave({ name: formData.name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category ? "Update category name" : "Create a new test category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>
              Category Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder='e.g., General Health, Hormone Panel'
              required
            />
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
              {category ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type CategoryFormData = {
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
};

interface CategoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSave: (categoryData: any) => void;
}

export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    icon: "",
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        icon: category.icon || "",
        isActive: category.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        icon: "",
        isActive: true,
      });
    }
  }, [category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Slug is required",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      icon: formData.icon?.trim() || null,
      isActive: formData.isActive,
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update category information"
              : "Create a new test category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='md:col-span-2'>
              <Label htmlFor='name'>
                Category Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder='e.g., General Health, Hormone Panel'
                required
              />
            </div>

            <div className='md:col-span-2'>
              <Label htmlFor='slug'>
                Slug <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='slug'
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder='e.g., general-health, hormone-panel'
                required
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                URL-friendly identifier (lowercase, hyphens only)
              </p>
            </div>

            <div className='md:col-span-2'>
              <Label htmlFor='icon'>Icon (Lucide name)</Label>
              <Input
                id='icon'
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder='e.g., TestTube2, Heart, Activity'
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                Enter Lucide icon name
              </p>
            </div>

            <div className='md:col-span-2 flex items-center space-x-2'>
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
              {category ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
