import { LabCenter } from "@/types/lab-center";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";

interface LabMarkerProps {
  lab: LabCenter;
  isSelected?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

/**
 * Classic Google Maps-style teardrop pin marker
 * Red = normal, Blue = selected
 */
export const LabMarker = React.forwardRef<any, LabMarkerProps>(
  ({ lab, isSelected = false, isOpen = true, onClick }, ref) => {
    const pinColor = isSelected ? "#1a73e8" : "#EA4335";
    const shadowColor = isSelected
      ? "rgba(26,115,232,0.4)"
      : "rgba(234,67,53,0.4)";

    return (
      <AdvancedMarker
        ref={ref}
        position={{ lat: lab.latitude, lng: lab.longitude }}
        onClick={onClick}
        title={lab.name}
        zIndex={isSelected ? 200 : 100}
      >
        {/* Classic Google teardrop pin shape */}
        <div
          style={{
            filter: isSelected
              ? `drop-shadow(0 4px 8px ${shadowColor})`
              : `drop-shadow(0 2px 4px ${shadowColor})`,
            transform: isSelected ? "scale(1.3)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
        >
          <svg
            width='28'
            height='40'
            viewBox='0 0 28 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ display: "block" }}
          >
            {/* Teardrop body */}
            <path
              d='M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z'
              fill={pinColor}
            />
            {/* Inner white circle */}
            <circle cx='14' cy='14' r='6' fill='white' />
          </svg>
        </div>
      </AdvancedMarker>
    );
  },
);

LabMarker.displayName = "LabMarker";
