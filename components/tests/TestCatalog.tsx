'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchTests } from '@/lib/api'
import { Test } from '@/types/test'
import { TestGrid } from './TestGrid'
import { TestFilters } from './TestFilters'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 10

export function TestCatalog() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const loadTests = useCallback(async () => {
    setLoading(true)
    try {
      const results = await searchTests(searchQuery, category, sortBy)
      setTests(results)
    } catch (error) {
      console.error('Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, sortBy])

  useEffect(() => {
    loadTests()
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [loadTests])

  // Pagination calculations
  const totalPages = Math.ceil(tests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTests = tests.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <Button
          variant="outline"
          size="default"
          onClick={() => setShowFilters(!showFilters)}
          className="h-10 gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
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
      <div className={`grid grid-cols-1 gap-6 ${showFilters ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
        {/* Filters */}
        {showFilters && (
          <div className="lg:col-span-1">
            <TestFilters
              selectedCategory={category}
              onCategoryChange={setCategory}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}
        
        {/* Results */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-1'}>
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
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
              <TestGrid tests={paginatedTests} fullWidth={!showFilters} />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      
                      const showEllipsis = 
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                      
                      if (showEllipsis) {
                        return (
                          <span key={page} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      
                      if (!showPage) return null
                      
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

