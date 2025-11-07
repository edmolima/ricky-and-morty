import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.css';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
};

export const Button = ({ type = 'button', variant = 'secondary', size = 'medium', className, ...props }: ButtonProps) => {
  const variantClass = variant ? styles[variant] : '';
  const sizeClass = size && size !== 'medium' ? styles[size] : '';
  const classes = [styles.button, variantClass, sizeClass, className].filter(Boolean).join(' ');

  return <button type={type} className={classes} {...props} />;
};