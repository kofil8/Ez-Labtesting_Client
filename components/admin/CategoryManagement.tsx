"use client";

import {
  createCategory as createCategoryAPI,
  deleteCategory as deleteCategoryAPI,
  getCategories,
  updateCategory as updateCategoryAPI,
  type Category,
} from "@/app/actions/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hook/use-toast";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryEditDialog } from "./CategoryEditDialog";

export function CategoryManagement() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategories({ includeInactive: true });
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    const categoryName = category.name || "this category";
    if (
      confirm(
        `Are you sure you want to delete "${categoryName}"? This will affect all tests in this category.`,
      )
    ) {
      try {
        await deleteCategoryAPI(category.id);
        await loadCategories();
        toast({
          title: "Category deleted",
          description: `${categoryName} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await updateCategoryAPI(editingCategory.id, categoryData);
        toast({
          title: "Category updated",
          description: `${categoryData.name} has been updated.`,
        });
      } else {
        await createCategoryAPI(categoryData);
        toast({
          title: "Category created",
          description: `${categoryData.name} has been added.`,
        });
      }
      setIsDialogOpen(false);
      await loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save category.",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      `${category.name} ${category.slug}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12 text-muted-foreground'>
        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Loading categories...
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Categories</h2>
          <p className='text-muted-foreground'>
            Manage test categories for organization
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='mr-2 h-4 w-4' />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className='space-y-4 p-4'>
          {/* Search */}
          <Input
            placeholder='Search by name or slug...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Table */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center text-muted-foreground'
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className='rounded bg-gray-100 px-2 py-1 text-xs'>
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        {category.icon ? (
                          <code className='text-xs text-muted-foreground'>
                            {category.icon}
                          </code>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge className='bg-emerald-500 hover:bg-emerald-500'>
                            <CheckCircle2 className='mr-1 h-3 w-3' /> Active
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='text-destructive'>
                            <XCircle className='mr-1 h-3 w-3' /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleEdit(category)}
                            title='Edit'
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(category)}
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4 text-destructive' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
