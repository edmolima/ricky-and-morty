import { useDeferredValue, useState } from 'react';
import { useCharacters, type UseCharactersOutput } from '../useCharacters/useCharacters';

type UseSearchCharactersOutput = UseCharactersOutput & {
  search: string;
  setSearch: (value: string) => void;
  isSearching: boolean;
  isEmpty: boolean;
  hasNoResults: boolean;
};

const hasValidSearch = (search: string) => search.trim().length > 0;

export const useSearchCharacters = (): UseSearchCharactersOutput => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const hasSearch = hasValidSearch(deferredSearch);
  const query = useCharacters({ searchName: hasSearch ? deferredSearch : undefined });

  const hasNoResults = hasSearch && query.data.length === 0 && !query.loading;

  return {
    ...query,
    search,
    setSearch,
    isSearching: search !== deferredSearch,
    isEmpty: !hasSearch,
    hasNoResults,
  };
};