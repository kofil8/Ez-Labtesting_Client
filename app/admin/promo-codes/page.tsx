import { PromoCodeManagement } from "@/components/admin/PromoCodeManagement";

export const metadata = {
  title: "Promo Code Management | Admin | Ez LabTesting",
  description: "Manage promo codes",
};

export default function AdminPromoCodesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Promo Code Management</h1>
      <PromoCodeManagement />
    </div>
  );
}

