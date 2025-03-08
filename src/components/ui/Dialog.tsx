'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from './button'

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, isOpen, onClose, children, ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={onClose}
          />

          {/* Dialog position */}
          <div className="inline-block h-screen align-middle">&#8203;</div>

          <div
            ref={ref}
            className={twMerge(
              'inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Dialog.displayName = 'Dialog'

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('mb-4 space-y-1.5', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DialogHeader.displayName = 'DialogHeader'

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={twMerge(
          'text-lg font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
DialogTitle.displayName = 'DialogTitle'

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={twMerge('text-sm text-gray-500', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
DialogDescription.displayName = 'DialogDescription'

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'mt-6 flex justify-end space-x-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DialogFooter.displayName = 'DialogFooter'

interface ConfirmDialogProps extends Omit<DialogProps, 'children'> {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
}

const ConfirmDialog = ({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  ...props
}: ConfirmDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={props.onClose}>
          {cancelLabel}
        </Button>
        <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ConfirmDialog,
}
