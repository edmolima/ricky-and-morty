import { memo, type ComponentPropsWithoutRef } from 'react';
import styles from './TableCell.module.css';

type TableCellProps = ComponentPropsWithoutRef<'td'>;

const TableCellComponent = ({ children, className, ...props }: TableCellProps) => {
  const classes = [styles.cell, className].filter(Boolean).join(' ');
  return <td className={classes} {...props}>{children}</td>;
};

export const TableCell = memo(TableCellComponent);