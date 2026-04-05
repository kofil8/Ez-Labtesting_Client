"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface OrderConfirmationCardProps {
  orderId: string;
  orderNumber?: string;
  totalAmount: number;
  itemCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  estimatedDelivery?: string;
  accessOrderId?: string;
  requisitionPdfUrl?: string;
  labLocation?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export function OrderConfirmationCard({
  orderId,
  orderNumber,
  totalAmount,
  itemCount,
  customerName,
  customerEmail,
  customerPhone,
  estimatedDelivery,
  accessOrderId,
  requisitionPdfUrl,
  labLocation,
}: OrderConfirmationCardProps) {
  return (
    <div className='space-y-6'>
      {/* Main Confirmation */}
      <Card className='border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/50'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <CheckCircle className='w-8 h-8 text-emerald-600' />
              <div>
                <CardTitle className='text-2xl'>Order Confirmed!</CardTitle>
                <p className='text-sm text-muted-foreground mt-1'>
                  Your lab test order has been successfully placed
                </p>
              </div>
            </div>
            <Badge className='bg-emerald-100 text-emerald-700'>Received</Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Order Details */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Order Number</p>
              <p className='text-lg font-semibold font-mono'>
                {orderNumber || orderId}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Tests Ordered</p>
              <p className='text-lg font-semibold'>{itemCount}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Total Amount</p>
              <p className='text-lg font-semibold text-emerald-600'>
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Status</p>
              <p className='text-lg font-semibold'>Confirmed</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className='bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700'>
            <h3 className='font-semibold mb-4 flex items-center gap-2'>
              <Clock className='w-5 h-5' />
              Next Steps
            </h3>
            <ol className='space-y-3'>
              <li className='flex gap-3'>
                <span className='flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-semibold'>
                  1
                </span>
                <div>
                  <p className='font-medium'>Download Requisition Form</p>
                  <p className='text-sm text-muted-foreground'>
                    You'll need this at the lab collection center
                  </p>
                </div>
              </li>
              <li className='flex gap-3'>
                <span className='flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-semibold'>
                  2
                </span>
                <div>
                  <p className='font-medium'>Find Nearest Lab Center</p>
                  <p className='text-sm text-muted-foreground'>
                    Locate a Patient Service Center near you
                  </p>
                </div>
              </li>
              <li className='flex gap-3'>
                <span className='flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-semibold'>
                  3
                </span>
                <div>
                  <p className='font-medium'>Bring ID and Requisition</p>
                  <p className='text-sm text-muted-foreground'>
                    Visit the lab with photo ID and requisition form
                  </p>
                </div>
              </li>
              <li className='flex gap-3'>
                <span className='flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-semibold'>
                  4
                </span>
                <div>
                  <p className='font-medium'>Receive Results</p>
                  <p className='text-sm text-muted-foreground'>
                    Results typically available in 24-48 hours
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Requisition Download */}
      {requisitionPdfUrl && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='w-5 h-5' />
              Requisition Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground mb-4'>
              Download your lab requisition form to bring to your appointment
            </p>
            <div className='flex gap-3'>
              <Button asChild variant='outline'>
                <a href={requisitionPdfUrl} download target='_blank'>
                  <Download className='w-4 h-4 mr-2' />
                  Download PDF
                </a>
              </Button>
              <Button asChild variant='ghost'>
                <a href={requisitionPdfUrl} target='_blank'>
                  <FileText className='w-4 h-4 mr-2' />
                  View
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lab Location Information */}
      {labLocation && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='w-5 h-5' />
              Collection Center Assigned
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='font-medium'>
                {labLocation.name || "PSC Lab Center"}
              </p>
              <p className='text-sm text-muted-foreground'>
                {labLocation.address}
                {labLocation.city && `, ${labLocation.city}`}
                {labLocation.state && ` ${labLocation.state}`}
                {labLocation.zip && ` ${labLocation.zip}`}
              </p>
            </div>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/find-lab-center'>
                <MapPin className='w-4 h-4 mr-2' />
                View Lab Directions
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Customer Name</p>
              <p className='font-medium'>{customerName}</p>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Email</p>
              <p className='font-medium break-all'>{customerEmail}</p>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Phone</p>
              <p className='font-medium'>{customerPhone}</p>
            </div>
            {accessOrderId && (
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Lab Order ID</p>
                <p className='font-medium font-mono text-sm'>{accessOrderId}</p>
              </div>
            )}
          </div>

          <div className='bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              A confirmation email has been sent to{" "}
              <strong>{customerEmail}</strong>. Check your inbox for more
              details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex gap-3 flex-col sm:flex-row'>
        <Button asChild className='flex-1'>
          <Link href='/results'>
            Track Order
            <ArrowRight className='w-4 h-4 ml-2' />
          </Link>
        </Button>
        <Button asChild variant='outline' className='flex-1'>
          <Link href='/dashboard'>Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
