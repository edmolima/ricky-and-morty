import { TableCell } from '@/components/atoms';
import type { ReactNode } from 'react';

type CellData = {
  id: string;
  content: ReactNode;
};

type TableRowProps = {
  cells: CellData[];
};

export const TableRow = ({ cells }: TableRowProps) => {
  return (
    <tr>
      {cells.map((cell) => (
        <TableCell key={cell.id}>{cell.content}</TableCell>
      ))}
    </tr>
  );
};