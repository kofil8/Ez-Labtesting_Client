"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Locate, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LabCenterSearchProps {
  onSearch: (
    location: string,
    coordinates?: { lat: number; lng: number }
  ) => void;
  onLocateMe?: () => void;
  onRadiusChange?: (radius: number) => void;
  radius?: number;
}

export function LabCenterSearch({
  onSearch,
  onLocateMe,
  onRadiusChange,
  radius = 25,
}: LabCenterSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      fields: ["geometry", "name", "formatted_address"],
      types: ["geocode", "establishment"],
    };

    const autocompleteInstance = new placesLibrary.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();

      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        const address = place.formatted_address || place.name || "";
        setSearchQuery(address);
        onSearch(address, location);

        toast({
          title: "Location found",
          description: `Searching near ${address}`,
        });
      }
    });

    setAutocomplete(autocompleteInstance);

    return () => {
      // Cleanup
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [placesLibrary, onSearch, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLocateMe = async () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLocating(false);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchQuery(`${latitude}, ${longitude}`);
          onLocateMe?.();
          setIsLocating(false);
          toast({
            title: "Location found",
            description: "Showing lab centers near you.",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location access denied",
            description: "Please allow location access to use this feature.",
            variant: "destructive",
          });
          setIsLocating(false);
        }
      );
    } catch (error) {
      console.error("Error getting location:", error);
      setIsLocating(false);
      toast({
        title: "Error",
        description: "Failed to get your location.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full space-y-4'
    >
      <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 dark:text-blue-400 z-10' />
          <Input
            ref={inputRef}
            type='text'
            placeholder='Enter city, state, or ZIP code (e.g., Las Vegas, NV 89101)'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-11 h-14 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm'
            autoComplete='off'
          />
        </div>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            size='lg'
            onClick={handleLocateMe}
            disabled={isLocating}
            className='group h-14 px-4 sm:px-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 [&_svg]:!size-5'
          >
            <Locate
              className={`flex-shrink-0 text-gray-700 dark:text-gray-300 ${
                isLocating ? "animate-spin" : ""
              }`}
            />
            <span className='inline-block max-w-0 overflow-hidden group-hover:max-w-[200px] group-hover:ml-2 whitespace-nowrap transition-all duration-300'>
              Use My Location
            </span>
          </Button>
          <Button
            type='submit'
            size='lg'
            className='h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all'
          >
            <Search className='h-5 w-5 flex-shrink-0' />
            <span className='hidden sm:inline ml-2'>Search</span>
          </Button>
          <Button
            type='button'
            variant='outline'
            size='lg'
            onClick={() => setShowFilters(!showFilters)}
            className='group h-14 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 [&_svg]:!size-5'
          >
            <SlidersHorizontal className='flex-shrink-0 text-gray-700 dark:text-gray-300' />
            <span className='inline-block max-w-0 overflow-hidden group-hover:max-w-[100px] group-hover:ml-2 whitespace-nowrap transition-all duration-300'>
              Filters
            </span>
          </Button>
        </div>
      </form>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 shadow-sm'
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                Search Filters
              </h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowFilters(false)}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <label className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
                  Search Radius
                </label>
                <Select
                  value={radius.toString()}
                  onValueChange={(value) => {
                    onRadiusChange?.(Number(value));
                  }}
                >
                  <SelectTrigger className='w-full bg-white dark:bg-gray-900'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5 miles</SelectItem>
                    <SelectItem value='10'>10 miles</SelectItem>
                    <SelectItem value='25'>25 miles</SelectItem>
                    <SelectItem value='50'>50 miles</SelectItem>
                    <SelectItem value='100'>100 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      <div className='flex flex-wrap items-center gap-2 pt-2'>
        <p className='text-sm font-medium text-blue-100 dark:text-blue-300'>
          Popular searches:
        </p>
        {["Las Vegas, NV", "Henderson, NV", "North Las Vegas, NV"].map(
          (location) => (
            <Button
              key={location}
              variant='ghost'
              size='sm'
              onClick={() => {
                setSearchQuery(location);
                onSearch(location);
              }}
              className='text-blue-100 dark:text-blue-300 hover:text-white dark:hover:text-blue-100 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 h-8 px-3'
            >
              {location}
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
}
