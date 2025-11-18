"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LabCenterMap } from "@/components/lab-center/LabCenterMap";
import { LabCenterList } from "@/components/lab-center/LabCenterList";
import { LabCenterSearch } from "@/components/lab-center/LabCenterSearch";
import { LabCenter } from "@/types/lab-center";
import { Button } from "@/components/ui/button";
import { Map, List, TestTube2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { APIProvider } from "@vis.gl/react-google-maps";
import labCentersData from "@/data/lab-centers.json";
import { calculateDistance } from "@/lib/distance";

export default function FindLabCenterPage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [labCenters] = useState<LabCenter[]>(labCentersData as LabCenter[]);
  const [filteredLabCenters, setFilteredLabCenters] = useState<LabCenter[]>(labCentersData as LabCenter[]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 36.1699, lng: -115.1398 });
  const [selectedLab, setSelectedLab] = useState<LabCenter | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(25);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">("distance");
  const { toast } = useToast();

  // Auto-request user location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setMapCenter(location);
          toast({
            title: "Location found",
            description: "Showing lab centers near you.",
          });
        },
        (error) => {
          console.log("User declined location or error:", error);
          // Silently fail - user can still search manually
        },
        { timeout: 10000 }
      );
    }
  }, [toast]);

  const handleSearch = (location: string, coordinates?: { lat: number; lng: number }) => {
    console.log("Searching for:", location);
    if (coordinates) {
      setMapCenter(coordinates);
      setUserLocation(coordinates);
      // Filter labs by distance from coordinates
      const filtered = labCenters.filter((lab) => {
        const distance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          lab.location.lat,
          lab.location.lng
        );
        return distance <= searchRadius;
      });
      setFilteredLabCenters(filtered);
    } else {
      setFilteredLabCenters(labCenters);
    }
  };

  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
    if (userLocation) {
      const filtered = labCenters.filter((lab) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lab.location.lat,
          lab.location.lng
        );
        return distance <= radius;
      });
      setFilteredLabCenters(filtered);
    }
  };

  const handleLocateMe = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleLabSelect = (lab: LabCenter) => {
    setSelectedLab(lab);
    setMapCenter(lab.location);
    setViewMode("map");
    // Scroll to map
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <TestTube2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Configuration Required</h1>
            <p className="text-gray-600 mb-4">
              Please add your Google Maps API key to .env.local to use this feature.
            </p>
            <p className="text-sm text-gray-500">
              See GOOGLE_MAPS_SETUP.md for instructions.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 sm:mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <TestTube2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
                    Find a Lab Center
                  </h1>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4">
                  Locate convenient lab testing centers near you. Get directions, hours, and contact information.
                </p>
              </motion.div>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <LabCenterSearch 
                  onSearch={handleSearch} 
                  onLocateMe={handleLocateMe}
                  onRadiusChange={handleRadiusChange}
                  radius={searchRadius}
                />
              </div>
            </div>
          </div>

        {/* View Toggle */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredLabCenters.length} Lab Center{filteredLabCenters.length !== 1 ? "s" : ""} Found
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {userLocation 
                  ? `Within ${searchRadius} miles of your location` 
                  : "Choose your preferred testing location"}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={`flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  viewMode === "map" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "border-2"
                }`}
              >
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map View</span>
                <span className="sm:hidden">Map</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  viewMode === "list" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "border-2"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List View</span>
                <span className="sm:hidden">List</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
          {viewMode === "map" ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 sm:border-2 relative z-0"
            >
              <LabCenterMap 
                labCenters={filteredLabCenters} 
                center={mapCenter}
                zoom={selectedLab ? 14 : 11}
                userLocation={userLocation}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LabCenterList 
                labCenters={filteredLabCenters} 
                onLabSelect={handleLabSelect}
                userLocation={userLocation}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  How It Works
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
                  Find and visit a lab center in three simple steps
                </p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center text-gray-900 dark:text-gray-100">Search Location</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    Enter your city, ZIP code, or use your current location to find nearby labs within your preferred radius.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center text-gray-900 dark:text-gray-100">Choose a Lab</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    Compare ratings, hours, distances, and locations to find the most convenient lab center for your needs.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 dark:border-gray-700 sm:col-span-2 lg:col-span-1"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center text-gray-900 dark:text-gray-100">Get Tested</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    Visit the lab with your order confirmation to complete your testing. Get directions with one click!
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        </main>
        <SiteFooter />
      </div>
    </APIProvider>
  );
}

