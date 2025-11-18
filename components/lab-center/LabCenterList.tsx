"use client";

import { LabCenter } from "@/types/lab-center";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Globe, Navigation, Clock, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistance, calculateDistance } from "@/lib/distance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LabCenterListProps {
  labCenters: LabCenter[];
  onLabSelect?: (lab: LabCenter) => void;
  userLocation?: { lat: number; lng: number } | null;
  sortBy?: "distance" | "rating" | "name";
  onSortChange?: (sort: "distance" | "rating" | "name") => void;
}

export function LabCenterList({ 
  labCenters, 
  onLabSelect, 
  userLocation,
  sortBy = "distance",
  onSortChange 
}: LabCenterListProps) {
  // Calculate distances if user location is available
  const labsWithDistance = labCenters.map((lab) => {
    let distance: number | null = null;
    if (userLocation) {
      distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        lab.location.lat,
        lab.location.lng
      );
    }
    return { ...lab, distance };
  });

  // Sort labs
  const sortedLabs = [...labsWithDistance].sort((a, b) => {
    if (sortBy === "distance") {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {sortedLabs.length} Lab Center{sortedLabs.length !== 1 ? "s" : ""} Found
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {userLocation ? "Sorted by distance from your location" : "Select a location to see distances"}
          </p>
        </div>
        {onSortChange && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as "distance" | "rating" | "name")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Sort by Distance</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Lab Centers List */}
      <div className="space-y-4">
        {sortedLabs.map((lab, index) => (
        <motion.div
          key={lab.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-600 group" onClick={() => onLabSelect?.(lab)}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header with Distance */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lab.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lab.type}</p>
                    </div>
                    {lab.distance !== null && (
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold">
                        {formatDistance(lab.distance)}
                      </Badge>
                    )}
                  </div>

                  {/* Rating and Status */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {lab.rating}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({lab.reviewCount} reviews)
                      </span>
                    </div>
                    <Badge
                      variant={lab.status === "Open" ? "default" : "secondary"}
                      className={`${
                        lab.status === "Open" 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {lab.status}
                    </Badge>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lab.address}</span>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lab.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <a
                          href={`tel:${lab.phone}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lab.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{lab.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
                  {lab.website && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 sm:flex-none border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={lab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Website</span>
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="default"
                    asChild
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lab.location.lat},${lab.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Directions</span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      </div>

      {labCenters.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Lab Centers Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search location or radius.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

