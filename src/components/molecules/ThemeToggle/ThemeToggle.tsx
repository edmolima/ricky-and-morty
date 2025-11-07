'use client';

import { Button, MoonIcon, SunIcon } from '@/components/atoms';
import { useTheme } from '@/hooks';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" className={styles.toggle} disabled aria-label="Loading theme">
        <div className={styles.placeholder} />
      </Button>
    );
  }

  const isDark = theme === 'dark';
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;

  return (
    <Button onClick={toggleTheme} variant="ghost" className={styles.toggle} aria-label={label}>
      <SunIcon className={`${styles.sun} ${isDark ? styles.hidden : ''}`} />
      <MoonIcon className={`${styles.moon} ${isDark ? '' : styles.hidden}`} />
    </Button>
  );
};