import { LabCenter } from "@/types/lab-center";
import { Globe, Navigation, Star } from "lucide-react";

interface LabInfoWindowProps {
  lab: LabCenter;
  onClose?: () => void;
  onShowDirections?: () => void;
  showDirectionsButton?: boolean;
}

/**
 * Compact Google Maps-style info popup on the map.
 * Shows: name, rating, type, status, address, Get Directions button.
 */
export function LabInfoWindow({
  lab,
  onClose,
  onShowDirections,
  showDirectionsButton = false,
}: LabInfoWindowProps) {
  const handleDirections = () => {
    if (onShowDirections) {
      onShowDirections();
    } else {
      // Fallback to Google Maps web
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lab.address)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenInGoogleMaps = () => {
    const query = encodeURIComponent(`${lab.name} ${lab.address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const ratingFull = Math.floor(lab.rating);
  const hasHalf = lab.rating - ratingFull >= 0.5;

  return (
    <div
      style={{
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        width: 280,
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 7px 1px rgba(0,0,0,0.3)",
        padding: 0,
      }}
    >
      {/* Lab name */}
      <div style={{ padding: "12px 14px 8px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: "#202124",
            lineHeight: 1.3,
          }}
        >
          {lab.name}
        </p>

        {/* Rating row */}
        {lab.rating > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>
              {lab.rating.toFixed(1)}
            </span>
            <div style={{ display: "flex", gap: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  style={{
                    width: 13,
                    height: 13,
                    fill:
                      i <= ratingFull
                        ? "#FBBC04"
                        : i === ratingFull + 1 && hasHalf
                          ? "#FBBC04"
                          : "#dadce0",
                    color:
                      i <= ratingFull
                        ? "#FBBC04"
                        : i === ratingFull + 1 && hasHalf
                          ? "#FBBC04"
                          : "#dadce0",
                  }}
                />
              ))}
            </div>
            {lab.reviewCount > 0 && (
              <span style={{ fontSize: 12, color: "#70757a" }}>
                ({lab.reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Type */}
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#70757a" }}>
          Medical laboratory
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#e8eaed", margin: "0 14px" }} />

      {/* Status + Address */}
      <div style={{ padding: "8px 14px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: lab.status === "Open" ? "#137333" : "#c5221f",
          }}
        >
          {lab.status === "Open" ? "Open Now" : "Closed"}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 12,
            color: "#70757a",
            lineHeight: 1.4,
          }}
        >
          {lab.address}
        </p>
      </div>

      {/* Actions */}
      <div style={{ padding: "4px 14px 12px", display: "flex", gap: 8 }}>
        <button
          onClick={handleDirections}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Navigation style={{ width: 14, height: 14 }} />
          {showDirectionsButton ? "Show Directions" : "Get Directions"}
        </button>

        <button
          onClick={handleOpenInGoogleMaps}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "#fff",
            color: "#1a73e8",
            border: "1px solid #dadce0",
            borderRadius: 4,
            padding: "8px 10px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          title='Open in Google Maps'
        >
          <Globe style={{ width: 14, height: 14 }} />
          Open
        </button>
      </div>
    </div>
  );
}
