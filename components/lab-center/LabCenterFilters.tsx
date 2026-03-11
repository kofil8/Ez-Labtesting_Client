"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface LabCenterFiltersProps {
  radius: number;
  type: string;
  status: string;
  onRadiusChange: (value: number) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  disabled?: boolean;
}

const LAB_TYPES = [
  { value: "all", label: "All Types" },
  { value: "Quest Diagnostics", label: "Quest Diagnostics" },
  { value: "Labcorp", label: "Labcorp" },
  { value: "Hospital Lab", label: "Hospital Lab" },
  { value: "Urgent Care", label: "Urgent Care" },
  { value: "Medical Clinic", label: "Medical Clinic" },
];

const LAB_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "Open", label: "Open Now" },
  { value: "Closed", label: "Closed" },
];

export function LabCenterFilters({
  radius,
  type,
  status,
  onRadiusChange,
  onTypeChange,
  onStatusChange,
  disabled = false,
}: LabCenterFiltersProps) {
  return (
    <div className='space-y-4 border-b pb-4'>
      {/* Search Radius */}
      <div className='space-y-2'>
        <Label htmlFor='radius' className='text-xs font-semibold'>
          Search Radius: {radius} mi
        </Label>
        <Slider
          id='radius'
          min={5}
          max={100}
          step={5}
          value={[radius]}
          onValueChange={(values) => onRadiusChange(values[0])}
          className='w-full'
          disabled={disabled}
        />
        <div className='flex justify-between text-xs text-muted-foreground'>
          <span>5 mi</span>
          <span>100 mi</span>
        </div>
      </div>

      {/* Lab Type Filter */}
      <div className='space-y-2'>
        <Label htmlFor='type' className='text-xs font-semibold'>
          Lab Type
        </Label>
        <Select value={type} onValueChange={onTypeChange} disabled={disabled}>
          <SelectTrigger id='type' className='h-9 text-sm'>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            {LAB_TYPES.map((labType) => (
              <SelectItem key={labType.value} value={labType.value}>
                {labType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className='space-y-2'>
        <Label htmlFor='status' className='text-xs font-semibold'>
          Status
        </Label>
        <Select
          value={status}
          onValueChange={onStatusChange}
          disabled={disabled}
        >
          <SelectTrigger id='status' className='h-9 text-sm'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {LAB_STATUSES.map((labStatus) => (
              <SelectItem key={labStatus.value} value={labStatus.value}>
                {labStatus.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
