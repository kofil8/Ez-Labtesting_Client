import { TestManagement } from '@/components/admin/TestManagement'

export const metadata = {
  title: 'Test Management | Admin | Kevin Lab Testing',
  description: 'Manage lab tests',
}

export default function AdminTestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Test Management</h1>
      <TestManagement />
    </div>
  )
}

