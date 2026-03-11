"use client";

import type { Category } from "@/app/actions/categories";
import { getCategories } from "@/app/actions/categories";
import {
  createTest as createTestAPI,
  deleteTest as deleteTestAPI,
  getTests,
  updateTest as updateTestAPI,
  type GetTestsOptions,
} from "@/app/actions/tests";
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
import { formatTurnaroundDisplay } from "@/lib/test-utils";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TestEditDialog } from "./TestEditDialog";

type TestItem = {
  id: string;
  testCode: string;
  testName: string;
  price: number;
  turnaround?: number;
  specimenType?: string;
  description?: string;
  categoryId: string;
  category?: Category;
  testImage?: string;
  testDetails?: any[];
  isPublished?: boolean;
  isActive?: boolean;
};

type PublishFilter = "all" | "published" | "draft";
type ActiveFilter = "all" | "active" | "inactive";
type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-low-high"
  | "price-high-low";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const SORT_OPTIONS: Record<
  SortOption,
  {
    label: string;
    sortBy: GetTestsOptions["sortBy"];
    sortOrder: GetTestsOptions["sortOrder"];
  }
> = {
  newest: { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  oldest: { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
  "name-asc": { label: "Name (A-Z)", sortBy: "testName", sortOrder: "asc" },
  "name-desc": { label: "Name (Z-A)", sortBy: "testName", sortOrder: "desc" },
  "price-low-high": {
    label: "Price (Low-High)",
    sortBy: "price",
    sortOrder: "asc",
  },
  "price-high-low": {
    label: "Price (High-Low)",
    sortBy: "price",
    sortOrder: "desc",
  },
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

export function TestManagement() {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryId: "",
    publish: "all" as PublishFilter,
    active: "all" as ActiveFilter,
    sort: "newest" as SortOption,
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const result = await getCategories();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      const query: GetTestsOptions = {
        page,
        limit,
        searchTerm: filters.searchTerm || undefined,
        categoryId: filters.categoryId || undefined,
        sortBy: SORT_OPTIONS[filters.sort].sortBy,
        sortOrder: SORT_OPTIONS[filters.sort].sortOrder,
        adminView: true,
      };

      if (filters.publish === "published") query.isPublished = true;
      if (filters.publish === "draft") query.isPublished = false;
      if (filters.active === "active") query.isActive = true;
      if (filters.active === "inactive") query.isActive = false;

      const result = await getTests(query);
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

      setTests(result.data || []);
      setMeta(nextMeta);
    } catch (error) {
      console.error("Error loading tests:", error);
      toast({
        title: "Error",
        description: "Failed to load tests.",
        variant: "destructive",
      });
      setTests([]);
      setMeta((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [filters, limit, page, toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchInput.trim();
      if (normalized !== filters.searchTerm) {
        setPage(1);
        setFilters((prev) => ({ ...prev, searchTerm: normalized }));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [filters.searchTerm, searchInput]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const handleAdd = () => {
    setEditingTest(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (test: TestItem) => {
    setEditingTest(test);
    setIsDialogOpen(true);
  };

  const handleDelete = async (test: TestItem) => {
    const testName = test.testName || "this test";
    if (confirm(`Are you sure you want to delete "${testName}"?`)) {
      try {
        await deleteTestAPI(test.id);
        await loadTests();
        toast({
          title: "Test deleted",
          description: `${testName} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete test.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (testData: any, imageFile?: File) => {
    try {
      if (editingTest) {
        await updateTestAPI(editingTest.id, testData, imageFile);
        toast({
          title: "Success",
          description: `${testData.testName} has been updated.`,
        });
      } else {
        await createTestAPI(testData, imageFile);
        toast({
          title: "Success",
          description: `${testData.testName} has been created.`,
        });
      }
      setIsDialogOpen(false);
      await loadTests();
    } catch (error: any) {
      console.error("Error saving test:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const totalPages = Math.max(1, Math.ceil(meta.total / limit));
  const startRecord = meta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, meta.total);
  const hasActiveFilters = Boolean(
    filters.searchTerm ||
    filters.categoryId ||
    filters.publish !== "all" ||
    filters.active !== "all",
  );
  const paginationItems = buildPaginationItems(page, totalPages);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Tests</h2>
          <p className='text-muted-foreground'>Manage your lab test catalog</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='mr-2 h-4 w-4' />
          Add Test
        </Button>
      </div>

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
            <div className='relative md:col-span-2'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by test name or code'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select
              value={filters.categoryId || "all-categories"}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  categoryId: value === "all-categories" ? "" : value,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='All categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all-categories'>All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.publish}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  publish: value as PublishFilter,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Publication status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All publication states</SelectItem>
                <SelectItem value='published'>Published only</SelectItem>
                <SelectItem value='draft'>Draft only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-wrap items-center gap-2'>
              <Select
                value={filters.active}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    active: value as ActiveFilter,
                  }));
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Active state' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All active states</SelectItem>
                  <SelectItem value='active'>Active only</SelectItem>
                  <SelectItem value='inactive'>Inactive only</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sort}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    sort: value as SortOption,
                  }));
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SORT_OPTIONS) as [
                      SortOption,
                      { label: string },
                    ][]
                  ).map(([value, option]) => (
                    <SelectItem key={value} value={value}>
                      {option.label}
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
                <SelectTrigger className='w-[140px]'>
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

              <Button
                type='button'
                variant='outline'
                disabled={!hasActiveFilters}
                onClick={() => {
                  setSearchInput("");
                  setPage(1);
                  setFilters({
                    searchTerm: "",
                    categoryId: "",
                    publish: "all",
                    active: "all",
                    sort: "newest",
                  });
                }}
              >
                <RotateCcw className='mr-2 h-4 w-4' />
                Clear filters
              </Button>
            </div>

            <p className='text-sm text-muted-foreground'>
              {meta.total > 0
                ? `Showing ${startRecord}-${endRecord} of ${meta.total} tests`
                : "No tests found"}
            </p>
          </div>

          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Turnaround</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='h-28 text-center text-muted-foreground'
                    >
                      <div className='flex items-center justify-center gap-2'>
                        <Loader2 className='h-4 w-4 animate-spin' /> Loading
                        tests...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='h-28 text-center text-muted-foreground'
                    >
                      No tests match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  tests.map((test) => {
                    const categoryName =
                      test.category?.name ||
                      categoryNameById.get(test.categoryId);
                    return (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='font-medium'>{test.testName}</span>
                            <span className='text-xs text-muted-foreground'>
                              {test.testCode}
                            </span>
                            {test.specimenType && (
                              <span className='text-xs text-muted-foreground mt-0.5'>
                                {test.specimenType}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='secondary'>
                            {categoryName || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(test.price || 0)}</TableCell>
                        <TableCell>
                          <span className='text-sm text-muted-foreground'>
                            {test.turnaround
                              ? formatTurnaroundDisplay(test.turnaround, {
                                  style: "compact",
                                })
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {test.isActive ? (
                            <Badge
                              variant='outline'
                              className='font-normal bg-green-50 text-green-700 border-green-200'
                            >
                              <CheckCircle2 className='mr-1 h-3 w-3' /> Active
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='font-normal bg-gray-50 text-gray-700 border-gray-200'
                            >
                              <XCircle className='mr-1 h-3 w-3' /> Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {test.isActive === false ? (
                              <Badge
                                variant='outline'
                                className='text-destructive'
                              >
                                <XCircle className='mr-1 h-3 w-3' /> Archived
                              </Badge>
                            ) : test.isPublished ? (
                              <Badge className='bg-emerald-500 hover:bg-emerald-500'>
                                <CheckCircle2 className='mr-1 h-3 w-3' />{" "}
                                Published
                              </Badge>
                            ) : (
                              <Badge variant='secondary'>
                                <Clock3 className='mr-1 h-3 w-3' /> Draft
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleEdit(test)}
                              title='Edit'
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDelete(test)}
                              title='Delete'
                            >
                              <Trash2 className='h-4 w-4 text-destructive' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {meta.total > 0 && (
            <div className='flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between'>
              <p className='text-sm text-muted-foreground'>
                Page {page} of {totalPages}
              </p>
              <div className='flex items-center gap-1'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={loading || page <= 1}
                >
                  <ChevronLeft className='mr-1 h-4 w-4' />
                  Previous
                </Button>

                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className='px-1 text-muted-foreground'
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={item}
                      type='button'
                      variant={item === page ? "default" : "outline"}
                      size='sm'
                      className='min-w-9'
                      onClick={() => setPage(Number(item))}
                      disabled={loading}
                    >
                      {item}
                    </Button>
                  ),
                )}

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={loading || page >= totalPages}
                >
                  Next
                  <ChevronRight className='ml-1 h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TestEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        test={editingTest}
        onSave={handleSave}
      />
    </div>
  );
}
