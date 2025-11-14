"use client";

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
import {
  AlertCircle,
  CheckCircle,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface ResultViewerProps {
  result: Result;
}

export function ResultViewer({ result }: ResultViewerProps) {
  const handleDownload = () => {
    // Mock PDF download
    alert("In a real app, this would download the PDF report");
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

  if (result.status === "pending") {
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
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
            <div className='flex-1'>
              <CardTitle className='text-xl sm:text-2xl'>
                {result.testName}
              </CardTitle>
              <p className='text-sm sm:text-base text-muted-foreground mt-2'>
                Completed on {formatDate(result.completedAt!)}
              </p>
            </div>
            <Button onClick={handleDownload} className='w-full sm:w-auto'>
              <Download className='h-4 w-4 mr-2' />
              Download PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Test Results</CardTitle>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs sm:text-sm'>Biomarker</TableHead>
                <TableHead className='text-xs sm:text-sm'>
                  Your Result
                </TableHead>
                <TableHead className='text-xs sm:text-sm hidden md:table-cell'>
                  Reference Range
                </TableHead>
                <TableHead className='text-xs sm:text-sm'>Status</TableHead>
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
            <CardTitle>Clinical Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>{result.interpretation}</p>
          </CardContent>
        </Card>
      )}

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
