import { memo, type ComponentPropsWithoutRef } from 'react';
import styles from './Spinner.module.css';

type SpinnerProps = ComponentPropsWithoutRef<'div'> & {
  label?: string;
  size?: 'small' | 'medium' | 'large';
};

const SpinnerComponent = ({ label = 'Loading...', size = 'medium', className, ...props }: SpinnerProps) => {
  const sizeClass = size && size !== 'medium' ? styles[size] : '';
  const classes = [styles.spinner, sizeClass, className].filter(Boolean).join(' ');

  return (
    <div role="status" aria-live="polite" className={classes} {...props}>
      <div className={styles.spinnerIcon} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export const Spinner = memo(SpinnerComponent);