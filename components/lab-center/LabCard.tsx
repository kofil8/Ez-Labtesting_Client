import { LabCenter } from "@/types/lab-center";
import { Globe, Navigation } from "lucide-react";

interface LabCardProps {
  lab: LabCenter;
  onSelect?: (lab: LabCenter) => void;
  isSelected?: boolean;
  showDistance?: boolean;
  onShowDirections?: (lab: LabCenter) => void;
}

export function LabCard({
  lab,
  onSelect,
  isSelected = false,
  showDistance = true,
  onShowDirections,
}: LabCardProps) {
  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShowDirections) {
      onShowDirections(lab);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lab.address)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lab.website) {
      window.open(lab.website, "_blank", "noopener,noreferrer");
    }
  };

  const filledStars = Math.round(lab.rating);

  return (
    <div
      onClick={() => onSelect?.(lab)}
      style={{
        borderBottom: "1px solid #e8eaed",
        padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)",
        cursor: "pointer",
        backgroundColor: isSelected ? "#f8fbff" : "#fff",
        borderLeft: isSelected ? "3px solid #1a73e8" : "3px solid transparent",
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        transition: "background-color 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f1f3f4";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = isSelected
          ? "#f8fbff"
          : "#fff";
      }}
    >
      {/* Name row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: "clamp(13px, 2.5vw, 15px)",
            color: "#202124",
            lineHeight: "1.3",
            margin: 0,
            flex: 1,
            minWidth: 0,
            wordBreak: "break-word",
          }}
        >
          {lab.name}
        </p>
        {showDistance && lab.distance !== undefined && lab.distance > 0 && (
          <span
            style={{
              fontSize: "clamp(11px, 2vw, 12px)",
              color: "#70757a",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            {lab.distance.toFixed(1)} mi
          </span>
        )}
      </div>

      {/* Rating row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 3,
        }}
      >
        <span
          style={{
            fontSize: "clamp(12px, 2vw, 13px)",
            fontWeight: 500,
            color: "#3c4043",
          }}
        >
          {lab.rating.toFixed(1)}
        </span>
        <span style={{ display: "flex", gap: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width='12' height='12' viewBox='0 0 24 24'>
              <path
                d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
                fill={i <= filledStars ? "#FBBC04" : "#e0e0e0"}
              />
            </svg>
          ))}
        </span>
        {lab.reviewCount > 0 && (
          <span
            style={{ fontSize: "clamp(11px, 1.8vw, 12px)", color: "#70757a" }}
          >
            ({lab.reviewCount})
          </span>
        )}
      </div>

      {/* Type · Address */}
      <p
        style={{
          fontSize: "clamp(11px, 1.8vw, 12px)",
          color: "#70757a",
          margin: "0 0 3px 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Medical laboratory · {lab.address}
      </p>

      {/* Status */}
      <p style={{ fontSize: "clamp(11px, 1.8vw, 12px)", margin: "0 0 8px 0" }}>
        <span
          style={{
            color: lab.status === "Open" ? "#137333" : "#c5221f",
            fontWeight: 500,
          }}
        >
          {lab.status === "Open" ? "Open now" : "Closed"}
        </span>
        {lab.phone && (
          <span style={{ color: "#70757a" }}>
            {" "}
            ·{" "}
            <a
              href={`tel:${lab.phone}`}
              onClick={(e) => e.stopPropagation()}
              style={{ color: "#1a73e8", textDecoration: "none" }}
            >
              {lab.phone}
            </a>
          </span>
        )}
      </p>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {lab.website && (
          <button
            onClick={handleWebsite}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              border: "1px solid #dadce0",
              borderRadius: 4,
              background: "#fff",
              color: "#1a73e8",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background-color 0.2s",
              flex: "1 1 auto",
              minWidth: 100,
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f8fbff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#fff";
            }}
          >
            <Globe style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span className='hidden sm:inline'>Website</span>
            <span className='inline sm:hidden'>Web</span>
          </button>
        )}
        <button
          onClick={handleDirections}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            border: "1px solid #dadce0",
            borderRadius: 4,
            background: "#fff",
            color: "#1a73e8",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background-color 0.2s",
            flex: "1 1 auto",
            minWidth: 100,
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#f8fbff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#fff";
          }}
        >
          <Navigation style={{ width: 14, height: 14, flexShrink: 0 }} />
          <span className='hidden sm:inline'>Directions</span>
          <span className='inline sm:hidden'>Dir</span>
        </button>
      </div>
    </div>
  );
}
