"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Heart,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Mock data for customer dashboard
const dashboardData = {
  upcomingAppointments: 2,
  pendingResults: 3,
  completedTests: 12,
  healthScore: 85,
};

const recentOrders = [
  {
    id: "ORD-2024-001",
    testName: "Complete Blood Count (CBC)",
    date: "2024-01-15",
    status: "completed",
    result: "available",
  },
  {
    id: "ORD-2024-002",
    testName: "Lipid Panel",
    date: "2024-01-18",
    status: "processing",
    result: "pending",
  },
  {
    id: "ORD-2024-003",
    testName: "Vitamin D Test",
    date: "2024-01-20",
    status: "sample_collected",
    result: "pending",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    testName: "Annual Health Checkup",
    date: "2024-01-25",
    time: "10:00 AM",
    location: "Main Lab Center",
    status: "confirmed",
  },
  {
    id: 2,
    testName: "Follow-up Blood Test",
    date: "2024-02-02",
    time: "2:30 PM",
    location: "Downtown Lab",
    status: "pending",
  },
];

const recentResults = [
  {
    id: 1,
    testName: "Complete Blood Count",
    date: "2024-01-15",
    status: "normal",
    keyFindings: "All values within normal range",
  },
  {
    id: 2,
    testName: "Thyroid Function Test",
    date: "2024-01-10",
    status: "normal",
    keyFindings: "TSH levels normal",
  },
  {
    id: 3,
    testName: "Blood Glucose",
    date: "2024-01-05",
    status: "attention",
    keyFindings: "Slightly elevated, consult doctor",
  },
];

const healthInsights = [
  {
    id: 1,
    title: "Cholesterol Management",
    description:
      "Your cholesterol levels are improving. Keep up the good work!",
    icon: Heart,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-900/30",
  },
  {
    id: 2,
    title: "Vitamin D",
    description: "Consider increasing sun exposure or supplementation.",
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900/30",
  },
  {
    id: 3,
    title: "Regular Checkups",
    description: "Schedule your annual health screening soon.",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900/30",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: {
      label: "Completed",
      class: "status-success",
    },
    processing: {
      label: "Processing",
      class: "status-info",
    },
    sample_collected: {
      label: "Sample Collected",
      class: "status-warning",
    },
    pending: {
      label: "Pending",
      class: "status-warning",
    },
    confirmed: {
      label: "Confirmed",
      class: "status-success",
    },
    normal: {
      label: "Normal",
      class: "status-success",
    },
    attention: {
      label: "Needs Attention",
      class: "status-warning",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    class: "",
  };

  return (
    <span className={`${config.class} text-xs px-2 py-1 rounded-full`}>
      {config.label}
    </span>
  );
};

export function CustomerDashboard() {
  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='glass-card p-6 rounded-xl'>
        <h2 className='text-h2 text-foreground mb-2'>Welcome back!</h2>
        <p className='text-muted-foreground'>
          Here's an overview of your health journey and upcoming appointments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Upcoming Appointments
            </CardTitle>
            <Calendar className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData.upcomingAppointments}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Next: Jan 25, 2024
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Results
            </CardTitle>
            <Clock className='h-4 w-4 text-amber-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData.pendingResults}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Expected within 24-48 hrs
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completed Tests
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData.completedTests}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Total lifetime tests
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Health Score</CardTitle>
            <TrendingUp className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData.healthScore}%
            </div>
            <p className='text-xs text-green-600 font-medium mt-1'>
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='glass-card'>
        <CardHeader>
          <CardTitle className='text-h3'>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 md:grid-cols-4'>
            <Link
              href='/items'
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all group'
            >
              <ShoppingBag className='h-5 w-5 text-primary group-hover:scale-110 transition-transform' />
              <div>
                <p className='font-medium text-sm'>Browse Tests</p>
                <p className='text-xs text-muted-foreground'>Explore catalog</p>
              </div>
            </Link>

            <Link
              href='/results'
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all group'
            >
              <FileText className='h-5 w-5 text-primary group-hover:scale-110 transition-transform' />
              <div>
                <p className='font-medium text-sm'>View Results</p>
                <p className='text-xs text-muted-foreground'>Check reports</p>
              </div>
            </Link>

            <Link
              href='/find-lab-center'
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all group'
            >
              <Calendar className='h-5 w-5 text-primary group-hover:scale-110 transition-transform' />
              <div>
                <p className='font-medium text-sm'>Book Appointment</p>
                <p className='text-xs text-muted-foreground'>Find lab center</p>
              </div>
            </Link>

            <Link
              href='/transactions'
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all group'
            >
              <Package className='h-5 w-5 text-primary group-hover:scale-110 transition-transform' />
              <div>
                <p className='font-medium text-sm'>Order History</p>
                <p className='text-xs text-muted-foreground'>View orders</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* Recent Orders */}
        <Card className='medical-card'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-h3'>Recent Orders</CardTitle>
                <CardDescription>Your latest test orders</CardDescription>
              </div>
              <Link
                href='/transactions'
                className='text-sm text-primary hover:underline'
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className='p-4 rounded-lg border border-border hover:border-primary/50 transition-colors'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1'>
                      <p className='font-medium text-sm'>{order.testName}</p>
                      <p className='text-xs text-muted-foreground font-mono mt-1'>
                        {order.id}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    {order.result === "available" && (
                      <Link
                        href={`/results/${order.id}`}
                        className='flex items-center gap-1 text-primary hover:underline'
                      >
                        <Download className='h-3 w-3' />
                        View Result
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className='medical-card'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-h3'>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled tests</CardDescription>
              </div>
              <Link
                href='/find-lab-center'
                className='text-sm text-primary hover:underline'
              >
                Book new
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className='p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1'>
                      <p className='font-medium text-sm'>
                        {appointment.testName}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {appointment.location}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground mt-2'>
                    <Calendar className='h-3 w-3' />
                    <span>
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                    <Clock className='h-3 w-3 ml-2' />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card className='medical-card'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-h3'>Recent Test Results</CardTitle>
              <CardDescription>Latest results from your tests</CardDescription>
            </div>
            <Link
              href='/results'
              className='text-sm text-primary hover:underline'
            >
              View all results
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {recentResults.map((result) => (
              <div
                key={result.id}
                className='flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors'
              >
                <div className='flex items-center gap-4 flex-1'>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      result.status === "normal"
                        ? "bg-green-100 dark:bg-green-950"
                        : "bg-amber-100 dark:bg-amber-950"
                    }`}
                  >
                    {result.status === "normal" ? (
                      <CheckCircle className='h-6 w-6 text-green-600' />
                    ) : (
                      <AlertCircle className='h-6 w-6 text-amber-600' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{result.testName}</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {result.keyFindings}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {new Date(result.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {getStatusBadge(result.status)}
                  <button className='btn-sm bg-primary text-white hover:bg-primary/90 rounded-lg'>
                    <Download className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card className='glass-card'>
        <CardHeader>
          <CardTitle className='text-h3'>Health Insights</CardTitle>
          <CardDescription>
            Personalized recommendations based on your test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            {healthInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                    <h3 className='font-semibold text-sm'>{insight.title}</h3>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {insight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
