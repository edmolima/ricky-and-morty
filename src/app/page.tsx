'use client';

import { CharacterTable, LocationChart, SearchInput, Spinner, ThemeToggle } from '@/components';
import { useCharactersByLocation, useInfiniteScroll, useSearchCharacters } from '@/hooks';
import { Suspense } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { data, loading, error, hasNextPage, fetchNextPage, search, setSearch } = useSearchCharacters();
  const { data: locations, loading: locationsLoading } = useCharactersByLocation({ limit: 10 });

  const sentinelRef = useInfiniteScroll<HTMLTableRowElement>({
    hasNextPage,
    isLoading: loading,
    onLoadMore: fetchNextPage,
    rootMargin: '300px',
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Rick and Morty Dashboard</h1>
            <p className={styles.subtitle}>Explore characters and locations from the multiverse</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Locations</h2>
          </div>
          <Suspense
            fallback={
              <div className={styles.loadingContainer}>
                <Spinner />
              </div>
            }
          >
            {locationsLoading ? (
              <div className={styles.loadingContainer}>
                <Spinner />
              </div>
            ) : (
              <LocationChart data={locations} />
            )}
          </Suspense>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Characters</h2>
          </div>

          {error ? (
            <div className={styles.error}>
              <p>Failed to load characters: {error.message}</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className={styles.loadingContainer}>
                  <Spinner label="Loading characters..." />
                </div>
              }
            >
              <div className={styles.searchSection}>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch('')}
                  placeholder="Search characters..."
                />

                <div className={styles.searchMeta}>
                  <span className={styles.searchCount}>{data.length} characters loaded</span>
                </div>
              </div>

              <CharacterTable characters={data} sentinelRef={hasNextPage ? sentinelRef : undefined} />

              {loading && (
                <div className={styles.loadingContainer}>
                  <Spinner label="Loading more characters..." />
                </div>
              )}
            </Suspense>
          )}
        </section>
      </main>
    </div>
  );
}