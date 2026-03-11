import { ContactInfo } from "@/app/profile/types/profile";
import { EmptyValue } from "@/components/shared/EmptyValue";
import { InfoCard } from "@/components/shared/InfoCard";
import { Section } from "@/components/shared/Section";
import { formatDate } from "@/lib/utils";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";

interface ContactInformationSectionProps {
  contactInfo: ContactInfo;
}

/**
 * Contact Information section showing email, phone, DOB, gender, address
 */
export function ContactInformationSection({
  contactInfo,
}: ContactInformationSectionProps) {
  return (
    <Section
      title='Contact Information'
      icon={<Mail className='w-5 h-5' />}
      withDivider
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <InfoCard
          icon={<Mail className='w-4 h-4' />}
          label='Email Address'
          value={contactInfo.email}
        />
        <InfoCard
          icon={<Phone className='w-4 h-4' />}
          label='Phone Number'
          value={contactInfo.phone}
        />
        <InfoCard
          icon={<Calendar className='w-4 h-4' />}
          label='Date of Birth'
          value={
            contactInfo.dateOfBirth ? (
              formatDate(contactInfo.dateOfBirth)
            ) : (
              <EmptyValue variant='minimal' />
            )
          }
        />
        <InfoCard
          icon={<User className='w-4 h-4' />}
          label='Gender'
          value={
            contactInfo.gender ? (
              contactInfo.gender
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            ) : (
              <EmptyValue variant='minimal' />
            )
          }
        />
        <InfoCard
          icon={<MapPin className='w-4 h-4' />}
          label='Address'
          value={contactInfo.address}
          className='md:col-span-2'
        />
      </div>
    </Section>
  );
}
