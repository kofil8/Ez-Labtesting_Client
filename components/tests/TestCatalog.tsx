'use client'

import { useState, useEffect } from 'react'
import { searchTests } from '@/lib/api'
import { Test } from '@/types/test'
import { TestGrid } from './TestGrid'
import { TestFilters } from './TestFilters'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

export function TestCatalog() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    loadTests()
  }, [searchQuery, category, sortBy])

  const loadTests = async () => {
    setLoading(true)
    try {
      const results = await searchTests(searchQuery, category, sortBy)
      setTests(results)
    } catch (error) {
      console.error('Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="turnaround">Fastest Turnaround</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <TestFilters
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
        </div>
        
        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="text-muted-foreground mt-4 text-sm">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No tests found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {tests.length} {tests.length === 1 ? 'test' : 'tests'} found
                </p>
              </div>
              <TestGrid tests={tests} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

