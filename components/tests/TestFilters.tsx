'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface TestFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'all', name: 'All Tests', icon: '🔬' },
  { id: 'general', name: 'General Health', icon: '🏥' },
  { id: 'hormone', name: 'Hormone', icon: '⚖️' },
  { id: 'std', name: 'STD Screening', icon: '🔒' },
  { id: 'thyroid', name: 'Thyroid', icon: '🦋' },
  { id: 'cardiac', name: 'Cardiac', icon: '❤️' },
  { id: 'metabolic', name: 'Metabolic', icon: '🔥' },
  { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
]

export function TestFilters({ selectedCategory, onCategoryChange }: TestFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value={category.id} id={category.id} />
              <Label
                htmlFor={category.id}
                className="flex items-center cursor-pointer font-normal"
              >
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

