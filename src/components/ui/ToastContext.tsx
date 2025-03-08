'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { Toast, ToastProps } from './Toast'

interface ToastContextValue {
  toast: (props: Omit<ToastProps, 'onClose'>) => void
  success: (props: Omit<ToastProps, 'onClose' | 'variant'>) => void
  error: (props: Omit<ToastProps, 'onClose' | 'variant'>) => void
  warning: (props: Omit<ToastProps, 'onClose' | 'variant'>) => void
  info: (props: Omit<ToastProps, 'onClose' | 'variant'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const addToast = useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (props: Omit<ToastProps, 'onClose'>) => {
      addToast({ ...props, onClose: () => removeToast(props.id as string) })
    },
    [addToast, removeToast]
  )

  const contextValue: ToastContextValue = {
    toast,
    success: (props) => toast({ ...props, variant: 'success' }),
    error: (props) => toast({ ...props, variant: 'error' }),
    warning: (props) => toast({ ...props, variant: 'warning' }),
    info: (props) => toast({ ...props, variant: 'info' }),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
