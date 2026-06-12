"use client";

import { CustomerSupportHub } from "@/components/support/CustomerSupportHub";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "CUSTOMER" | "ADMIN" | "SYSTEM";
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "OPEN"
    | "AWAITING_ADMIN"
    | "IN_PROGRESS"
    | "WAITING_FOR_CUSTOMER"
    | "RESOLVED"
    | "CLOSED";
  createdAt: string;
  updatedAt: string;
  responseTarget: string;
  messages: SupportMessage[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  order?: {
    id: string;
    orderStatus: string;
    paymentStatus: string;
    accessOrderId?: string;
    requisitionPdfUrl?: string;
  };
}

export default function SupportPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [showGuestView, setShowGuestView] = useState(false);

  // If user is authenticated, show the customer support hub
  if (user && !isAuthLoading) {
    return <CustomerSupportHub />;
  }

  // Show loading state
  if (isAuthLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  // Guest landing page
  return (
    <div className='container mx-auto py-8 px-4 max-w-6xl'>
      {/* Hero Section */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6'>
          <MessageSquare className='h-8 w-8 text-blue-600' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          How Can We Help You?
        </h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Get support for your lab tests, orders, and results. Our team is here
          to help 24/7.
        </p>
      </div>

      {/* Quick Actions */}
      <div className='grid md:grid-cols-3 gap-6 mb-12'>
        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4'>
              <BookOpen className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Browse Tests</h3>
            <p className='text-gray-600 mb-4'>
              Explore our comprehensive lab test menu
            </p>
            <Link href='/tests'>
              <Button className='w-full'>View Tests</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
              <MessageSquare className='h-6 w-6 text-blue-600' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Live Chat</h3>
            <p className='text-gray-600 mb-4'>
              Chat with our support team instantly
            </p>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setShowGuestView(true)}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4'>
              <Phone className='h-6 w-6 text-purple-600' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Call Us</h3>
            <p className='text-gray-600 mb-4'>
              Speak with our care team directly
            </p>
            <a href='tel:+17024837477'>
              <Button variant='outline' className='w-full'>
                +1 (702) 483-7477
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Support Options */}
      <div className='grid md:grid-cols-2 gap-8 mb-12'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-orange-500' />
              Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start gap-3'>
              <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
              <div>
                <h4 className='font-medium'>Order Status</h4>
                <p className='text-sm text-gray-600'>
                  Track your lab test orders and results
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
              <div>
                <h4 className='font-medium'>Billing Questions</h4>
                <p className='text-sm text-gray-600'>
                  Payment, insurance, and billing inquiries
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
              <div>
                <h4 className='font-medium'>Test Results</h4>
                <p className='text-sm text-gray-600'>
                  Understanding your lab test results
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <CheckCircle className='h-5 w-5 text-green-500 mt-0.5' />
              <div>
                <h4 className='font-medium'>Technical Support</h4>
                <p className='text-sm text-gray-600'>
                  Website and account access issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-blue-500' />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
              <Phone className='h-5 w-5 text-gray-400' />
              <div>
                <h4 className='font-medium'>Phone Support</h4>
                <p className='text-sm text-gray-600'>+1 (702) 483-7477</p>
                <p className='text-xs text-gray-500'>Mon-Fri, 8am-8pm EST</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Mail className='h-5 w-5 text-gray-400' />
              <div>
                <h4 className='font-medium'>Email Support</h4>
                <p className='text-sm text-gray-600'>
                  support@ezlabtesting.com
                </p>
                <p className='text-xs text-gray-500'>
                  Response within 24 hours
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <MessageSquare className='h-5 w-5 text-gray-400' />
              <div>
                <h4 className='font-medium'>Live Chat</h4>
                <p className='text-sm text-gray-600'>Available 24/7</p>
                <p className='text-xs text-gray-500'>
                  Average response: 2 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sign In CTA */}
      <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-0'>
        <CardContent className='p-8 text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Sign In for Full Support Features
          </h2>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            Access your support history, track tickets, and get personalized
            assistance by signing into your account.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/login'>
              <Button size='lg' className='w-full sm:w-auto'>
                Sign In to Your Account
              </Button>
            </Link>
            <Link href='/register'>
              <Button variant='outline' size='lg' className='w-full sm:w-auto'>
                Create Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
