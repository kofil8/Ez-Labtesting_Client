import { Activity, Droplet, ShieldCheck, UserRound } from "lucide-react";

interface StatsGridProps {
  bloodType?: string;
  testsDone: number;
  accountStatus: "verified" | "unverified" | "pending";
  age?: number;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='mb-2 flex items-center gap-2 text-blue-600'>
        {icon}
        <span className='text-xs font-medium uppercase tracking-wide text-slate-600'>
          {label}
        </span>
      </div>
      <p className='text-xl font-semibold text-slate-900'>{value}</p>
    </div>
  );
}

export function StatsGrid({
  bloodType,
  testsDone,
  accountStatus,
  age,
}: StatsGridProps) {
  const accountStatusLabel =
    accountStatus === "verified"
      ? "Verified"
      : accountStatus === "pending"
        ? "Pending"
        : "Unverified";

  return (
    <section
      aria-label='Health summary'
      className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'
    >
      <StatItem
        label='Blood Type'
        value={bloodType || "Not set"}
        icon={<Droplet className='h-4 w-4' />}
      />
      <StatItem
        label='Tests Done'
        value={String(testsDone)}
        icon={<Activity className='h-4 w-4' />}
      />
      <StatItem
        label='Account Status'
        value={accountStatusLabel}
        icon={<ShieldCheck className='h-4 w-4' />}
      />
      <StatItem
        label='Age'
        value={typeof age === "number" ? String(age) : "N/A"}
        icon={<UserRound className='h-4 w-4' />}
      />
    </section>
  );
}
