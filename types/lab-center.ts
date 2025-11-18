export interface LabCenter {
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

