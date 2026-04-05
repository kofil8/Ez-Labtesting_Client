import { LabPartnerSidebar } from "@/components/lab-partner/LabPartnerSidebar";

export default function LabPartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <LabPartnerSidebar />
      <main
        id='main-content-section'
        className='flex-1 p-3 pt-14 sm:p-4 sm:pt-16 md:p-6 lg:p-8 lg:ml-56 lg:pt-6 xl:ml-64 xl:pt-8'
      >
        {children}
      </main>
    </div>
  );
}
