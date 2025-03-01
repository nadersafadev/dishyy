'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export type SortOption = {
  value: string;
  label: string;
};

export type SelectFieldProps<T> = {
  label?: string;
  placeholder?: string;
  items: T[];
  selectedItems: T[];
  value: string[];
  onChange: (value: string[]) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  getItemDescription?: (item: T) => string | undefined;
  getBadgeText?: (item: T) => string | undefined;
  onSelectItem: (item: T) => void;

  // Create new item with dialog approach
  showCreateOption?: boolean;
  dialogContent?: React.ReactNode;
  dialogTriggerButtonLabel?: string;
  onDialogOpenChange?: (open: boolean) => void;

  // Sort options - now optional
  showSortOption?: boolean;
  sortOptions?: SortOption[];
  defaultSortOption?: string;

  // Search functionality - now optional
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];

  noItemsFoundText?: string;
  isLoading?: boolean;
  loadingText?: string;
  selectionDisplayText?: (count: number) => string;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
};

export function SelectField<T>({
  label,
  placeholder = 'Select items...',
  items,
  selectedItems,
  value,
  onChange,
  getItemId,
  getItemLabel,
  getItemDescription,
  getBadgeText,
  onSelectItem,

  // Create new item options
  showCreateOption = false,
  dialogContent,
  dialogTriggerButtonLabel = 'Create New Item',
  onDialogOpenChange,

  // Sort options
  showSortOption = false,
  sortOptions,
  defaultSortOption,

  // Search options
  showSearch = true,
  searchPlaceholder = 'Search items...',
  searchKeys = ['name' as keyof T],

  noItemsFoundText = 'No items found.',
  isLoading = false,
  loadingText = 'Loading...',
  selectionDisplayText = count =>
    `${count} item${count === 1 ? '' : 's'} selected`,
  renderItem,
  className,
}: SelectFieldProps<T>) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>(defaultSortOption || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Debug logs
  console.log('SelectField props:', {
    showSearch,
    showSortOption,
    hasSortOptions: sortOptions && sortOptions.length > 0,
    defaultSortOption,
    currentSortOption: sortOption,
  });

  // Handle dialog open change
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (onDialogOpenChange) {
      onDialogOpenChange(open);
    }
  };

  // Ensure items is an array
  const itemsArray = Array.isArray(items) ? items : [];

  // Filter and sort items based on search query and sort option
  const filteredAndSortedItems = itemsArray
    .filter(item => {
      if (!showSearch || !searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    })
    .sort((a, b) => {
      // Only apply sorting if a sort option is selected and sort is enabled
      if (!sortOption || !showSortOption) return 0;

      // Parse the sort option (format: "field-direction")
      const parts = sortOption.split('-');
      if (parts.length !== 2) return 0;

      const field = parts[0];
      const direction = parts[1];

      // Special case for popularity sorting (uses _count.parties)
      if (field === 'popular') {
        // Type assertion to access _count property
        const aPopularity = (a as any)._count?.parties || 0;
        const bPopularity = (b as any)._count?.parties || 0;

        return direction === 'asc'
          ? aPopularity - bPopularity
          : bPopularity - aPopularity;
      }

      // Regular field sorting
      const aValue = (a as any)[field];
      const bValue = (b as any)[field];

      // Skip sorting if either value is undefined
      if (aValue === undefined || bValue === undefined) return 0;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Default: no change in order
      return 0;
    });

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium mb-2 block">{label}</Label>
      )}
      <div className="space-y-4">
        <Popover open={commandOpen} onOpenChange={setCommandOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between border-input bg-background text-sm font-normal hover:border-primary hover:bg-background text-muted-foreground hover:text-foreground"
            >
              {selectedItems.length > 0
                ? selectionDisplayText(selectedItems.length)
                : placeholder}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <div className="flex items-center gap-2 p-2 border-b">
                {showSearch && (
                  <div
                    className={`${showSortOption && sortOptions && sortOptions.length > 0 ? 'flex-1' : 'w-full'}`}
                  >
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                  </div>
                )}
                {showSortOption && sortOptions && sortOptions.length > 0 && (
                  <Select
                    value={sortOption}
                    onValueChange={value => setSortOption(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <CommandEmpty>
                <p className="p-2 text-sm text-center text-muted-foreground">
                  {noItemsFoundText}
                </p>
              </CommandEmpty>
              <CommandGroup className="max-h-[250px] overflow-y-auto">
                {showCreateOption && dialogContent && (
                  <>
                    <div className="p-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          setCommandOpen(false);
                          handleDialogOpenChange(true);
                        }}
                      >
                        <span className="flex items-center justify-center h-5 w-5">
                          +
                        </span>
                        {dialogTriggerButtonLabel}
                      </Button>
                    </div>
                    <CommandSeparator />
                  </>
                )}
                {isLoading ? (
                  <CommandItem disabled>{loadingText}</CommandItem>
                ) : (
                  <>
                    {filteredAndSortedItems.map(item => {
                      const id = getItemId(item);
                      const isSelected = value.includes(id);

                      if (renderItem) {
                        return (
                          <CommandItem
                            key={id}
                            onSelect={() => {
                              if (!isSelected) {
                                onSelectItem(item);
                                // Add to selection if using direct control
                                onChange([...value, id]);
                              }
                            }}
                            disabled={isSelected}
                          >
                            {renderItem(item)}
                          </CommandItem>
                        );
                      }

                      return (
                        <CommandItem
                          key={id}
                          onSelect={() => {
                            if (!isSelected) {
                              onSelectItem(item);
                              // Add to selection if using direct control
                              onChange([...value, id]);
                            }
                          }}
                          disabled={isSelected}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span>{getItemLabel(item)}</span>
                            {getItemDescription && getItemDescription(item) && (
                              <span className="ml-2 text-muted-foreground">
                                - {getItemDescription(item)}
                              </span>
                            )}
                          </div>
                          {getBadgeText && getBadgeText(item) && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-md bg-muted">
                              {getBadgeText(item)}
                            </span>
                          )}
                        </CommandItem>
                      );
                    })}
                  </>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Dialog for custom content */}
        {dialogContent && (
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent>{dialogContent}</DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
