import { Search } from 'lucide-react';
import { Input } from './input';
import { memo } from 'react';

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  onSearchChange: (value: string) => void;
}

const SearchInput = memo(({ onSearchChange, ...props }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-10"
        onChange={e => onSearchChange(e.target.value)}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export { SearchInput };
