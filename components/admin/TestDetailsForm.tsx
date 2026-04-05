"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseTurnaroundInput } from "@/lib/test-utils";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export type TestDetailInput = {
  id?: string;
  turnaround?: number | string;
  component: string;
  method: string;
  collectionNotes?: string;
  clinicalUtility?: string;
  cptCode: string;
  testingLocatiion: string;
  temperatures?: string;
  collectionMethod?: string;
  resultsDelivery?: string;
};

interface TestDetailsFormProps {
  value: TestDetailInput[];
  onChange: (details: TestDetailInput[]) => void;
}

const emptyDetail: TestDetailInput = {
  turnaround: 1,
  component: "",
  method: "",
  collectionNotes: "",
  clinicalUtility: "",
  cptCode: "",
  testingLocatiion: "",
  temperatures: "[]",
  collectionMethod: "",
  resultsDelivery: "",
};

export function TestDetailsForm({ value, onChange }: TestDetailsFormProps) {
  const [details, setDetails] = useState<TestDetailInput[]>(value);

  useEffect(() => {
    setDetails(value);
  }, [value]);

  const handleAdd = () => {
    // Only allow one detail
    if (details.length === 0) {
      const newDetails = [{ ...emptyDetail }];
      setDetails(newDetails);
      onChange(newDetails);
    }
  };

  const handleRemove = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
    onChange(newDetails);
  };

  const handleChange = (
    index: number,
    field: keyof TestDetailInput,
    val: string | number,
  ) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: val };
    setDetails(newDetails);
    onChange(newDetails);
  };

  return (
    <div className='space-y-4'>
      {details.length === 0 ? (
        <div>
          <Button
            type='button'
            onClick={handleAdd}
            size='sm'
            variant='outline'
            className='mb-3'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Detail
          </Button>
          <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              No test details added. This section is optional.
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Click "Add Detail" above to add specifications.
            </p>
          </div>
        </div>
      ) : null}

      {details.map((detail, index) => (
        <div
          key={index}
          className='space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4'
        >
          <div className='flex items-center justify-end'>
            <Button
              type='button'
              onClick={() => handleRemove(index)}
              size='sm'
              variant='ghost'
              className='h-8 text-destructive hover:bg-destructive/10 hover:text-destructive'
            >
              <Trash2 className='h-4 w-4 mr-1' />
              Remove
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {/* Component */}
            <div>
              <Label htmlFor={`component-${index}`}>
                Component <span className='text-destructive'>*</span>
              </Label>
              <Input
                id={`component-${index}`}
                value={detail.component || ""}
                onChange={(e) =>
                  handleChange(index, "component", e.target.value)
                }
                placeholder='e.g., Serum, Plasma'
                required
              />
            </div>

            {/* Method */}
            <div>
              <Label htmlFor={`method-${index}`}>
                Method <span className='text-destructive'>*</span>
              </Label>
              <Input
                id={`method-${index}`}
                value={detail.method || ""}
                onChange={(e) => handleChange(index, "method", e.target.value)}
                placeholder='e.g., Immunoassay, PCR'
                required
              />
            </div>

            {/* CPT Code */}
            <div>
              <Label htmlFor={`cptCode-${index}`}>
                CPT Code <span className='text-destructive'>*</span>
              </Label>
              <Input
                id={`cptCode-${index}`}
                value={detail.cptCode || ""}
                onChange={(e) => handleChange(index, "cptCode", e.target.value)}
                placeholder='e.g., 80053'
                required
              />
            </div>

            {/* Testing Location */}
            <div>
              <Label htmlFor={`testingLocatiion-${index}`}>
                Testing Location <span className='text-destructive'>*</span>
              </Label>
              <Input
                id={`testingLocatiion-${index}`}
                value={detail.testingLocatiion || ""}
                onChange={(e) =>
                  handleChange(index, "testingLocatiion", e.target.value)
                }
                placeholder='e.g., ACCESS Lab Main'
                required
              />
            </div>

            {/* Turnaround Time */}
            <div>
              <Label htmlFor={`turnaround-${index}`}>Turnaround Time</Label>
              <Input
                id={`turnaround-${index}`}
                type='text'
                value={detail.turnaround || ""}
                onChange={(e) =>
                  handleChange(index, "turnaround", e.target.value)
                }
                placeholder='e.g., 24h, 1-2 days'
              />
              {detail.turnaround &&
                (() => {
                  const parsed = parseTurnaroundInput(detail.turnaround);
                  if (parsed) {
                    return (
                      <p className='text-xs text-muted-foreground mt-1'>
                        {parsed.displayFormat}
                      </p>
                    );
                  }
                  return null;
                })()}
            </div>

            {/* Collection Method */}
            <div>
              <Label htmlFor={`collectionMethod-${index}`}>
                Collection Method
              </Label>
              <Input
                id={`collectionMethod-${index}`}
                value={detail.collectionMethod || ""}
                onChange={(e) =>
                  handleChange(index, "collectionMethod", e.target.value)
                }
                placeholder='e.g., Venipuncture'
              />
            </div>

            {/* Results Delivery */}
            <div>
              <Label htmlFor={`resultsDelivery-${index}`}>
                Results Delivery
              </Label>
              <Input
                id={`resultsDelivery-${index}`}
                value={detail.resultsDelivery || ""}
                onChange={(e) =>
                  handleChange(index, "resultsDelivery", e.target.value)
                }
                placeholder='e.g., Online portal, Email'
              />
            </div>
          </div>

          {/* Collection Notes */}
          <div>
            <Label htmlFor={`collectionNotes-${index}`}>Collection Notes</Label>
            <Textarea
              id={`collectionNotes-${index}`}
              value={detail.collectionNotes || ""}
              onChange={(e) =>
                handleChange(index, "collectionNotes", e.target.value)
              }
              placeholder='Special instructions for sample collection...'
              rows={2}
            />
          </div>

          {/* Clinical Utility */}
          <div>
            <Label htmlFor={`clinicalUtility-${index}`}>Clinical Utility</Label>
            <Textarea
              id={`clinicalUtility-${index}`}
              value={detail.clinicalUtility || ""}
              onChange={(e) =>
                handleChange(index, "clinicalUtility", e.target.value)
              }
              placeholder='What this test is used for clinically...'
              rows={2}
            />
          </div>

          {/* Temperatures (JSON) */}
          <div>
            <Label htmlFor={`temperatures-${index}`}>
              Storage Temperatures (JSON)
            </Label>
            <Input
              id={`temperatures-${index}`}
              value={detail.temperatures || "[]"}
              onChange={(e) =>
                handleChange(index, "temperatures", e.target.value)
              }
              placeholder='["2-8°C", "Room temp"]'
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              Enter valid JSON array, e.g., ["2-8°C", "Room temp"]
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
