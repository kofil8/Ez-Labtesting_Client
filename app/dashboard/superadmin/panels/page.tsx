import { PanelManagement } from "@/components/admin/PanelManagement";

export const metadata = {
  title: "Test Panels | Superadmin Dashboard",
  description: "Manage test panels",
};

export default function PanelsPage() {
  return <PanelManagement />;
}
