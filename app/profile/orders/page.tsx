import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { ResultsList } from "@/components/results/ResultsList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProfileOrdersPage() {
  return (
    <main className='w-full bg-white'>
      <div className='mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
        <div className='mb-6 flex items-center gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link href='/profile' className='flex items-center gap-1'>
              <ChevronLeft className='w-4 h-4' />
              Back to Profile
            </Link>
          </Button>
        </div>

        <div className='grid gap-6 md:grid-cols-4'>
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className='md:col-span-3'>
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Orders</h1>
                <p className='mt-2 text-slate-600'>
                  View and manage all your lab test orders
                </p>
              </div>

              {/* Results List */}
              <ResultsList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
