import type { ComponentPropsWithoutRef } from 'react';
import styles from './Input.module.css';

export type InputProps = ComponentPropsWithoutRef<'input'>;

export const Input = ({ type = 'text', className, ...props }: InputProps) => {
  const classes = [styles.input, className].filter(Boolean).join(' ');
  return <input type={type} className={classes} {...props} />;
};