import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Filter, X, Calendar as CalendarIcon, Search } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
  activeFilters: FilterState
}

export interface FilterState {
  status: string
  assignedTo: string
  dateRange: { from: Date | null; to: Date | null }
  searchTerm: string
}

export function FilterPanel({ onFilterChange, activeFilters }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      status: '',
      assignedTo: '',
      dateRange: { from: null, to: null },
      searchTerm: ''
    }
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = localFilters.status || localFilters.assignedTo || 
    localFilters.dateRange.from || localFilters.searchTerm

  return (
    <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Analytics
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={localFilters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10 backdrop-blur-sm bg-background/80"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="backdrop-blur-sm bg-background/80">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assigned To Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Assigned To</label>
          <Select
            value={localFilters.assignedTo}
            onValueChange={(value) => updateFilter('assignedTo', value)}
          >
            <SelectTrigger className="backdrop-blur-sm bg-background/80">
              <SelectValue placeholder="All assignments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignments</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left backdrop-blur-sm bg-background/80"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localFilters.dateRange.from ? (
                  localFilters.dateRange.to ? (
                    <>
                      {format(localFilters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(localFilters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(localFilters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 backdrop-blur-md bg-card/95" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={localFilters.dateRange.from || undefined}
                selected={{
                  from: localFilters.dateRange.from || undefined,
                  to: localFilters.dateRange.to || undefined,
                }}
                onSelect={(range) => 
                  updateFilter('dateRange', {
                    from: range?.from || null,
                    to: range?.to || null,
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {localFilters.status && (
                <Badge variant="secondary" className="backdrop-blur-sm bg-primary/20">
                  Status: {localFilters.status}
                </Badge>
              )}
              {localFilters.assignedTo && (
                <Badge variant="secondary" className="backdrop-blur-sm bg-primary/20">
                  Assigned: {localFilters.assignedTo}
                </Badge>
              )}
              {localFilters.dateRange.from && (
                <Badge variant="secondary" className="backdrop-blur-sm bg-primary/20">
                  Date Range Applied
                </Badge>
              )}
              {localFilters.searchTerm && (
                <Badge variant="secondary" className="backdrop-blur-sm bg-primary/20">
                  Search: {localFilters.searchTerm}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}