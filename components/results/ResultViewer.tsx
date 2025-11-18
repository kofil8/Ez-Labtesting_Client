"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Result } from "@/types/result";
import { Order } from "@/types/order";
import { downloadResultPDF } from "@/lib/pdf-generator";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface ResultViewerProps {
  results: Result[];
  order: Order;
}

export function ResultViewer({ results, order }: ResultViewerProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (result: Result) => {
    setIsDownloading(result.id);
    try {
      const patientName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;
      await downloadResultPDF(result, {
        patientName,
        dateOfBirth: order.customerInfo.dateOfBirth,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case "low":
        return <TrendingDown className='h-4 w-4 text-blue-500' />;
      case "high":
        return <TrendingUp className='h-4 w-4 text-orange-500' />;
      case "critical":
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className='bg-green-500'>Normal</Badge>;
      case "low":
        return <Badge className='bg-blue-500'>Low</Badge>;
      case "high":
        return <Badge className='bg-orange-500'>High</Badge>;
      case "critical":
        return <Badge variant='destructive'>Critical</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  // Check if any results are pending
  const hasPendingResults = results.some((r) => r.status === "pending");

  if (results.every((r) => r.status === "pending")) {
    return (
      <Card>
        <CardContent className='pt-6 pb-6 text-center'>
          <AlertCircle className='h-16 w-16 mx-auto text-muted-foreground mb-4' />
          <h2 className='text-2xl font-semibold mb-2'>Results Pending</h2>
          <p className='text-muted-foreground'>
            Your results are not yet available. We&apos;ll notify you when
            they&apos;re ready.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4'>
            <div>
              <CardTitle className='text-xl sm:text-2xl mb-2'>
                Test Results - Order #{order.id}
              </CardTitle>
              <p className='text-sm sm:text-base text-muted-foreground'>
                Patient: {order.customerInfo.firstName}{" "}
                {order.customerInfo.lastName}
              </p>
              <p className='text-sm text-muted-foreground'>
                Date of Birth: {new Date(order.customerInfo.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Individual Test Results */}
      {results.map((result) => (
        <div key={result.id} className='space-y-4'>
          {/* Test Header */}
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
                <div className='flex-1'>
                  <CardTitle className='text-lg sm:text-xl'>
                    {result.testName}
                  </CardTitle>
                  {result.completedAt && (
                    <p className='text-sm sm:text-base text-muted-foreground mt-2'>
                      Completed on {formatDate(result.completedAt)}
                    </p>
                  )}
                  {result.status === "pending" && (
                    <Badge variant="secondary" className="mt-2">
                      Results Pending
                    </Badge>
                  )}
                </div>
                {result.status === "completed" && (
                  <Button
                    onClick={() => handleDownload(result)}
                    disabled={isDownloading === result.id}
                    className='w-full sm:w-auto'
                  >
                    {isDownloading === result.id ? (
                      <>
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className='h-4 w-4 mr-2' />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {result.status === "completed" && (
            <>
              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base sm:text-lg'>
                    Biomarker Results
                  </CardTitle>
                </CardHeader>
                <CardContent className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='text-xs sm:text-sm'>
                          Biomarker
                        </TableHead>
                        <TableHead className='text-xs sm:text-sm'>
                          Your Result
                        </TableHead>
                        <TableHead className='text-xs sm:text-sm hidden md:table-cell'>
                          Reference Range
                        </TableHead>
                        <TableHead className='text-xs sm:text-sm'>
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.biomarkers.map((biomarker, index) => (
                        <TableRow key={index}>
                          <TableCell className='font-medium text-xs sm:text-sm'>
                            {biomarker.name}
                          </TableCell>
                          <TableCell className='text-xs sm:text-sm'>
                            <div className='flex items-center'>
                              {getStatusIcon(biomarker.status)}
                              <span className='ml-2'>
                                {biomarker.value} {biomarker.unit}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='text-muted-foreground text-xs sm:text-sm hidden md:table-cell'>
                            {biomarker.referenceRange} {biomarker.unit}
                          </TableCell>
                          <TableCell className='text-xs sm:text-sm'>
                            {getStatusBadge(biomarker.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Interpretation */}
              {result.interpretation && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base sm:text-lg'>
                      Clinical Interpretation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      {result.interpretation}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ))}

      {/* Disclaimer */}
      <Card className='border-orange-200 bg-orange-50'>
        <CardContent className='pt-6'>
          <div className='flex gap-3'>
            <AlertCircle className='h-5 w-5 text-orange-500 shrink-0 mt-0.5' />
            <div className='text-sm'>
              <p className='font-semibold text-orange-900 mb-1'>
                Important Notice
              </p>
              <p className='text-orange-800'>
                These results are for informational purposes only and should not
                be used for self-diagnosis. Please consult with a healthcare
                provider to discuss your results and any necessary follow-up
                care.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
