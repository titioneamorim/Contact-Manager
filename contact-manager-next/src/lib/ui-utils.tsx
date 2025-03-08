'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Hook for handling form submission state
export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (callback: () => Promise<void>) => {
      try {
        setIsSubmitting(true)
        setError(null)
        await callback()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  return { isSubmitting, error, setError, handleSubmit }
}

// Hook for handling async data fetching
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading, error }
}

// Hook for handling debounced input
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for handling infinite scroll
export function useInfiniteScroll(
  callback: () => Promise<void>,
  hasMore: boolean
) {
  const [isLoading, setIsLoading] = useState(false)

  const handleScroll = useCallback(
    async (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement
      const isNearBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < 50

      if (isNearBottom && !isLoading && hasMore) {
        setIsLoading(true)
        await callback()
        setIsLoading(false)
      }
    },
    [callback, hasMore, isLoading]
  )

  return { isLoading, handleScroll }
}

// Hook for handling keyboard shortcuts
export function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback])
}

// Hook for handling navigation confirmation
export function useNavigationConfirm(shouldConfirm: boolean) {
  const router = useRouter()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldConfirm) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [shouldConfirm])

  const navigate = useCallback(
    (href: string) => {
      if (
        !shouldConfirm ||
        window.confirm('Are you sure you want to leave this page?')
      ) {
        router.push(href)
      }
    },
    [router, shouldConfirm]
  )

  return navigate
}

// Hook for handling local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
