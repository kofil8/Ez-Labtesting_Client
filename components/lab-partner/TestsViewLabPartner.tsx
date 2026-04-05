"use client";

import { getTests } from "@/app/actions/tests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TestItem = {
  id: string;
  testCode: string;
  testName: string;
  price: number;
  description?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  };
  testImage?: string;
  testDetails?: Array<{
    id: string;
    turnaround: number;
    specimenType: string;
    component: string;
    method: string;
    collectionMethod?: string;
    clinicalUtility?: string;
    cptCode: string;
    testingLocatiion: string;
    temperatures?: any;
    collectionNotes?: string;
    resultsDelivery?: string;
  }>;
};

export function TestsViewLabPartner() {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTests = async () => {
    setLoading(true);
    try {
      // LAB_PARTNER only sees published tests
      const result = await getTests({ limit: 200 });
      setTests(result.data || []);
    } catch (error) {
      console.error("Error loading tests:", error);
      toast({
        title: "Error",
        description: "Failed to load tests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTests = useMemo(() => {
    return tests.filter((test) =>
      `${test.testName} ${test.testCode}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [tests, searchTerm]);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12 text-muted-foreground'>
        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Loading tests...
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold'>Test Catalog</h2>
        <p className='text-muted-foreground'>
          View all available tests for reference during lab operations
        </p>
      </div>

      <Card>
        <CardContent className='space-y-4 p-4'>
          {/* Search */}
          <Input
            placeholder='Search by test name or code...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Tests List */}
          <div className='space-y-2'>
            {filteredTests.length === 0 ? (
              <div className='text-center text-muted-foreground py-8'>
                No tests found.
              </div>
            ) : (
              filteredTests.map((test) => (
                <div
                  key={test.id}
                  className='rounded-lg border border-gray-200 hover:border-gray-300 transition-colors'
                >
                  {/* Test Header */}
                  <div
                    className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50'
                    onClick={() =>
                      setExpandedTest(expandedTest === test.id ? null : test.id)
                    }
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-lg'>
                          {test.testName}
                        </h3>
                        <Badge variant='secondary'>{test.testCode}</Badge>
                        <Badge>{test.category?.name}</Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {test.description}
                      </p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='text-right'>
                        <p className='text-lg font-semibold'>
                          {formatCurrency(test.price)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {test.testDetails?.length || 0} detail(s)
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTest(
                            expandedTest === test.id ? null : test.id,
                          );
                        }}
                      >
                        {expandedTest === test.id ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Test Details */}
                  {expandedTest === test.id && test.testDetails && (
                    <div className='border-t border-gray-200 bg-gray-50 p-4 space-y-4'>
                      {test.testDetails.map((detail, idx) => (
                        <div key={detail.id} className='space-y-2'>
                          {idx > 0 && (
                            <div className='border-t border-gray-200 pt-4' />
                          )}
                          <h4 className='font-semibold text-sm'>
                            Detail {idx + 1}
                          </h4>
                          <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                Specimen Type
                              </p>
                              <p>{detail.specimenType}</p>
                            </div>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                Component
                              </p>
                              <p>{detail.component}</p>
                            </div>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                Method
                              </p>
                              <p>{detail.method}</p>
                            </div>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                CPT Code
                              </p>
                              <p>{detail.cptCode}</p>
                            </div>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                Testing Location
                              </p>
                              <p>{detail.testingLocatiion}</p>
                            </div>
                            <div>
                              <p className='font-medium text-muted-foreground'>
                                Turnaround
                              </p>
                              <p>{detail.turnaround} day(s)</p>
                            </div>
                            {detail.collectionMethod && (
                              <div>
                                <p className='font-medium text-muted-foreground'>
                                  Collection Method
                                </p>
                                <p>{detail.collectionMethod}</p>
                              </div>
                            )}
                            {detail.resultsDelivery && (
                              <div>
                                <p className='font-medium text-muted-foreground'>
                                  Results Delivery
                                </p>
                                <p>{detail.resultsDelivery}</p>
                              </div>
                            )}
                          </div>

                          {detail.collectionNotes && (
                            <div>
                              <p className='font-medium text-sm text-muted-foreground'>
                                Collection Notes
                              </p>
                              <p className='text-sm'>
                                {detail.collectionNotes}
                              </p>
                            </div>
                          )}

                          {detail.clinicalUtility && (
                            <div>
                              <p className='font-medium text-sm text-muted-foreground'>
                                Clinical Utility
                              </p>
                              <p className='text-sm'>
                                {detail.clinicalUtility}
                              </p>
                            </div>
                          )}

                          {detail.temperatures &&
                            Array.isArray(detail.temperatures) &&
                            detail.temperatures.length > 0 && (
                              <div>
                                <p className='font-medium text-sm text-muted-foreground'>
                                  Storage Temperatures
                                </p>
                                <p className='text-sm'>
                                  {detail.temperatures.join(", ")}
                                </p>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
