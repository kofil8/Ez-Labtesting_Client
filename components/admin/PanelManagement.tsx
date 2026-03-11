"use client";

import {
  createPanel,
  deletePanel,
  getPanels,
  updatePanel,
} from "@/app/actions/panels";
import { getTests } from "@/app/actions/tests";
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
import { cn, formatCurrency } from "@/lib/utils";
import { CreatePanelInput, Panel, UpdatePanelInput } from "@/types/panel";
import { Test } from "@/types/test";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelEditDialog } from "./PanelEditDialog";

type ActiveFilter = "all" | "active" | "inactive";
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "savings";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const SORT_OPTIONS: Record<
  SortOption,
  { sortBy: string; sortOrder: "asc" | "desc"; label: string }
> = {
  newest: { sortBy: "createdAt", sortOrder: "desc", label: "Newest" },
  oldest: { sortBy: "createdAt", sortOrder: "asc", label: "Oldest" },
  "name-asc": { sortBy: "name", sortOrder: "asc", label: "Name (A-Z)" },
  "name-desc": { sortBy: "name", sortOrder: "desc", label: "Name (Z-A)" },
  savings: {
    sortBy: "discountPercent",
    sortOrder: "desc",
    label: "Highest Savings",
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

function getSavingsAmount(panel: Panel) {
  return Math.max(0, panel.basePrice - panel.bundlePrice);
}

function formatPanelDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PanelManagement() {
  const { toast } = useToast();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    active: "all" as ActiveFilter,
    sort: "newest" as SortOption,
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadTests = useCallback(async () => {
    try {
      const result = await getTests({
        page: 1,
        limit: 200,
        sortBy: "testName",
        sortOrder: "asc",
        isActive: true,
        adminView: true,
      });
      setTests((result.data as Test[]) || []);
    } catch (error) {
      setTests([]);
    }
  }, []);

  const loadPanels = useCallback(async () => {
    setLoading(true);
    try {
      const sortConfig = SORT_OPTIONS[filters.sort];
      const result = await getPanels({
        page,
        limit,
        searchTerm: filters.searchTerm || undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
        isActive:
          filters.active === "all"
            ? undefined
            : filters.active === "active"
              ? true
              : false,
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

      setPanels(result.data || []);
      setMeta(nextMeta);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unable to load panels.",
        variant: "destructive",
      });
      setPanels([]);
      setMeta((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [filters, limit, page, toast]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

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
    loadPanels();
  }, [loadPanels]);

  const handleAdd = () => {
    setEditingPanel(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (panel: Panel) => {
    setEditingPanel(panel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (panel: Panel) => {
    if (!confirm(`Delete "${panel.name}"?`)) return;
    try {
      await deletePanel(panel.id);
      toast({
        title: "Panel deleted",
        description: `${panel.name} has been removed.`,
      });
      await loadPanels();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete panel.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (
    payload: CreatePanelInput | UpdatePanelInput,
    imageFile?: File | null,
  ) => {
    try {
      if (editingPanel) {
        await updatePanel(
          editingPanel.id,
          payload as UpdatePanelInput,
          imageFile ?? undefined,
        );
        toast({
          title: "Panel updated",
          description: `${(payload as UpdatePanelInput).name || editingPanel.name} updated.`,
        });
      } else {
        await createPanel(payload as CreatePanelInput, imageFile ?? undefined);
        toast({
          title: "Panel created",
          description: `${(payload as CreatePanelInput).name} added.`,
        });
      }
      setIsDialogOpen(false);
      await loadPanels();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save panel.",
        variant: "destructive",
      });
    }
  };

  const getTestNames = (panel: Panel) =>
    panel.tests?.map((test) => test.testName).join(", ") || "";

  const totalPages = Math.max(1, Math.ceil(meta.total / limit));
  const startRecord = meta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, meta.total);
  const hasActiveFilters = Boolean(
    filters.searchTerm || filters.active !== "all" || filters.sort !== "newest",
  );
  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages],
  );
  const activePanelsOnPage = useMemo(
    () => panels.filter((panel) => panel.isActive).length,
    [panels],
  );
  const inactivePanelsOnPage = panels.length - activePanelsOnPage;
  const testsOnPage = useMemo(
    () => panels.reduce((sum, panel) => sum + panel.testsCount, 0),
    [panels],
  );
  const savingsOnPage = useMemo(
    () => panels.reduce((sum, panel) => sum + getSavingsAmount(panel), 0),
    [panels],
  );
  const avgDiscountOnPage = useMemo(() => {
    if (panels.length === 0) return 0;
    const totalDiscount = panels.reduce(
      (sum, panel) => sum + (panel.discountPercent || 0),
      0,
    );
    return totalDiscount / panels.length;
  }, [panels]);

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
    setFilters({
      searchTerm: "",
      active: "all",
      sort: "newest",
    });
  };

  return (
    <div className='mx-auto max-w-screen-xl space-y-6 px-2 md:px-4 lg:px-6'>
      <section className='rounded-xl border bg-card p-5 sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
              Test Panels
            </h1>
            <p className='text-sm text-muted-foreground'>
              Create and manage bundled test offers with clear pricing and
              status controls.
            </p>
          </div>
          <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap'>
            <Button
              type='button'
              variant='outline'
              onClick={loadPanels}
              disabled={loading}
              className='w-full sm:w-auto'
            >
              <RotateCcw
                className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
              />
              Refresh
            </Button>
            <Button onClick={handleAdd} className='w-full sm:w-auto'>
              <Plus className='mr-2 h-4 w-4' />
              Add Panel
            </Button>
          </div>
        </div>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='rounded-lg border bg-background p-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              Total Panels
            </p>
            <p className='mt-2 text-2xl font-semibold'>{meta.total}</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              {loading ? "Updating data..." : `${panels.length} in this page`}
            </p>
          </div>
          <div className='rounded-lg border bg-background p-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              Active Split
            </p>
            <p className='mt-2 text-2xl font-semibold'>
              {activePanelsOnPage}/{inactivePanelsOnPage}
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Active / inactive in current results
            </p>
          </div>
          <div className='rounded-lg border bg-background p-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              Included Tests
            </p>
            <p className='mt-2 text-2xl font-semibold'>{testsOnPage}</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Across visible panels
            </p>
          </div>
          <div className='rounded-lg border bg-background p-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              Avg. Discount
            </p>
            <p className='mt-2 text-2xl font-semibold'>
              {avgDiscountOnPage.toFixed(1)}%
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              {formatCurrency(savingsOnPage)} total savings in this page
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
            <div className='relative md:col-span-2 xl:col-span-2'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by panel name or slug'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-9'
                autoComplete='off'
                aria-label='Search panels'
              />
            </div>
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
              <SelectTrigger>
                <SelectValue placeholder='Availability status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
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
              <SelectTrigger>
                <SelectValue placeholder='Sort panels' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORT_OPTIONS).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='text-sm text-muted-foreground'>
              {meta.total > 0
                ? `Showing ${startRecord}-${endRecord} of ${meta.total} panels`
                : "No panels found"}
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Select
              value={String(limit)}
              onValueChange={(value) => {
                setPage(1);
                setLimit(Number(value) as (typeof PAGE_SIZE_OPTIONS)[number]);
              }}
            >
              <SelectTrigger className='h-9 w-28 sm:w-32'>
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
              {hasActiveFilters && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFilters}
                  className='flex items-center'
                >
                  <RotateCcw className='mr-1.5 h-3.5 w-3.5' />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <div className='space-y-3 p-3 lg:hidden'>
            {loading ? (
              <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading panels...
              </div>
            ) : panels.length === 0 ? (
              <div className='flex h-32 flex-col items-center justify-center gap-3 rounded-lg border'>
                <p className='text-sm text-muted-foreground'>
                  No panels match the current filters.
                </p>
                <Button type='button' size='sm' variant='outline' onClick={clearFilters}>
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Reset filters
                </Button>
              </div>
            ) : (
              panels.map((panel) => (
                <div key={panel.id} className='rounded-lg border p-3'>
                  <div className='flex items-start gap-3'>
                    {panel.panelImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={panel.panelImage}
                        alt={panel.name}
                        className='h-12 w-12 rounded-md border object-cover'
                      />
                    ) : (
                      <div className='h-12 w-12 rounded-md bg-gradient-to-br from-sky-400 to-cyan-500' />
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium'>{panel.name}</p>
                      <p className='truncate text-xs text-muted-foreground'>
                        {panel.description?.trim() || "No description provided."}
                      </p>
                    </div>
                    {panel.isActive ? (
                      <Badge className='bg-emerald-500 hover:bg-emerald-500'>Active</Badge>
                    ) : (
                      <Badge variant='outline' className='text-muted-foreground'>
                        Inactive
                      </Badge>
                    )}
                  </div>

                  <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                    <div className='rounded-md bg-muted/40 p-2'>
                      <p className='text-muted-foreground'>Tests</p>
                      <p className='font-medium'>
                        {panel.testsCount} test{panel.testsCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className='rounded-md bg-muted/40 p-2'>
                      <p className='text-muted-foreground'>Savings</p>
                      <p className='font-medium'>
                        {formatCurrency(getSavingsAmount(panel))}
                      </p>
                    </div>
                    <div className='rounded-md bg-muted/40 p-2'>
                      <p className='text-muted-foreground'>Base</p>
                      <p className='font-medium'>{formatCurrency(panel.basePrice)}</p>
                    </div>
                    <div className='rounded-md bg-muted/40 p-2'>
                      <p className='text-muted-foreground'>Bundle</p>
                      <p className='font-medium'>{formatCurrency(panel.bundlePrice)}</p>
                    </div>
                  </div>

                  <p className='mt-2 text-xs text-muted-foreground'>
                    Updated: {formatPanelDate(panel.updatedAt || panel.createdAt)}
                  </p>

                  <div className='mt-3 grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(panel)}
                      aria-label={`Edit ${panel.name}`}
                    >
                      <Pencil className='mr-1.5 h-4 w-4' />
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDelete(panel)}
                      aria-label={`Delete ${panel.name}`}
                    >
                      <Trash2 className='mr-1.5 h-4 w-4 text-destructive' />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className='hidden overflow-x-auto lg:block'>
            <Table>
              <TableHeader className='sticky top-0 z-10 bg-background'>
                <TableRow>
                  <TableHead>Panel</TableHead>
                  <TableHead>Included Tests</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='hidden lg:table-cell'>Updated</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      <div className='inline-flex items-center gap-2 text-muted-foreground'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Loading panels...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : panels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='h-32 text-center'>
                      <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                          No panels match the current filters.
                        </p>
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={clearFilters}
                        >
                          <RotateCcw className='mr-2 h-4 w-4' />
                          Reset filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  panels.map((panel) => (
                    <TableRow key={panel.id}>
                      <TableCell>
                        <div className='flex max-w-[280px] items-start gap-3 py-1 xl:max-w-[340px]'>
                          {panel.panelImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={panel.panelImage}
                              alt={panel.name}
                              className='h-12 w-12 rounded-md border object-cover'
                            />
                          ) : (
                            <div className='h-12 w-12 rounded-md bg-gradient-to-br from-sky-400 to-cyan-500' />
                          )}
                          <div className='min-w-0'>
                            <p className='font-medium'>{panel.name}</p>
                            <p className='max-w-[200px] truncate text-xs text-muted-foreground xl:max-w-[280px]'>
                              {panel.description?.trim() ||
                                "No description provided."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className='text-sm font-medium'>
                          {panel.testsCount} test
                          {panel.testsCount !== 1 ? "s" : ""}
                        </p>
                        <p className='mt-1 max-w-[180px] truncate text-xs text-muted-foreground xl:max-w-[260px]'>
                          {getTestNames(panel) || "No tests"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-1'>
                          <p className='text-xs text-muted-foreground'>
                            Base: {formatCurrency(panel.basePrice)}
                          </p>
                          <p className='text-sm font-semibold'>
                            Bundle: {formatCurrency(panel.bundlePrice)}
                          </p>
                          <Badge
                            variant='secondary'
                            className='bg-emerald-100 text-emerald-800'
                          >
                            Save {formatCurrency(getSavingsAmount(panel))}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {panel.isActive ? (
                          <Badge className='bg-emerald-500 hover:bg-emerald-500'>
                            <CheckCircle2 className='mr-1 h-3 w-3' />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='text-muted-foreground'>
                            <XCircle className='mr-1 h-3 w-3' />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <p className='text-sm'>
                          {formatPanelDate(panel.updatedAt || panel.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleEdit(panel)}
                            aria-label={`Edit ${panel.name}`}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleDelete(panel)}
                            aria-label={`Delete ${panel.name}`}
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

          <div className='flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm text-muted-foreground'>
              Page {page} of {totalPages}
            </p>
            <div className='hidden items-center gap-1.5 sm:flex'>
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
                    aria-label={`Go to page ${item}`}
                    disabled={loading}
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
            <div className='flex items-center justify-between gap-2 sm:hidden'>
              <Button
                variant='outline'
                size='sm'
                disabled={loading || page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                aria-label='Previous page'
              >
                <ChevronLeft className='mr-1 h-4 w-4' />
                Prev
              </Button>
              <span className='text-sm text-muted-foreground'>
                {page}/{totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={loading || page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                aria-label='Next page'
              >
                Next
                <ChevronRight className='ml-1 h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PanelEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        panel={editingPanel}
        tests={tests}
        onSave={handleSave}
      />
    </div>
  );
}
