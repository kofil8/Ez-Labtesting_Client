import { AccountInfo } from "@/app/profile/types/profile";
import { InfoCard } from "@/components/shared/InfoCard";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar, Lock } from "lucide-react";

interface AccountInformationSectionProps {
  accountInfo: AccountInfo;
}

/**
 * Account Information section showing account status and member since date
 */
export function AccountInformationSection({
  accountInfo,
}: AccountInformationSectionProps) {
  const getStatusDisplay = () => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      verified: { label: "Verified", variant: "default" },
      unverified: { label: "Unverified", variant: "outline" },
      pending: { label: "Pending", variant: "secondary" },
    };

    const status =
      statusMap[accountInfo.verificationStatus] || statusMap.unverified;
    return (
      <Badge variant={status.variant} className='w-fit'>
        {status.label}
      </Badge>
    );
  };

  return (
    <Section
      title='Account Information'
      icon={<Lock className='w-5 h-5' />}
      withDivider={false}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <InfoCard
          icon={<Lock className='w-4 h-4' />}
          label='Account Status'
          value={getStatusDisplay()}
        />
        <InfoCard
          icon={<Calendar className='w-4 h-4' />}
          label='Member Since'
          value={formatDate(accountInfo.memberSince)}
        />
      </div>
    </Section>
  );
}
