'use client'

import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={twMerge(
          'w-full caption-bottom text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={twMerge(
        'border-b bg-gray-50/50',
        className
      )}
      {...props}
    />
  )
)
TableHeader.displayName = 'TableHeader'

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={twMerge(
        'divide-y [&_tr:last-child]:border-0',
        className
      )}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={twMerge(
        'border-t bg-gray-50/50 font-medium',
        className
      )}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={twMerge(
        'border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={twMerge(
        'h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={twMerge(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={twMerge(
        'mt-4 text-sm text-gray-500',
        className
      )}
      {...props}
    />
  )
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
