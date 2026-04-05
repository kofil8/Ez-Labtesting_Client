"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Download,
  FileText,
  MapPin,
  Phone,
  Printer,
  Share2,
} from "lucide-react";
import Link from "next/link";

export interface RequisitionInfo {
  orderId: string;
  orderNumber: string;
  requisitionId?: string;
  pdfUrl?: string;
  generatedDate: string;
  expiryDate?: string;
  testsCount: number;
  testsList?: string[];
  patientName: string;
  patientDOB?: string;
  labLocation?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
    hours?: string;
  };
}

interface RequisitionDownloaderProps {
  requisition: RequisitionInfo;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function RequisitionDownloader({
  requisition,
  onDownload,
  onPrint,
}: RequisitionDownloaderProps) {
  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handlePrint = () => {
    if (requisition.pdfUrl) {
      window.open(requisition.pdfUrl, "_blank");
    }
    onPrint?.();
  };

  const handleShare = async () => {
    if (canShare && requisition.pdfUrl) {
      try {
        await navigator.share({
          title: "Lab Test Requisition",
          text: `Lab test requisition for order ${requisition.orderNumber}`,
          url: requisition.pdfUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* Main Requisition Card */}
      <Card className='border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/50'>
        <CardHeader>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                <FileText className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <CardTitle className='text-lg'>Lab Requisition Form</CardTitle>
                <p className='text-sm text-muted-foreground mt-1'>
                  Bring this to your lab appointment
                </p>
              </div>
            </div>
            <Badge className='bg-purple-100 text-purple-700'>Required</Badge>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Key Information */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>Order Number</p>
              <p className='font-mono text-sm font-semibold'>
                {requisition.orderNumber}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>Requisition ID</p>
              <p className='font-mono text-sm font-semibold'>
                {requisition.requisitionId || "Auto-assigned"}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>Tests</p>
              <p className='text-sm font-semibold'>{requisition.testsCount}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>Generated</p>
              <p className='text-sm font-semibold'>
                {requisition.generatedDate}
              </p>
            </div>
          </div>

          {/* Download Actions */}
          {requisition.pdfUrl && (
            <div className='flex gap-2 flex-col sm:flex-row'>
              <Button asChild className='flex-1'>
                <a
                  href={requisition.pdfUrl}
                  download={`requisition-${requisition.orderNumber}.pdf`}
                  onClick={onDownload}
                >
                  <Download className='w-4 h-4 mr-2' />
                  Download PDF
                </a>
              </Button>
              <Button
                variant='outline'
                onClick={handlePrint}
                className='flex-1'
              >
                <Printer className='w-4 h-4 mr-2' />
                Print
              </Button>
              {canShare && (
                <Button
                  variant='outline'
                  onClick={handleShare}
                  className='flex-1'
                >
                  <Share2 className='w-4 h-4 mr-2' />
                  Share
                </Button>
              )}
            </div>
          )}

          {/* Important Information */}
          <div className='bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-900 space-y-2'>
            <p className='text-sm font-semibold text-amber-900 dark:text-amber-200'>
              ⚠️ Important: Bring to Your Appointment
            </p>
            <ul className='text-xs text-amber-800 dark:text-amber-300 space-y-1'>
              <li>• Print or show on your mobile device</li>
              <li>
                • Bring a valid photo ID{" "}
                {requisition.expiryDate &&
                  `(valid until ${requisition.expiryDate})`}
              </li>
              <li>• Visit the assigned lab location below</li>
              <li>• Collection is typically 5-15 minutes</li>
            </ul>
          </div>

          {/* Tests List */}
          {requisition.testsList && requisition.testsList.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm font-semibold'>Tests Ordered</p>
              <ul className='space-y-1'>
                {requisition.testsList.map((test, idx) => (
                  <li
                    key={idx}
                    className='text-sm text-muted-foreground flex items-center gap-2'
                  >
                    <span className='w-1.5 h-1.5 bg-purple-400 rounded-full' />
                    {test}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lab Location Information */}
      {requisition.labLocation && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='w-5 h-5' />
              Collection Center
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Location Details */}
            <div className='space-y-3'>
              <div>
                <p className='font-semibold text-lg'>
                  {requisition.labLocation.name}
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {requisition.labLocation.address}
                  <br />
                  {requisition.labLocation.city},{" "}
                  {requisition.labLocation.state} {requisition.labLocation.zip}
                </p>
              </div>

              {/* Contact Information */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {requisition.labLocation.phone && (
                  <Button variant='outline' asChild className='w-full'>
                    <a href={`tel:${requisition.labLocation.phone}`}>
                      <Phone className='w-4 h-4 mr-2' />
                      {requisition.labLocation.phone}
                    </a>
                  </Button>
                )}
                <Button asChild variant='outline' className='w-full'>
                  <Link href='/find-lab-center'>
                    <MapPin className='w-4 h-4 mr-2' />
                    View Directions
                  </Link>
                </Button>
              </div>

              {/* Hours of Operation */}
              {requisition.labLocation.hours && (
                <div className='bg-slate-50 dark:bg-slate-800 p-3 rounded text-sm'>
                  <p className='font-medium text-slate-700 dark:text-slate-300'>
                    Hours
                  </p>
                  <p className='text-slate-600 dark:text-slate-400 mt-1'>
                    {requisition.labLocation.hours}
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className='bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-900 space-y-2'>
              <p className='text-sm font-semibold text-green-900 dark:text-green-200'>
                Next Steps
              </p>
              <ol className='text-xs text-green-800 dark:text-green-300 space-y-1'>
                <li>1. Download and print this requisition</li>
                <li>2. Bring photo ID and requisition to the lab</li>
                <li>3. Check in at the front desk</li>
                <li>4. Follow collection instructions from staff</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference Card */}
      <Card className='bg-slate-50 dark:bg-slate-800'>
        <CardHeader>
          <CardTitle className='text-base flex items-center gap-2'>
            <Calendar className='w-4 h-4' />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Generated Date:</span>
            <span className='font-medium'>{requisition.generatedDate}</span>
          </div>
          {requisition.expiryDate && (
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Valid Until:</span>
              <span className='font-medium'>{requisition.expiryDate}</span>
            </div>
          )}
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Expected Results:</span>
            <span className='font-medium'>24-48 hours</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
