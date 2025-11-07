import { TableCell } from '@/components/atoms';
import type { Character } from '@/lib/apollo';
import Image from 'next/image';
import type { RefObject } from 'react';
import styles from './CharacterTable.module.css';

export type CharacterTableProps = {
  characters: Character[];
  sentinelRef?: RefObject<HTMLTableRowElement | null>;
};

const COLUMNS = ['Avatar', 'Name', 'Status', 'Species', 'Location'] as const;

export const CharacterTable = ({ characters, sentinelRef }: CharacterTableProps) => {
  const isEmpty = characters.length === 0;
  if (isEmpty) return null;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className={styles.th}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {characters.map((character) => (
            <tr key={character.id} className={styles.row}>
              <TableCell>
                <div className={styles.mobileLabel}>Avatar</div>
                <Image
                  src={character.image}
                  alt={character.name}
                  width={80}
                  height={80}
                  className={styles.avatar}
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </TableCell>
              <TableCell>
                <div className={styles.mobileLabel}>Name</div>
                <div className={styles.cellContent}>{character.name}</div>
              </TableCell>
              <TableCell>
                <div className={styles.mobileLabel}>Status</div>
                <div className={styles.cellContent}>{character.status}</div>
              </TableCell>
              <TableCell>
                <div className={styles.mobileLabel}>Species</div>
                <div className={styles.cellContent}>{character.species}</div>
              </TableCell>
              <TableCell>
                <div className={styles.mobileLabel}>Location</div>
                <div className={styles.cellContent}>{character.location?.name || 'Unknown'}</div>
              </TableCell>
            </tr>
          ))}
          {sentinelRef && (
            <tr ref={sentinelRef} aria-hidden="true" className={styles.sentinel}>
              <TableCell colSpan={COLUMNS.length} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
