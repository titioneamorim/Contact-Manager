'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from './button'

export interface PaginationProps extends ButtonHTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, siblingCount = 1, ...props }, ref) => {
    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, idx) => idx + start)
    }

    const generatePagination = () => {
      const totalPageNumbers = siblingCount * 2 + 3
      const totalBlocks = totalPageNumbers + 2

      if (totalPages <= totalBlocks) {
        return range(1, totalPages)
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount
        const leftRange = range(1, leftItemCount)
        return [...leftRange, '...', totalPages]
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount
        const rightRange = range(totalPages - rightItemCount + 1, totalPages)
        return [1, '...', ...rightRange]
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex)
        return [1, '...', ...middleRange, '...', totalPages]
      }
    }

    return (
      <div
        ref={ref}
        className={twMerge('flex items-center justify-center space-x-2', className)}
        {...props}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {generatePagination()?.map((pageNumber, i) => {
            if (pageNumber === '...') {
              return (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              )
            }

            const page = pageNumber as number
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="min-w-[32px]"
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    )
  }
)
Pagination.displayName = 'Pagination'

export { Pagination }
