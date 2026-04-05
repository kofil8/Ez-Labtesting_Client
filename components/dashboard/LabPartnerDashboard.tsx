"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Package,
  TestTube2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for lab partner dashboard
const sampleData = {
  pendingSamples: 24,
  processingSamples: 18,
  completedToday: 42,
  totalTests: 84,
  avgProcessingTime: "2.3 hrs",
  qualityScore: 98.5,
};

const weeklyData = [
  { day: "Mon", samples: 65, completed: 58 },
  { day: "Tue", samples: 72, completed: 68 },
  { day: "Wed", samples: 68, completed: 65 },
  { day: "Thu", samples: 78, completed: 71 },
  { day: "Fri", samples: 82, completed: 76 },
  { day: "Sat", samples: 45, completed: 42 },
  { day: "Sun", samples: 38, completed: 35 },
];

const testTypeData = [
  { name: "Blood Tests", value: 145, color: "#3b82f6" },
  { name: "Urine Tests", value: 89, color: "#8b5cf6" },
  { name: "Genetic Tests", value: 52, color: "#10b981" },
  { name: "Culture Tests", value: 38, color: "#f59e0b" },
];

const urgentSamples = [
  {
    id: "S-2024-001",
    patient: "Patient #4523",
    testType: "Complete Blood Count",
    receivedAt: "2 hours ago",
    priority: "urgent",
  },
  {
    id: "S-2024-002",
    patient: "Patient #4531",
    testType: "Lipid Panel",
    receivedAt: "3 hours ago",
    priority: "urgent",
  },
  {
    id: "S-2024-003",
    patient: "Patient #4542",
    testType: "Glucose Test",
    receivedAt: "4 hours ago",
    priority: "high",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "Sample received",
    sampleId: "S-2024-045",
    time: "5 min ago",
    icon: Package,
  },
  {
    id: 2,
    action: "Test completed",
    sampleId: "S-2024-038",
    time: "12 min ago",
    icon: CheckCircle,
  },
  {
    id: 3,
    action: "Quality check passed",
    sampleId: "S-2024-041",
    time: "25 min ago",
    icon: CheckCircle,
  },
  {
    id: 4,
    action: "Result sent",
    sampleId: "S-2024-032",
    time: "1 hour ago",
    icon: FileText,
  },
];

export function LabPartnerDashboard() {
  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Samples
            </CardTitle>
            <Clock className='h-4 w-4 text-amber-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {sampleData.pendingSamples}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Processing</CardTitle>
            <Activity className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {sampleData.processingSamples}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completed Today
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {sampleData.completedToday}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              <span className='text-green-600 font-medium'>+12%</span> vs
              yesterday
            </p>
          </CardContent>
        </Card>

        <Card className='medical-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Quality Score</CardTitle>
            <TrendingUp className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{sampleData.qualityScore}%</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Weekly Sample Processing */}
        <Card className='col-span-4 glass-card'>
          <CardHeader>
            <CardTitle className='text-h3'>Weekly Sample Processing</CardTitle>
            <CardDescription>
              Sample received vs completed this week
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id='colorSamples' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id='colorCompleted'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                <XAxis
                  dataKey='day'
                  stroke='#64748b'
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke='#64748b' fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type='monotone'
                  dataKey='samples'
                  stroke='#3b82f6'
                  strokeWidth={2}
                  fillOpacity={1}
                  fill='url(#colorSamples)'
                  name='Received'
                />
                <Area
                  type='monotone'
                  dataKey='completed'
                  stroke='#10b981'
                  strokeWidth={2}
                  fillOpacity={1}
                  fill='url(#colorCompleted)'
                  name='Completed'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Type Distribution */}
        <Card className='col-span-3 glass-card'>
          <CardHeader>
            <CardTitle className='text-h3'>Test Type Distribution</CardTitle>
            <CardDescription>Current week breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Urgent Samples & Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* Urgent Samples */}
        <Card className='medical-card'>
          <CardHeader>
            <CardTitle className='text-h3 flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-amber-600' />
              Urgent Samples
            </CardTitle>
            <CardDescription>
              Samples requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {urgentSamples.map((sample) => (
                <div
                  key={sample.id}
                  className='flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-mono text-sm font-semibold text-medical-value'>
                        {sample.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          sample.priority === "urgent"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {sample.priority}
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {sample.testType}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {sample.receivedAt}
                    </p>
                  </div>
                  <button className='btn-sm bg-primary text-white hover:bg-primary/90 rounded-lg'>
                    Process
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className='medical-card'>
          <CardHeader>
            <CardTitle className='text-h3'>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your lab</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors'
                  >
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium'>{activity.action}</p>
                      <p className='text-sm text-muted-foreground font-mono'>
                        {activity.sampleId}
                      </p>
                    </div>
                    <span className='text-xs text-muted-foreground whitespace-nowrap'>
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className='glass-card'>
        <CardHeader>
          <CardTitle className='text-h3'>Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-4'>
            <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30'>
              <div className='flex items-center gap-2 mb-2'>
                <TestTube2 className='h-4 w-4 text-blue-600' />
                <span className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                  Total Tests
                </span>
              </div>
              <div className='text-2xl font-bold text-blue-600'>
                {sampleData.totalTests}
              </div>
              <p className='text-xs text-blue-700 dark:text-blue-400 mt-1'>
                This week
              </p>
            </div>

            <div className='p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30'>
              <div className='flex items-center gap-2 mb-2'>
                <Clock className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium text-green-900 dark:text-green-100'>
                  Avg. Processing
                </span>
              </div>
              <div className='text-2xl font-bold text-green-600'>
                {sampleData.avgProcessingTime}
              </div>
              <p className='text-xs text-green-700 dark:text-green-400 mt-1'>
                15% faster than last month
              </p>
            </div>

            <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30'>
              <div className='flex items-center gap-2 mb-2'>
                <Users className='h-4 w-4 text-purple-600' />
                <span className='text-sm font-medium text-purple-900 dark:text-purple-100'>
                  Active Patients
                </span>
              </div>
              <div className='text-2xl font-bold text-purple-600'>156</div>
              <p className='text-xs text-purple-700 dark:text-purple-400 mt-1'>
                This month
              </p>
            </div>

            <div className='p-4 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30'>
              <div className='flex items-center gap-2 mb-2'>
                <Calendar className='h-4 w-4 text-teal-600' />
                <span className='text-sm font-medium text-teal-900 dark:text-teal-100'>
                  Appointments
                </span>
              </div>
              <div className='text-2xl font-bold text-teal-600'>28</div>
              <p className='text-xs text-teal-700 dark:text-teal-400 mt-1'>
                Scheduled today
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
