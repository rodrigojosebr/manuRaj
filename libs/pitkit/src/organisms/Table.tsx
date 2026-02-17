'use client';

import { ReactNode } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

// ─── Table ───────────────────────────────────────────────────────────────────
const TableWrapper = styled('div', {
  base: {
    width: '100%',
    overflowX: 'auto',
    border: '1px solid',
    borderColor: 'gray.200',
    borderRadius: 'lg',
  },
});

const StyledTable = styled('table', {
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'sm',
  },
});

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <TableWrapper>
      <StyledTable className={className}>{children}</StyledTable>
    </TableWrapper>
  );
}

// ─── TableHeader ─────────────────────────────────────────────────────────────
const StyledThead = styled('thead', {
  base: {
    backgroundColor: 'gray.50',
    borderBottom: '1px solid',
    borderColor: 'gray.200',
  },
});

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return <StyledThead>{children}</StyledThead>;
}

// ─── TableBody ───────────────────────────────────────────────────────────────
interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

// ─── TableRow ────────────────────────────────────────────────────────────────
const StyledTr = styled('tr', cva({
  base: {
    borderBottom: '1px solid',
    borderColor: 'gray.200',
    _last: { borderBottom: 'none' },
  },
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
        _hover: { backgroundColor: 'gray.50' },
      },
    },
  },
  defaultVariants: {
    clickable: false,
  },
}));

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <StyledTr clickable={!!onClick} onClick={onClick} className={className}>
      {children}
    </StyledTr>
  );
}

// ─── TableHead ───────────────────────────────────────────────────────────────
const StyledTh = styled('th', {
  base: {
    paddingX: '4',
    paddingY: '3',
    textAlign: 'left',
    fontWeight: 'medium',
    color: 'gray.700',
    whiteSpace: 'nowrap',
  },
});

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return <StyledTh className={className}>{children}</StyledTh>;
}

// ─── TableCell ───────────────────────────────────────────────────────────────
const StyledTd = styled('td', {
  base: {
    paddingX: '4',
    paddingY: '3',
    color: 'gray.900',
  },
});

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return <StyledTd className={className}>{children}</StyledTd>;
}

// ─── TableEmpty ──────────────────────────────────────────────────────────────
const EmptyTd = styled('td', {
  base: {
    padding: '8',
    textAlign: 'center',
    color: 'gray.500',
  },
});

interface TableEmptyProps {
  message?: string;
  colSpan: number;
}

export function TableEmpty({ message = 'Nenhum registro encontrado', colSpan }: TableEmptyProps) {
  return (
    <tr>
      <EmptyTd colSpan={colSpan}>{message}</EmptyTd>
    </tr>
  );
}
