'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface TestFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'all', name: 'All Tests' },
  { id: 'general', name: 'General Health' },
  { id: 'hormone', name: 'Hormone' },
  { id: 'std', name: 'STD Screening' },
  { id: 'thyroid', name: 'Thyroid' },
  { id: 'cardiac', name: 'Cardiac' },
  { id: 'metabolic', name: 'Metabolic' },
  { id: 'nutrition', name: 'Nutrition' },
]

export function TestFilters({ selectedCategory, onCategoryChange }: TestFiltersProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
            Category
          </Label>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange} className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={category.id} className="h-4 w-4" />
                <Label
                  htmlFor={category.id}
                  className="flex-1 cursor-pointer text-sm font-normal py-1.5 px-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

