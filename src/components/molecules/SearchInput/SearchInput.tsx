import { Button, Input } from '@/components/atoms';
import styles from './SearchInput.module.css';

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
};

export const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...' }: SearchInputProps) => {
  const hasValue = value.length > 0;

  return (
    <div className={styles.searchInput}>
      <div className={styles.inputWrapper}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          style={{ paddingRight: hasValue ? '80px' : undefined }}
        />
        {hasValue && (
          <Button
            onClick={onClear}
            aria-label="Clear search"
            variant="ghost"
            size="small"
            className={styles.clearButton}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};