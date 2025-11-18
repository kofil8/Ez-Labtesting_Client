# Lab Center Finder Components

This directory contains components for the lab center finder feature, which allows users to search for and locate lab testing centers using Google Maps.

## Components

### LabCenterMap
A Google Maps component that displays lab centers as interactive markers on a map.

**Features:**
- Interactive markers with hover effects
- **Lab name labels** that appear on hover
- Smooth color transitions (blue → purple)
- Info windows showing lab details
- Links to directions and website
- Customizable center and zoom level
- No duplicate APIProvider (expects to be wrapped by parent)

**Props:**
- `labCenters` (LabCenter[]): Array of lab centers to display
- `center` (optional): Map center coordinates { lat, lng }
- `zoom` (optional): Initial zoom level (default: 11)

### LabCenterList
A list view of lab centers with detailed information cards.

**Features:**
- Responsive card layout
- Rating and review display
- Contact information
- Action buttons for website and directions
- Empty state handling

**Props:**
- `labCenters` (LabCenter[]): Array of lab centers to display
- `onLabSelect` (optional): Callback when a lab is clicked

### LabCenterSearch
A search component for finding lab centers by location with Google Places Autocomplete.

**Features:**
- **Google Places Autocomplete** - Real-time location suggestions as you type
- Text-based location search with coordinates
- Geolocation "Use My Location" button
- Quick search suggestions
- Toast notifications
- Auto-cleanup of autocomplete listeners

**Props:**
- `onSearch` (required): Callback with search query and optional coordinates `(location: string, coordinates?: { lat: number; lng: number }) => void`
- `onLocateMe` (optional): Callback when user requests current location

## Usage

```tsx
import { APIProvider } from "@vis.gl/react-google-maps";
import { LabCenterMap, LabCenterList, LabCenterSearch } from "@/components/lab-center";
import labCentersData from "@/data/lab-centers.json";

function MyPage() {
  const [labCenters, setLabCenters] = useState(labCentersData);
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const handleSearch = (location: string, coordinates?: { lat: number; lng: number }) => {
    console.log("Search:", location, coordinates);
    // Update map center if coordinates provided
    if (coordinates) {
      // Center map on coordinates
    }
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <LabCenterSearch 
        onSearch={handleSearch}
        onLocateMe={() => console.log("Getting location...")}
      />
      
      <LabCenterMap 
        labCenters={labCenters}
        center={{ lat: 36.1699, lng: -115.1398 }}
      />
      
      <LabCenterList 
        labCenters={labCenters}
        onLabSelect={(lab) => console.log("Selected:", lab)}
      />
    </APIProvider>
  );
}
```

**Important**: The entire page must be wrapped with `APIProvider` for the map and autocomplete to work.

## Data Structure

Lab centers are defined using the `LabCenter` interface:

```typescript
interface LabCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  type: string;
  hours: string;
  status: "Open" | "Closed";
  location: {
    lat: number;
    lng: number;
  };
  website?: string;
}
```

## Google Maps Setup

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Enable these APIs:
   - **Maps JavaScript API** (Required - for map display)
   - **Places API** (Required - for autocomplete search)
   - Geocoding API (Optional - for future geocoding features)
3. Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`
4. Restart your development server

See `GOOGLE_MAPS_SETUP.md` in the project root for detailed instructions.

## Sample Data

Sample lab center data is available in `/data/lab-centers.json`. This includes several lab centers in the Las Vegas, NV area.

