import { PromoCodeManagement } from "@/components/admin/PromoCodeManagement";

export const metadata = {
  title: "Promo Codes | Superadmin Dashboard",
  description: "Manage promotional codes",
};

export default function PromoCodesPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Promo Codes</h1>
        <p className='text-muted-foreground mt-2'>
          Manage all promotional codes
        </p>
      </div>
      <PromoCodeManagement />
    </div>
  );
}
