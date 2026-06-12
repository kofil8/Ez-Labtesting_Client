"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface AdminSupportAnalyticsProps {
  tickets: {
    id: string;
    status: string;
    priority: string;
    category: string;
    responseTarget: string;
  }[];
  className?: string;
}

export function AdminSupportAnalytics({
  tickets,
  className,
}: AdminSupportAnalyticsProps) {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "AWAITING_ADMIN",
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").length;
  const closedTickets = tickets.filter((t) => t.status === "CLOSED").length;

  const highPriorityTickets = tickets.filter(
    (t) => t.priority === "HIGH" || t.priority === "URGENT",
  ).length;
  const overdueTickets = tickets.filter(
    (t) =>
      new Date(t.responseTarget) < new Date() &&
      t.status !== "RESOLVED" &&
      t.status !== "CLOSED",
  ).length;

  // Calculate average response time (mock data for now)
  const avgResponseTime = "2.5 hours";
  const responseRate = "94%";

  // Tickets by category
  const ticketsByCategory = tickets.reduce(
    (acc: Record<string, number>, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    },
    {},
  );

  const categoryData = Object.entries(ticketsByCategory).map(
    ([category, count]: [string, number]) => ({
      category,
      count,
      percentage:
        totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0,
    }),
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Tickets</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalTickets}</div>
            <p className='text-xs text-muted-foreground'>All time tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Open Tickets</CardTitle>
            <AlertTriangle className='h-4 w-4 text-orange-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {openTickets}
            </div>
            <p className='text-xs text-muted-foreground'>Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>In Progress</CardTitle>
            <Clock className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {inProgressTickets}
            </div>
            <p className='text-xs text-muted-foreground'>Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Resolved</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {resolvedTickets + closedTickets}
            </div>
            <p className='text-xs text-muted-foreground'>Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>High Priority</CardTitle>
            <TrendingUp className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {highPriorityTickets}
            </div>
            <p className='text-xs text-muted-foreground'>
              Require urgent attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
            <TrendingDown className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {overdueTickets}
            </div>
            <p className='text-xs text-muted-foreground'>
              Past response target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg Response</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgResponseTime}</div>
            <p className='text-xs text-muted-foreground'>Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Response Rate</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{responseRate}</div>
            <p className='text-xs text-muted-foreground'>Tickets responded</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Tickets by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {categoryData.map(({ category, count, percentage }) => (
              <div key={category} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-blue-500' />
                  <span className='text-sm font-medium capitalize'>
                    {category}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    {count} tickets
                  </span>
                  <Badge variant='secondary'>{percentage.toString()}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
