'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Test } from '@/types/test'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TestEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  test: Test | null
  onSave: (test: Test) => void
}

export function TestEditDialog({ open, onOpenChange, test, onSave }: TestEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Test>({
    defaultValues: {
      enabled: true,
      category: 'general',
    },
  })

  useEffect(() => {
    if (test) {
      reset(test)
    } else {
      reset({
        name: '',
        description: '',
        category: 'general',
        price: 0,
        cptCodes: [],
        labCode: '',
        labName: 'CPL',
        turnaroundDays: 1,
        sampleType: 'Blood',
        preparation: '',
        enabled: true,
      } as Partial<Test> as Test)
    }
  }, [test, reset])

  const onSubmit = (data: Test) => {
    // Parse CPT codes from comma-separated string
    if (typeof data.cptCodes === 'string') {
      data.cptCodes = (data.cptCodes as any).split(',').map((c: string) => c.trim())
    }
    onSave(data)
  }

  const category = watch('category')
  const enabled = watch('enabled')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{test ? 'Edit Test' : 'Add New Test'}</DialogTitle>
          <DialogDescription>
            {test ? 'Update test information' : 'Create a new lab test'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Test Name *</Label>
              <Input id="name" {...register('name', { required: true })} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => setValue('category', value as Test['category'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Health</SelectItem>
                  <SelectItem value="hormone">Hormone</SelectItem>
                  <SelectItem value="std">STD Screening</SelectItem>
                  <SelectItem value="thyroid">Thyroid</SelectItem>
                  <SelectItem value="cardiac">Cardiac</SelectItem>
                  <SelectItem value="metabolic">Metabolic</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: true, valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="labName">Lab Name *</Label>
              <Select
                value={watch('labName')}
                onValueChange={(value) => setValue('labName', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPL">CPL</SelectItem>
                  <SelectItem value="ACCESS">ACCESS</SelectItem>
                  <SelectItem value="Quest">Quest</SelectItem>
                  <SelectItem value="LabCorp">LabCorp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="labCode">Lab Code *</Label>
              <Input id="labCode" {...register('labCode', { required: true })} />
            </div>

            <div>
              <Label htmlFor="cptCodes">CPT Codes (comma-separated) *</Label>
              <Input
                id="cptCodes"
                {...register('cptCodes', { required: true })}
                placeholder="85025, 80053"
              />
            </div>

            <div>
              <Label htmlFor="turnaroundDays">Turnaround (days) *</Label>
              <Input
                id="turnaroundDays"
                type="number"
                {...register('turnaroundDays', { required: true, valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="sampleType">Sample Type *</Label>
              <Input id="sampleType" {...register('sampleType', { required: true })} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="preparation">Preparation Instructions</Label>
              <Input id="preparation" {...register('preparation')} />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => setValue('enabled', checked as boolean)}
              />
              <Label htmlFor="enabled" className="font-normal cursor-pointer">
                Test is active and available for purchase
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {test ? 'Update' : 'Create'} Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

