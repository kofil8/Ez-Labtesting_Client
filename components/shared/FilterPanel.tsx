"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, X } from "lucide-react";
import { ReactNode } from "react";

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface FilterPanelProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onClose?: () => void;
  icon?: ReactNode;
}

export function FilterPanel({
  title,
  options,
  selectedValue,
  onValueChange,
  onClose,
  icon,
}: FilterPanelProps) {
  return (
    <Card className='border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm sticky top-20'>
      {/* Header */}
      <CardHeader className='pb-3 px-5 pt-5 border-b border-slate-100 dark:border-slate-800'>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle className='flex items-center gap-2 text-base'>
            {icon || <Filter className='h-4 w-4 text-primary' />}
            <span className='font-semibold uppercase tracking-wider text-sm'>
              {title}
            </span>
          </CardTitle>
          {onClose && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-800'
              aria-label='Close filters'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Options */}
      <CardContent className='px-3 pb-4 pt-4'>
        <RadioGroup
          value={selectedValue}
          onValueChange={onValueChange}
          className='space-y-1.5'
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedValue === option.id
                  ? "bg-primary/10 border border-primary/30 dark:bg-primary/20"
                  : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
              onClick={() => onValueChange(option.id)}
            >
              <Label
                htmlFor={option.id}
                className='flex items-center gap-2 flex-1 cursor-pointer text-sm'
              >
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className='h-4 w-4'
                />
                {option.icon && (
                  <span className='text-base leading-none'>{option.icon}</span>
                )}
                <span className='font-medium text-slate-900 dark:text-white'>
                  {option.label}
                </span>
              </Label>
              {option.badge && (
                <span className='text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full ml-2'>
                  {option.badge}
                </span>
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
