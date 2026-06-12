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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CategoryEditDialog } from "./CategoryEditDialog";

type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const SORT_OPTIONS: Record<
  SortOption,
  {
    label: string;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
  }
> = {
  "name-asc": { label: "Name (A-Z)", sortBy: "name", sortOrder: "asc" },
  "name-desc": { label: "Name (Z-A)", sortBy: "name", sortOrder: "desc" },
  newest: { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  oldest: { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
};

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [1];
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage, "...", totalPages];
}

export function CategoryManagement() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] =
    useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const sortConfig = SORT_OPTIONS[sort];
      const result = await getCategories({
        page,
        limit,
        search: searchTerm || undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      });
      const nextMeta = {
        page: result.meta?.page || page,
        limit: result.meta?.limit || limit,
        total: result.meta?.total || 0,
      };
      const totalPages = Math.max(
        1,
        Math.ceil(nextMeta.total / nextMeta.limit),
      );

      if (nextMeta.page > totalPages) {
        setPage(totalPages);
        return;
      }

      setCategories(result.data || []);
      setMeta(nextMeta);
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
  }, [limit, page, searchTerm, sort, toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchInput.trim();
      if (normalized !== searchTerm) {
        setPage(1);
        setSearchTerm(normalized);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm]);

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

  const totalPages = Math.max(1, Math.ceil(meta.total / limit));
  const startRecord = meta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, meta.total);
  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages],
  );

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
          <div className='grid gap-3 md:grid-cols-[1fr_180px_140px]'>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by name or slug...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select
              value={sort}
              onValueChange={(value) => {
                setPage(1);
                setSort(value as SortOption);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sort categories' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORT_OPTIONS).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setPage(1);
                setLimit(Number(value) as (typeof PAGE_SIZE_OPTIONS)[number]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Rows' />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='text-sm text-muted-foreground'>
            {meta.total > 0
              ? `Showing ${startRecord}-${endRecord} of ${meta.total} categories`
              : "No categories found"}
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center text-muted-foreground'
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
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

          <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm text-muted-foreground'>
              Page {page} of {totalPages}
            </p>
            <div className='flex items-center gap-1.5'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8'
                disabled={loading || page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                aria-label='Previous page'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className='px-2 text-muted-foreground'
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === page ? "default" : "outline"}
                    size='sm'
                    className='h-8 min-w-8 px-2'
                    onClick={() => setPage(item as number)}
                    disabled={loading}
                    aria-label={`Go to page ${item}`}
                  >
                    {item}
                  </Button>
                ),
              )}
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8'
                disabled={loading || page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                aria-label='Next page'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
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
