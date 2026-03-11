"use client";

import { useDebounce } from "@/hook/useDebounce";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import { SearchSuggestion } from "@/types/lab-center";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface LabCenterSearchProps {
  onLocationSelect: (
    lat: number,
    lng: number,
    address?: string,
    searchQuery?: string,
  ) => void;
  disabled?: boolean;
}

export function LabCenterSearch({
  onLocationSelect,
  disabled,
}: LabCenterSearchProps) {
  const [address, setAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce address input to fetch suggestions
  const debouncedAddress = useDebounce(address, 300);

  // Fetch suggestions when debounced address changes
  const fetchSuggestions = useCallback(async () => {
    if (!debouncedAddress.trim() || debouncedAddress.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      const results =
        await LabCenterService.getAutocompleteSuggestions(debouncedAddress);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch suggestions";
      toast.error(message);
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, [debouncedAddress]);

  // Call fetchSuggestions when debounced value changes
  useEffect(() => {
    fetchSuggestions();
  }, [debouncedAddress, fetchSuggestions]);

  const handleUseMyLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await LabCenterService.getCurrentLocation();
      onLocationSelect(location.latitude, location.longitude, "Your Location");
      toast.success("Location detected successfully");
      setAddress("");
      setSuggestions([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get location";
      toast.error(message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await LabCenterService.geocodeAddress(address);
      onLocationSelect(
        result.latitude,
        result.longitude,
        result.formattedAddress,
        address,
      );
      toast.success("Address found successfully");
      setAddress("");
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to geocode address";
      toast.error(message);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: SearchSuggestion) => {
    setAddress(suggestion.description);
    setShowSuggestions(false);

    setIsGeocoding(true);
    try {
      const result = await LabCenterService.geocodeAddress(
        suggestion.description,
      );
      onLocationSelect(
        result.latitude,
        result.longitude,
        result.formattedAddress,
        suggestion.description,
      );
      toast.success("Location selected successfully");
      setAddress("");
      setSuggestions([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to select location";
      toast.error(message);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleClear = () => {
    setAddress("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: 8,
          position: "relative",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          {/* Search icon inside input */}
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#9aa0a6",
              display: "flex",
            }}
          >
            <MapPin style={{ width: 18, height: 18 }} />
          </span>

          <input
            type='text'
            placeholder='Search city, state, or zip'
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (e.target.value) setShowSuggestions(true);
            }}
            onFocus={() => address && setShowSuggestions(true)}
            autoComplete='off'
            disabled={disabled || isGeocoding}
            style={{
              width: "100%",
              padding: "9px 32px 9px 36px",
              border: "1px solid #dadce0",
              borderRadius: 24,
              fontSize: 14,
              color: "#202124",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
              background: "#fff",
            }}
            onFocusCapture={(e) => {
              (e.target as HTMLInputElement).style.border = "1px solid #1a73e8";
            }}
            onBlurCapture={(e) => {
              (e.target as HTMLInputElement).style.border = "1px solid #dadce0";
            }}
          />

          {/* Clear button */}
          {address && (
            <button
              type='button'
              onClick={handleClear}
              tabIndex={-1}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9aa0a6",
                padding: 2,
                display: "flex",
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #dadce0",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 100,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type='button'
                  onClick={() => handleSuggestionSelect(suggestion)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px 10px 36px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    borderBottom:
                      idx < suggestions.length - 1
                        ? "1px solid #f1f3f4"
                        : "none",
                    fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#f1f3f4";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "none";
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9aa0a6",
                    }}
                  >
                    <MapPin style={{ width: 15, height: 15 }} />
                  </span>
                  <div
                    style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}
                  >
                    {suggestion.mainText}
                  </div>
                  {suggestion.secondaryText && (
                    <div style={{ fontSize: 12, color: "#70757a" }}>
                      {suggestion.secondaryText}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions loading */}
          {isFetchingSuggestions && showSuggestions && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #dadce0",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 100,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#70757a",
                fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
              }}
            >
              <Loader2
                style={{ width: 15, height: 15 }}
                className='animate-spin'
              />
              Finding suggestions…
            </div>
          )}
        </div>

        <button
          type='submit'
          disabled={disabled || isGeocoding || !address.trim()}
          style={{
            padding: "8px 18px",
            background: isGeocoding || !address.trim() ? "#dadce0" : "#1a73e8",
            color: isGeocoding || !address.trim() ? "#80868b" : "#fff",
            border: "none",
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 500,
            cursor: isGeocoding || !address.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
            whiteSpace: "nowrap",
            flexShrink: 0,
            minWidth: 120,
          }}
          className='md:min-w-auto'
        >
          {isGeocoding ? (
            <Loader2
              style={{ width: 16, height: 16 }}
              className='animate-spin'
            />
          ) : (
            <Search style={{ width: 16, height: 16 }} />
          )}
          <span className='hidden sm:inline'>Search</span>
        </button>
      </form>

      {/* Use My Location */}
      <button
        type='button'
        onClick={handleUseMyLocation}
        disabled={disabled || isGettingLocation}
        style={{
          width: "100%",
          padding: "8px 16px",
          background: "none",
          border: "1px solid #dadce0",
          borderRadius: 24,
          fontSize: 13,
          fontWeight: 500,
          color: "#1a73e8",
          cursor: disabled || isGettingLocation ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
          cursor: disabled || isGettingLocation ? "not-allowed" : "pointer",
          opacity: disabled || isGettingLocation ? 0.5 : 1,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isGettingLocation) {
            (e.currentTarget as HTMLButtonElement).style.background = "#f1f3f4";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "none";
        }}
      >
        {isGettingLocation ? (
          <Loader2 style={{ width: 15, height: 15 }} className='animate-spin' />
        ) : (
          <Navigation style={{ width: 15, height: 15 }} />
        )}
        <span className='hidden sm:inline'>Use My Location</span>
        <span className='inline sm:hidden'>My Location</span>
      </button>
    </div>
  );
}
