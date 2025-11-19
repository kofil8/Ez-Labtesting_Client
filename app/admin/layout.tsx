import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 lg:ml-56 xl:ml-64 pt-14 sm:pt-16 lg:pt-6 xl:pt-8">
        {children}
      </main>
    </div>
  )
}

