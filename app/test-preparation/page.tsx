import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coffee,
  Droplet,
  Pill,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function TestPreparationPage() {
  const generalGuidelines = [
    {
      icon: Clock,
      title: "Timing",
      description:
        "Schedule your lab visit at the recommended time for your specific test.",
    },
    {
      icon: Droplet,
      title: "Hydration",
      description:
        "Stay well-hydrated by drinking plenty of water before your visit.",
    },
    {
      icon: Pill,
      title: "Medications",
      description:
        "Continue taking prescribed medications unless instructed otherwise.",
    },
    {
      icon: Coffee,
      title: "Fasting",
      description:
        "Follow fasting instructions carefully if required for your test.",
    },
  ];

  const testSpecificPrep = [
    {
      category: "Fasting Tests",
      tests: [
        "Basic Metabolic Panel (BMP)",
        "Comprehensive Metabolic Panel (CMP)",
        "Lipid Panel",
        "Glucose (Fasting)",
        "Insulin (Fasting)",
      ],
      requirements: [
        "Fast for 8-12 hours before your test",
        "Drink water only (no coffee, tea, or juice)",
        "Take medications with water only",
        "Schedule morning appointments when possible",
      ],
      icon: Coffee,
      color: "orange",
    },
    {
      category: "Hormone Tests",
      tests: [
        "Testosterone",
        "Thyroid Panel (TSH, T3, T4)",
        "Cortisol",
        "DHEA",
      ],
      requirements: [
        "Schedule test for early morning (7-9 AM) when hormone levels are most stable",
        "Avoid strenuous exercise 24 hours before",
        "Get adequate sleep the night before",
        "Some tests may require fasting - check specific test details",
      ],
      icon: Clock,
      color: "purple",
    },
    {
      category: "Vitamin & Mineral Tests",
      tests: ["Vitamin D", "Vitamin B12", "Iron & Ferritin", "Magnesium"],
      requirements: [
        "No special preparation usually required",
        "Avoid supplements 24 hours before test",
        "Morning or afternoon appointments are fine",
        "Stay hydrated",
      ],
      icon: Droplet,
      color: "blue",
    },
    {
      category: "Complete Blood Count (CBC)",
      tests: ["CBC", "CBC with Differential"],
      requirements: [
        "No fasting required",
        "Can be done any time of day",
        "Stay well-hydrated",
        "Wear short sleeves or easily rolled-up sleeves",
      ],
      icon: CheckCircle,
      color: "green",
    },
  ];

  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Test Preparation Guidelines
          </h1>
          <p className='text-xl text-gray-600'>
            Prepare properly for accurate test results
          </p>
        </div>

        {/* Important Notice */}
        <Alert className='mb-8 border-blue-200 bg-blue-50'>
          <AlertCircle className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-gray-700'>
            <strong>Important:</strong> Always check your specific test
            requirements in your order confirmation email. If you have
            questions, contact our support team at{" "}
            <a
              href='mailto:support@ezlabtesting.com'
              className='text-blue-600 hover:underline'
            >
              support@ezlabtesting.com
            </a>
          </AlertDescription>
        </Alert>

        {/* General Guidelines */}
        <div className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            General Guidelines
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {generalGuidelines.map((guideline) => (
              <Card
                key={guideline.title}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                    <guideline.icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <CardTitle className='text-lg'>{guideline.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-600'>
                    {guideline.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Test-Specific Preparation */}
        <div className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Test-Specific Preparation
          </h2>
          <div className='space-y-6'>
            {testSpecificPrep.map((prep) => (
              <Card
                key={prep.category}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex items-start gap-4'>
                    <div
                      className={`w-12 h-12 ${
                        colorClasses[prep.color as keyof typeof colorClasses]
                      } rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <prep.icon className='h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-2xl mb-2'>
                        {prep.category}
                      </CardTitle>
                      <CardDescription className='text-base'>
                        Common tests: {prep.tests.join(", ")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className='font-semibold text-gray-900 mb-3'>
                    Preparation Requirements:
                  </h4>
                  <ul className='space-y-2'>
                    {prep.requirements.map((req, index) => (
                      <li key={index} className='flex items-start gap-2'>
                        <CheckCircle className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <span className='text-gray-700'>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What to Bring */}
        <Card className='mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              What to Bring to Your Lab Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span>Lab requisition form (emailed after purchase)</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span>Valid government-issued photo ID</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span>Insurance card (if applicable)</span>
              </li>
              <li className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span>List of current medications (recommended)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              Tips for a Successful Lab Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Before Your Visit:
                </h4>
                <ul className='space-y-1 text-gray-700'>
                  <li>• Review your test requirements</li>
                  <li>• Print or save your requisition form</li>
                  <li>• Verify lab hours and location</li>
                  <li>• Wear comfortable, loose-fitting clothing</li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  During Your Visit:
                </h4>
                <ul className='space-y-1 text-gray-700'>
                  <li>• Arrive relaxed and well-hydrated</li>
                  <li>• Inform staff of any allergies</li>
                  <li>
                    • Mention if you've had issues with blood draws before
                  </li>
                  <li>• Ask questions if you're unsure about anything</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className='bg-gray-100'>
          <CardHeader>
            <CardTitle>Need More Information?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href='/tests'
                className='px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center'
              >
                Browse Tests
              </Link>
              <Link
                href='/faqs'
                className='px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center'
              >
                View FAQs
              </Link>
              <Link
                href='/help-center'
                className='px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center'
              >
                Help Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
