import { TestsViewLabPartner } from "@/components/lab-partner/TestsViewLabPartner";

export const metadata = {
  title: "Test Catalog | Lab Partner | Ez LabTesting",
  description: "View available tests",
};

export default function LabPartnerTestsPage() {
  return (
    <div>
      <TestsViewLabPartner />
    </div>
  );
}
