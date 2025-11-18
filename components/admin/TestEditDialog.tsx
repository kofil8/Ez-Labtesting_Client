'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Test } from '@/types/test'
import { Upload, X } from 'lucide-react'
// import { uploadImageToAzureBlob } from '@/lib/azure-blob' // Uncomment when Azure Blob is configured
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

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (test) {
      reset({
        ...test,
        cptCodes: Array.isArray(test.cptCodes) 
          ? test.cptCodes.join(', ') 
          : test.cptCodes || '',
        keywords: Array.isArray(test.keywords)
          ? test.keywords.join(', ')
          : test.keywords || '',
      })
      // Set preview if existing image
      if (test.image) {
        setImagePreview(test.image)
      } else {
        setImagePreview(null)
      }
    } else {
      reset({
        name: '',
        description: '',
        category: 'general',
        price: 0,
        cptCodes: '',
        labCode: '',
        labName: 'CPL',
        turnaroundDays: 1,
        sampleType: 'Blood',
        preparation: '',
        keywords: '',
        image: '',
        fastingRequired: false,
        fastingHours: undefined,
        ageRequirement: '',
        sampleVolume: '',
        tubeType: '',
        collectionMethod: '',
        resultsTimeframe: '',
        enabled: true,
      } as Partial<Test> as Test)
      setImagePreview(null)
    }
    setSelectedImageFile(null)
  }, [test, reset])

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setSelectedImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImageFile(null)
    setImagePreview(null)
    setValue('image', '')
  }

  const onSubmit = async (data: any) => {
    // Parse CPT codes from comma-separated string
    if (typeof data.cptCodes === 'string') {
      data.cptCodes = data.cptCodes.split(',').map((c: string) => c.trim()).filter(Boolean)
    }
    
    // Parse keywords from comma-separated string
    if (typeof data.keywords === 'string' && data.keywords.trim()) {
      data.keywords = data.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    } else if (!data.keywords) {
      data.keywords = []
    }
    
    // Handle image upload
    if (selectedImageFile) {
      try {
        // TODO: Uncomment when Azure Blob Storage is configured
        // const imageUrl = await uploadImageToAzureBlob(selectedImageFile)
        // data.image = imageUrl
        
        // Temporary: For now, keep existing image if editing
        // When Azure Blob is configured, upload the new file and use the returned URL
        if (test?.image) {
          // Keep existing image URL - new upload will replace it after Azure integration
          data.image = test.image
        } else {
          // Placeholder - will be replaced with Azure Blob URL
          // For now, we'll need to handle this on the backend or use a temporary storage
          data.image = undefined
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        // Keep existing image if upload fails
        if (test?.image) {
          data.image = test.image
        } else {
          data.image = undefined
        }
      }
    } else if (!data.image || data.image === '') {
      data.image = undefined
    }
    
    // Convert empty strings to undefined for optional fields
    if (data.preparation === '') data.preparation = undefined
    if (data.ageRequirement === '') data.ageRequirement = undefined
    if (data.sampleVolume === '') data.sampleVolume = undefined
    if (data.tubeType === '') data.tubeType = undefined
    if (data.collectionMethod === '') data.collectionMethod = undefined
    if (data.resultsTimeframe === '') data.resultsTimeframe = undefined
    if (data.fastingHours === '' || data.fastingHours === null) data.fastingHours = undefined
    
    onSave(data as Test)
  }

  const category = watch('category')
  const enabled = watch('enabled')
  const fastingRequired = watch('fastingRequired')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

            <div className="col-span-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                {...register('keywords')}
                placeholder="blood, anemia, infection, complete"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for search functionality
              </p>
            </div>

            <div className="col-span-2">
              <Label htmlFor="image">Test Image</Label>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border-2 border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
                {selectedImageFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedImageFile.name} ({(selectedImageFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                {test?.image && !selectedImageFile && (
                  <p className="text-xs text-muted-foreground">
                    Current image: {test.image}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-2 border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Fasting Requirements</h3>
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="fastingRequired"
                  checked={fastingRequired}
                  onCheckedChange={(checked) => setValue('fastingRequired', checked as boolean)}
                />
                <Label htmlFor="fastingRequired" className="font-normal cursor-pointer">
                  Fasting required
                </Label>
              </div>
              {fastingRequired && (
                <div>
                  <Label htmlFor="fastingHours">Fasting Hours</Label>
                  <Input
                    id="fastingHours"
                    type="number"
                    min="1"
                    {...register('fastingHours', { valueAsNumber: true })}
                    placeholder="8"
                  />
                </div>
              )}
            </div>

            <div className="col-span-2 border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Additional Details</h3>
            </div>

            <div>
              <Label htmlFor="ageRequirement">Age Requirement</Label>
              <Input
                id="ageRequirement"
                {...register('ageRequirement')}
                placeholder="18+"
              />
            </div>

            <div>
              <Label htmlFor="sampleVolume">Sample Volume</Label>
              <Input
                id="sampleVolume"
                {...register('sampleVolume')}
                placeholder="Serum 0.5mL (no gel)"
              />
            </div>

            <div>
              <Label htmlFor="tubeType">Tube Type</Label>
              <Input
                id="tubeType"
                {...register('tubeType')}
                placeholder="1 SST"
              />
            </div>

            <div>
              <Label htmlFor="collectionMethod">Collection Method</Label>
              <Input
                id="collectionMethod"
                {...register('collectionMethod')}
                placeholder="In person at a Lab location"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="resultsTimeframe">Results Timeframe</Label>
              <Input
                id="resultsTimeframe"
                {...register('resultsTimeframe')}
                placeholder="1-2 days from sample arrival at our lab"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2 border-t pt-4">
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

