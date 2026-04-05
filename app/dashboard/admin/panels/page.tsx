import { PanelManagement } from "@/components/admin/PanelManagement";

export const metadata = {
  title: "Panel Management | Admin | Ez LabTesting",
  description: "Manage test panels",
};

export default function AdminPanelsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel Management</h1>
      <PanelManagement />
    </div>
  );
}

