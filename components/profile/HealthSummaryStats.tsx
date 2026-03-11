import { HealthSummary } from "@/app/profile/types/profile";
import { Beaker, Cake, Droplet, Shield } from "lucide-react";

interface HealthSummaryStatsProps {
  healthSummary: HealthSummary;
  bloodType?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

function StatCard({ icon, label, value, className = "" }: StatCardProps) {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors ${className}`}
    >
      <div className='text-primary mb-2'>{icon}</div>
      <p className='text-xs text-muted-foreground font-medium text-center mb-2'>
        {label}
      </p>
      <p className='text-xl font-bold text-foreground text-center'>{value}</p>
    </div>
  );
}

/**
 * Health Summary Stats component showing key health indicators
 */
export function HealthSummaryStats({
  healthSummary,
  bloodType,
}: HealthSummaryStatsProps) {
  const getBloodTypeDisplay = () => {
    if (!bloodType || bloodType === "Not set") {
      return "Not set";
    }
    return bloodType;
  };

  const getAgeDisplay = () => {
    return healthSummary.age ? String(healthSummary.age) : "N/A";
  };

  const getStatusDisplay = () => {
    // Based on verification status - you can adjust this based on your needs
    return "Verified";
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <StatCard
        icon={<Droplet className='w-5 h-5' />}
        label='Blood Type'
        value={getBloodTypeDisplay()}
      />
      <StatCard
        icon={<Beaker className='w-5 h-5' />}
        label='Tests Done'
        value={String(healthSummary.testsDone)}
      />
      <StatCard
        icon={<Shield className='w-5 h-5' />}
        label='Status'
        value={getStatusDisplay()}
      />
      <StatCard
        icon={<Cake className='w-5 h-5' />}
        label='Age'
        value={getAgeDisplay()}
      />
    </div>
  );
}
