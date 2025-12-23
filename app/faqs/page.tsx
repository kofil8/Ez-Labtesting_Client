import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function FAQsPage() {
  const faqCategories = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What is EzLabTesting?',
          answer: 'EzLabTesting is a convenient online platform that allows you to order lab tests directly, without needing a doctor\'s prescription. We partner with certified labs across the country to provide accurate, affordable, and accessible lab testing services.',
        },
        {
          question: 'How does EzLabTesting work?',
          answer: 'Simply browse our available tests, add them to your cart, and complete your order. You\'ll receive a lab requisition form via email. Visit any of our partner lab centers with your form and ID to have your sample collected. Results are typically available within 1-3 business days.',
        },
        {
          question: 'Are your tests accurate?',
          answer: 'Yes, all tests are performed by CLIA-certified laboratories that meet the highest quality standards. Our partner labs use the same equipment and processes as traditional healthcare providers.',
        },
        {
          question: 'Do I need a doctor\'s prescription?',
          answer: 'No, you don\'t need a doctor\'s prescription to order tests from EzLabTesting. Our licensed physicians review and approve all orders, allowing you direct access to lab testing.',
        },
      ],
    },
    {
      category: 'Ordering & Payment',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Visit our Tests page, select the tests you need, add them to your cart, and proceed to checkout. You\'ll need to create an account or log in, provide your information, and complete payment.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and HSA/FSA cards.',
        },
        {
          question: 'Can I use my insurance?',
          answer: 'Currently, we do not accept insurance. However, our prices are often lower than insurance co-pays, and you can use HSA/FSA funds to pay for your tests.',
        },
        {
          question: 'Do you offer refunds?',
          answer: 'Refunds are available if requested before your lab visit. Once your sample has been collected, tests cannot be refunded as the lab has already incurred processing costs.',
        },
      ],
    },
    {
      category: 'Lab Visits & Sample Collection',
      questions: [
        {
          question: 'Where can I get my blood drawn?',
          answer: 'We partner with thousands of certified lab centers nationwide. Use our Find a Lab Center tool to locate a convenient location near you.',
        },
        {
          question: 'Do I need an appointment?',
          answer: 'Most of our partner labs accept walk-ins during business hours. However, some locations may require appointments. We recommend calling ahead to confirm.',
        },
        {
          question: 'What should I bring to my lab visit?',
          answer: 'Bring your lab requisition form (received via email after ordering) and a valid government-issued photo ID.',
        },
        {
          question: 'Do I need to fast before my test?',
          answer: 'Fasting requirements vary by test. Check your test details or the Test Preparation page for specific instructions. Common tests requiring fasting include lipid panels and glucose tests.',
        },
      ],
    },
    {
      category: 'Results',
      questions: [
        {
          question: 'How long does it take to get results?',
          answer: 'Most test results are available within 1-3 business days after your lab visit. Some specialized tests may take up to 7-10 business days.',
        },
        {
          question: 'How will I receive my results?',
          answer: 'Results are securely delivered through your EzLabTesting account. You\'ll receive an email notification when your results are ready. Log in to view, download, or print your results.',
        },
        {
          question: 'Will my results include reference ranges?',
          answer: 'Yes, all results include reference ranges to help you understand whether your values are within normal limits.',
        },
        {
          question: 'What if my results are abnormal?',
          answer: 'If your results are outside the normal range, we recommend consulting with your healthcare provider. While we provide test results, we cannot diagnose conditions or prescribe treatment.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          question: 'Is my information secure?',
          answer: 'Yes, we use bank-level encryption (SSL/TLS) to protect your data. We are fully HIPAA compliant and never share your personal health information without your explicit consent.',
        },
        {
          question: 'Who can see my test results?',
          answer: 'Only you have access to your test results. We do not share results with anyone, including family members, employers, or insurance companies, without your written authorization.',
        },
        {
          question: 'Do you sell my data?',
          answer: 'Absolutely not. We never sell your personal information or test results to third parties. Your privacy is our top priority.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about EzLabTesting
          </p>
        </div>

        {/* Search Help */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <p className="text-center text-gray-700">
            Can't find what you're looking for?{' '}
            <Link href="/help-center" className="text-blue-600 hover:underline font-semibold">
              Visit our Help Center
            </Link>{' '}
            or{' '}
            <a href="mailto:support@ezlabtesting.com" className="text-blue-600 hover:underline font-semibold">
              contact support
            </a>
          </p>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${categoryIndex}-${index}`}
                    className="bg-white border rounded-lg shadow-sm"
                  >
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <span className="text-left font-semibold text-gray-900">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">
            Our support team is here to help you. Reach out via email, phone, or live chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/help-center"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Visit Help Center
            </Link>
            <a
              href="mailto:support@ezlabtesting.com"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors text-center"
            >
              Email Support
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
