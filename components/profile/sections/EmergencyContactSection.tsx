import { EmergencyContact } from "@/app/profile/types/profile";
import { InfoCard } from "@/components/shared/InfoCard";
import { Section } from "@/components/shared/Section";
import { Phone, Users } from "lucide-react";

interface EmergencyContactSectionProps {
  emergencyContact: EmergencyContact;
}

/**
 * Emergency Contact section showing contact name and phone
 */
export function EmergencyContactSection({
  emergencyContact,
}: EmergencyContactSectionProps) {
  return (
    <Section
      title='Emergency Contact'
      icon={<Users className='w-5 h-5' />}
      withDivider
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <InfoCard
          icon={<Users className='w-4 h-4' />}
          label='Contact Name'
          value={emergencyContact.name}
        />
        <InfoCard
          icon={<Phone className='w-4 h-4' />}
          label='Contact Phone'
          value={emergencyContact.phone}
        />
      </div>
    </Section>
  );
}
