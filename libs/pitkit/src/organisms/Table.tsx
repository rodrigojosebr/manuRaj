'use client';

import { ReactNode } from 'react';
import { css } from '../../../../styled-system/css';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={css({
        width: '100%',
        overflowX: 'auto',
        border: '1px solid',
        borderColor: 'gray.200',
        borderRadius: 'lg',
      })}
    >
      <table
        className={`${css({
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'sm',
        })} ${className || ''}`}
      >
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead
      className={css({
        backgroundColor: 'gray.50',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
      })}
    >
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`${css({
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        _hover: onClick
          ? {
              backgroundColor: 'gray.50',
              cursor: 'pointer',
            }
          : {},
        _last: {
          borderBottom: 'none',
        },
      })} ${className || ''}`}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th
      className={`${css({
        paddingX: '4',
        paddingY: '3',
        textAlign: 'left',
        fontWeight: 'medium',
        color: 'gray.700',
        whiteSpace: 'nowrap',
      })} ${className || ''}`}
    >
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td
      className={`${css({
        paddingX: '4',
        paddingY: '3',
        color: 'gray.900',
      })} ${className || ''}`}
    >
      {children}
    </td>
  );
}

interface TableEmptyProps {
  message?: string;
  colSpan: number;
}

export function TableEmpty({ message = 'Nenhum registro encontrado', colSpan }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={css({
          padding: '8',
          textAlign: 'center',
          color: 'gray.500',
        })}
      >
        {message}
      </td>
    </tr>
  );
}
