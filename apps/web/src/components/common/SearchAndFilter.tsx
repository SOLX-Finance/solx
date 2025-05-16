import { useEffect, useState, useRef, useCallback } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export type SortOption = 'newest' | 'price-low' | 'price-high';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filterBy?: string;
  onFilterChange?: (filter: string) => void;
  filterOptions?: { value: string; label: string }[];
  className?: string;
}

export const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  filterOptions = [],
  className,
}: SearchAndFilterProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (searchQuery !== inputValue && !inputRef.current?.matches(':focus')) {
      setInputValue(searchQuery);
    }
  }, [searchQuery, inputValue]);

  useEffect(() => {
    if (!isFirstRender.current && debouncedSearchTerm !== searchQuery) {
      onSearchChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchChange, searchQuery]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  return (
    <div
      className={`flex items-center max-md:flex-col gap-[10px] ${className || ''}`}
    >
      <Input
        ref={inputRef}
        className="rounded-[30px] md:w-[600px]"
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="md:w-[260px] rounded-[30px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
      {filterOptions.length > 0 && onFilterChange && (
        <Select value={filterBy} onValueChange={onFilterChange}>
          <SelectTrigger className="md:w-[180px] rounded-[30px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SearchAndFilter;
