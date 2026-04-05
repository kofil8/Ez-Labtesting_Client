"use client";

import { LabCenter } from "@/types/lab-center";
import { MapPin } from "lucide-react";
import { LabCard } from "./LabCard";
import { LabListSkeleton } from "./LabCardSkeleton";

interface LabCenterListProps {
  labCenters: LabCenter[];
  isLoading?: boolean;
  onSelectLabCenter?: (labCenter: LabCenter) => void;
  selectedLabId?: string;
  onShowDirections?: (labCenter: LabCenter) => void;
}

export function LabCenterList({
  labCenters,
  isLoading = false,
  onSelectLabCenter,
  selectedLabId,
  onShowDirections,
}: LabCenterListProps) {
  // Show skeleton loaders while fetching
  if (isLoading) {
    return <LabListSkeleton count={8} />;
  }

  // Show empty state
  if (labCenters.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
        <MapPin className='h-12 w-12 text-muted-foreground mb-4' />
        <h3 className='text-lg font-semibold mb-2'>No Lab Centers Found</h3>
        <p className='text-sm text-muted-foreground max-w-xs'>
          Try adjusting your search criteria or increasing the search radius to
          find more lab centers.
        </p>
      </div>
    );
  }

  return (
    <div className='divide-y'>
      {labCenters.map((lab) => (
        <LabCard
          key={lab.id}
          lab={lab}
          onSelect={onSelectLabCenter}
          isSelected={selectedLabId === lab.id}
          showDistance={true}
          onShowDirections={onShowDirections}
        />
      ))}
    </div>
  );
}
