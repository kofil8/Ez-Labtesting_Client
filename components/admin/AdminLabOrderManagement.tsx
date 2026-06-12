"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hook/use-toast";
import { CheckCircle2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface ManualSupportRequest {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  issueType: string;
  description: string;
  phone?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

interface AdminLabOrderManagementProps {
  onRefresh?: () => void;
}

export default function AdminLabOrderManagement({
  onRefresh,
}: AdminLabOrderManagementProps) {
  const [requests, setRequests] = useState<ManualSupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ManualSupportRequest | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("OPEN");

  // Fetch manual support requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // In real implementation, call actual API endpoint
        // const res = await clientFetch('/api/admin/manual-support-requests');
        // const data = await res.json();
        // setRequests(data.requests);

        // For now, show empty state
        setRequests([]);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResolveRequest = async (
    request: ManualSupportRequest,
    action: "resolve" | "reject",
  ) => {
    if (!actionNotes.trim()) {
      toast({
        title: "Missing Notes",
        description: "Please add notes before resolving the request.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In real implementation:
      // const res = await clientFetch(
      //   `/api/admin/manual-support-requests/${request.id}/${action}`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify({ adminNotes: actionNotes }),
      //   }
      // );

      toast({
        title: action === "resolve" ? "Request Resolved" : "Request Rejected",
        description: "The support request has been processed.",
      });

      setActionNotes("");
      setSelectedRequest(null);
      onRefresh?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryLabOrder = async (request: ManualSupportRequest) => {
    setIsProcessing(true);
    try {
      // In real implementation:
      // const res = await clientFetch(
      //   `/api/admin/orders/${request.orderId}/retry-lab-submission`,
      //   { method: "POST" }
      // );

      toast({
        title: "Lab Order Retry Initiated",
        description:
          "The lab order submission will be retried. Customer will be notified.",
      });

      setSelectedRequest(null);
      onRefresh?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry lab order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRequests = requests.filter((r) =>
    filterStatus === "ALL" ? true : r.status === filterStatus,
  );

  const openCount = requests.filter((r) => r.status === "OPEN").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;

  if (!selectedRequest) {
    return (
      <div className='space-y-6'>
        {/* Stats */}
        <div className='grid grid-cols-3 gap-4'>
          <Card className='p-4'>
            <div className='text-sm font-medium text-muted-foreground'>
              Open Requests
            </div>
            <div className='text-3xl font-bold mt-2'>{openCount}</div>
          </Card>
          <Card className='p-4'>
            <div className='text-sm font-medium text-muted-foreground'>
              In Progress
            </div>
            <div className='text-3xl font-bold mt-2'>{inProgressCount}</div>
          </Card>
          <Card className='p-4'>
            <div className='text-sm font-medium text-muted-foreground'>
              Total Requests
            </div>
            <div className='text-3xl font-bold mt-2'>{requests.length}</div>
          </Card>
        </div>

        {/* Filter */}
        <div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='OPEN'>Open Requests</SelectItem>
              <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
              <SelectItem value='RESOLVED'>Resolved</SelectItem>
              <SelectItem value='REJECTED'>Rejected</SelectItem>
              <SelectItem value='ALL'>All Requests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className='space-y-3'>
          {isLoading ? (
            <div className='text-center py-8 text-muted-foreground'>
              Loading support requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <Card className='p-8 text-center'>
              <Mail className='h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4' />
              <p className='text-muted-foreground'>
                {filterStatus === "OPEN"
                  ? "No open support requests"
                  : "No matching requests"}
              </p>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className='p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition'
                onClick={() => setSelectedRequest(request)}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-semibold'>{request.userEmail}</h4>
                      <Badge variant='outline'>{request.issueType}</Badge>
                      <Badge
                        className={
                          request.status === "OPEN"
                            ? "bg-red-100 text-red-800"
                            : request.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Order: {request.orderId}
                    </p>
                    <p className='text-sm mt-2 line-clamp-2'>
                      {request.description}
                    </p>
                  </div>
                  <div className='text-xs text-muted-foreground text-right ml-4'>
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className='space-y-6'>
      <button
        onClick={() => setSelectedRequest(null)}
        className='text-sm text-blue-600 hover:text-blue-700'
      >
        ← Back to Requests
      </button>

      <Card className='p-6 space-y-6'>
        {/* Header */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold'>
                {selectedRequest.userEmail}
              </h2>
              <p className='text-muted-foreground'>
                Order ID: {selectedRequest.orderId}
              </p>
            </div>
            <Badge
              className={
                selectedRequest.status === "OPEN"
                  ? "bg-red-100 text-red-800"
                  : selectedRequest.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : selectedRequest.status === "RESOLVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
              }
            >
              {selectedRequest.status}
            </Badge>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Issue Type</p>
              <p className='font-medium'>{selectedRequest.issueType}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Contact</p>
              <p className='font-medium'>
                {selectedRequest.phone || selectedRequest.userEmail}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Created</p>
              <p className='font-medium'>
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Updated</p>
              <p className='font-medium'>
                {selectedRequest.resolvedAt
                  ? new Date(selectedRequest.resolvedAt).toLocaleString()
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div className='border-t pt-6'>
          <h3 className='font-semibold mb-2'>Issue Description</h3>
          <div className='bg-slate-50 dark:bg-slate-900 p-4 rounded text-sm whitespace-pre-wrap'>
            {selectedRequest.description}
          </div>
        </div>

        {/* Admin Notes */}
        {selectedRequest.adminNotes && (
          <div className='border-t pt-6 bg-blue-50 dark:bg-blue-950/20 p-4 rounded'>
            <h3 className='font-semibold mb-2 flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4' />
              Admin Notes
            </h3>
            <p className='text-sm whitespace-pre-wrap'>
              {selectedRequest.adminNotes}
            </p>
          </div>
        )}

        {/* Actions */}
        {selectedRequest.status === "OPEN" ||
        selectedRequest.status === "IN_PROGRESS" ? (
          <div className='border-t pt-6 space-y-4'>
            <div>
              <label className='text-sm font-medium'>Action Notes</label>
              <Textarea
                placeholder='Describe the action you took or issue you found...'
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
                className='mt-2'
              />
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={() => handleRetryLabOrder(selectedRequest)}
                variant='outline'
                disabled={isProcessing}
                className='flex-1'
              >
                Retry Lab Order
              </Button>
              <Button
                onClick={() => handleResolveRequest(selectedRequest, "resolve")}
                disabled={isProcessing || !actionNotes.trim()}
                className='flex-1'
              >
                {isProcessing ? "Processing..." : "Mark as Resolved"}
              </Button>
              <Button
                onClick={() => handleResolveRequest(selectedRequest, "reject")}
                variant='destructive'
                disabled={isProcessing || !actionNotes.trim()}
                className='flex-1'
              >
                Reject Request
              </Button>
            </div>
          </div>
        ) : (
          <div className='border-t pt-6 flex items-center gap-2 text-green-700 dark:text-green-400'>
            <CheckCircle2 className='h-5 w-5' />
            <span>This request has been completed.</span>
          </div>
        )}
      </Card>
    </div>
  );
}
