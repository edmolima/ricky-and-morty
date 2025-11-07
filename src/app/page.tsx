'use client';

import { ThemeToggle } from '../components/molecules/ThemeToggle';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header>
        <ThemeToggle />
      </header>
    </div>
  );
}