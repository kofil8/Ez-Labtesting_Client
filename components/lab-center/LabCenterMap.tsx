"use client";

import { Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { LabCenter } from "@/types/lab-center";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Globe, Navigation } from "lucide-react";
import { calculateDistance, formatDistance } from "@/lib/distance";

interface LabCenterMapProps {
  labCenters: LabCenter[];
  center?: { lat: number; lng: number };
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
}

export function LabCenterMap({ labCenters, center, zoom = 11, userLocation }: LabCenterMapProps) {
  const [selectedLab, setSelectedLab] = useState<LabCenter | null>(null);
  const [hoveredLab, setHoveredLab] = useState<string | null>(null);

  // Use provided center or default to Las Vegas
  const mapCenter = center || { lat: 36.1699, lng: -115.1398 };

  // Calculate distances for selected lab
  const getDistance = (lab: LabCenter): number | null => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      lab.location.lat,
      lab.location.lng
    );
  };

  return (
    <div className="w-full h-full relative">
      <Map
        mapId="lab-center-map"
        defaultCenter={mapCenter}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full rounded-lg"
      >
        {labCenters.map((lab) => (
          <AdvancedMarker
            key={lab.id}
            position={lab.location}
            onClick={() => setSelectedLab(lab)}
            onMouseEnter={() => setHoveredLab(lab.id)}
            onMouseLeave={() => setHoveredLab(null)}
          >
            <div className="relative flex flex-col items-center">
              <Pin
                background={hoveredLab === lab.id ? "#8b5cf6" : "#3b82f6"}
                borderColor={hoveredLab === lab.id ? "#6d28d9" : "#2563eb"}
                glyphColor="#ffffff"
                scale={hoveredLab === lab.id ? 1.2 : 1}
              />
              {/* Lab name label */}
              <div 
                className="absolute top-full mt-1 px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap text-xs font-semibold z-10"
                style={{
                  opacity: hoveredLab === lab.id ? 1 : 0,
                  transition: "opacity 0.2s",
                  pointerEvents: "none"
                }}
              >
                {lab.name}
              </div>
            </div>
          </AdvancedMarker>
        ))}

          {selectedLab && (
            <InfoWindow
              position={selectedLab.location}
              onCloseClick={() => setSelectedLab(null)}
            >
              <div className="p-2 sm:p-3 max-w-[280px] sm:max-w-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 pr-2 break-words">{selectedLab.name}</h3>
                  {getDistance(selectedLab) !== null && (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold whitespace-nowrap text-xs sm:text-sm flex-shrink-0">
                      {formatDistance(getDistance(selectedLab)!)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100">{selectedLab.rating}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
                    ({selectedLab.reviewCount} reviews)
                  </span>
                  <Badge
                    variant={selectedLab.status === "Open" ? "default" : "secondary"}
                    className={`text-[10px] sm:text-xs ${
                      selectedLab.status === "Open" 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {selectedLab.status}
                  </Badge>
                </div>

                <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm mb-2 sm:mb-3">
                  <div className="flex items-start gap-1.5 sm:gap-2 bg-gray-50 dark:bg-gray-800/50 rounded p-1.5 sm:p-2">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-[11px] sm:text-sm break-words">{selectedLab.address}</span>
                  </div>

                  {selectedLab.phone && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <a
                        href={`tel:${selectedLab.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px] sm:text-sm"
                      >
                        {selectedLab.phone}
                      </a>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 pt-1 text-[11px] sm:text-sm">
                    {selectedLab.hours}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-gray-200 dark:border-gray-700">
                  {selectedLab.website && (
                    <Button size="sm" variant="outline" asChild className="flex-1 border-2 text-xs sm:text-sm h-8 sm:h-9">
                      <a
                        href={selectedLab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        Website
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="default" asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLab.location.lat},${selectedLab.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Directions
                    </a>
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
      </Map>
    </div>
  );
}

