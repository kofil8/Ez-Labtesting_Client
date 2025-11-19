"use client";

import { Badge } from "@/components/ui/badge";
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
import { formatCurrency } from "@/lib/utils";
import { Panel } from "@/types/panel";
import { Test } from "@/types/test";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PanelEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: Panel | null;
  tests: Test[];
  onSave: (panel: Panel) => void;
}

export function PanelEditDialog({
  open,
  onOpenChange,
  panel,
  tests,
  onSave,
}: PanelEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Panel>({
    defaultValues: {
      enabled: true,
      testIds: [],
    },
  });

  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const bundlePrice = watch("bundlePrice");
  const originalPrice = watch("originalPrice");

  useEffect(() => {
    if (panel) {
      reset(panel);
      setSelectedTestIds(panel.testIds || []);
    } else {
      reset({
        name: "",
        description: "",
        testIds: [],
        originalPrice: 0,
        bundlePrice: 0,
        savings: 0,
        enabled: true,
      } as Partial<Panel> as Panel);
      setSelectedTestIds([]);
    }
  }, [panel, reset]);

  // Calculate savings when prices change
  useEffect(() => {
    if (originalPrice && bundlePrice) {
      const savings = originalPrice - bundlePrice;
      setValue("savings", savings);
    }
  }, [originalPrice, bundlePrice, setValue]);

  // Calculate original price from selected tests
  useEffect(() => {
    if (selectedTestIds.length > 0) {
      const totalPrice = selectedTestIds.reduce((sum, testId) => {
        const test = tests.find((t) => t.id === testId);
        return sum + (test?.price || 0);
      }, 0);
      setValue("originalPrice", totalPrice);
    }
  }, [selectedTestIds, tests, setValue]);

  const onSubmit = (data: Panel) => {
    const panelData: Panel = {
      ...data,
      testIds: selectedTestIds,
      savings: data.originalPrice - data.bundlePrice,
    };
    onSave(panelData);
  };

  const toggleTest = (testId: string) => {
    const newSelected = selectedTestIds.includes(testId)
      ? selectedTestIds.filter((id) => id !== testId)
      : [...selectedTestIds, testId];
    setSelectedTestIds(newSelected);
  };

  const enabled = watch("enabled");

  const filteredTests =
    categoryFilter && categoryFilter !== "all"
      ? tests.filter((t) => t.category === categoryFilter)
      : tests;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto pb-0'>
        <DialogHeader>
          <DialogTitle>{panel ? "Edit Panel" : "Add New Panel"}</DialogTitle>
          <DialogDescription>
            {panel
              ? "Update panel information"
              : "Create a new test panel bundle"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='name'>Panel Name *</Label>
              <Input id='name' {...register("name", { required: true })} />
            </div>

            <div className='col-span-2 space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                {...register("description", { required: true })}
                rows={3}
              />
            </div>

            <div className='col-span-2 space-y-2'>
              <Label>Filter Tests by Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  <SelectItem value='general'>General Health</SelectItem>
                  <SelectItem value='hormone'>Hormone</SelectItem>
                  <SelectItem value='std'>STD Screening</SelectItem>
                  <SelectItem value='thyroid'>Thyroid</SelectItem>
                  <SelectItem value='cardiac'>Cardiac</SelectItem>
                  <SelectItem value='metabolic'>Metabolic</SelectItem>
                  <SelectItem value='nutrition'>Nutrition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='col-span-2 space-y-2'>
              <Label>Select Tests *</Label>
              <div className='border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2'>
                {filteredTests.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No tests available
                  </p>
                ) : (
                  filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className='flex items-center justify-between p-2 hover:bg-accent rounded'
                    >
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          checked={selectedTestIds.includes(test.id)}
                          onCheckedChange={() => toggleTest(test.id)}
                        />
                        <div>
                          <p className='text-sm font-medium'>{test.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {formatCurrency(test.price)} • {test.category}
                          </p>
                        </div>
                      </div>
                      {selectedTestIds.includes(test.id) && (
                        <Badge variant='secondary'>Selected</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
              {selectedTestIds.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {selectedTestIds.map((testId) => {
                    const test = tests.find((t) => t.id === testId);
                    return (
                      <Badge
                        key={testId}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {test?.name || testId}
                        <button
                          type='button'
                          onClick={() => toggleTest(testId)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='originalPrice'>Original Price ($) *</Label>
              <Input
                id='originalPrice'
                type='number'
                step='0.01'
                {...register("originalPrice", {
                  required: true,
                  valueAsNumber: true,
                })}
                readOnly
                className='bg-muted'
              />
              <p className='text-xs text-muted-foreground'>
                Calculated from selected tests
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bundlePrice'>Bundle Price ($) *</Label>
              <Input
                id='bundlePrice'
                type='number'
                step='0.01'
                {...register("bundlePrice", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='savings'>Savings ($)</Label>
              <Input
                id='savings'
                type='number'
                step='0.01'
                {...register("savings", { valueAsNumber: true })}
                readOnly
                className='bg-muted'
              />
              <p className='text-xs text-muted-foreground'>Auto-calculated</p>
            </div>

            <div className='col-span-2 flex items-center space-x-2'>
              <Checkbox
                id='enabled'
                checked={enabled}
                onCheckedChange={(checked) =>
                  setValue("enabled", checked as boolean)
                }
              />
              <Label htmlFor='enabled' className='font-normal cursor-pointer'>
                Panel is active and available for purchase
              </Label>
            </div>
          </div>

          <DialogFooter className='pt-4 pb-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={selectedTestIds.length === 0}>
              {panel ? "Update" : "Create"} Panel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
