import { MedicalInfo } from "@/app/profile/types/profile";
import { EmptyValue } from "@/components/shared/EmptyValue";
import { InfoCard } from "@/components/shared/InfoCard";
import { Section } from "@/components/shared/Section";
import { AlertCircle, Droplet, Heart, Pill } from "lucide-react";

interface MedicalInformationSectionProps {
  medicalInfo: MedicalInfo;
}

/**
 * Medical Information section showing blood type, allergies, conditions, medications
 */
export function MedicalInformationSection({
  medicalInfo,
}: MedicalInformationSectionProps) {
  const formatArray = (arr?: string[]): string | React.ReactNode => {
    if (!arr || arr.length === 0) {
      return <EmptyValue variant='minimal' />;
    }
    return arr.join(", ");
  };

  return (
    <Section
      title='Medical Information'
      icon={<Heart className='w-5 h-5' />}
      withDivider
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <InfoCard
          icon={<Droplet className='w-4 h-4' />}
          label='Blood Type'
          value={medicalInfo.bloodType}
        />
        <InfoCard
          icon={<AlertCircle className='w-4 h-4' />}
          label='Allergies'
          value={formatArray(medicalInfo.allergies)}
          className='md:col-span-2'
        />
        <InfoCard
          icon={<Heart className='w-4 h-4' />}
          label='Medical Conditions'
          value={formatArray(medicalInfo.medicalConditions)}
          className='md:col-span-2'
        />
        <InfoCard
          icon={<Pill className='w-4 h-4' />}
          label='Current Medications'
          value={formatArray(medicalInfo.currentMedications)}
          className='md:col-span-2'
        />
      </div>
    </Section>
  );
}
