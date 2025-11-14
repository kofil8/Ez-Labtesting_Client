'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'

interface TestFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onClose?: () => void
}

const categories = [
  { id: 'all', name: 'All Tests', icon: '🔬' },
  { id: 'general', name: 'General Health', icon: '❤️' },
  { id: 'hormone', name: 'Hormone', icon: '⚡' },
  { id: 'std', name: 'STD Screening', icon: '🛡️' },
  { id: 'thyroid', name: 'Thyroid', icon: '🦋' },
  { id: 'cardiac', name: 'Cardiac', icon: '💓' },
  { id: 'metabolic', name: 'Metabolic', icon: '🔥' },
  { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
]

export function TestFilters({ selectedCategory, onCategoryChange, onClose }: TestFiltersProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold uppercase tracking-wider">
              Category
            </Label>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange} className="space-y-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-accent/50 border border-transparent'
              }`}
            >
              <RadioGroupItem value={category.id} id={category.id} className="h-4 w-4" />
              <Label
                htmlFor={category.id}
                className="flex items-center gap-2 flex-1 cursor-pointer text-sm font-medium"
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

