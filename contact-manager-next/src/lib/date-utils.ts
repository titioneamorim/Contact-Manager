const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'auto',
})

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return DATE_FORMATTER.format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return TIME_FORMATTER.format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return DATETIME_FORMATTER.format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (Math.abs(diffInDays) > 30) {
    return formatDate(d)
  }

  if (Math.abs(diffInDays) > 0) {
    return RELATIVE_FORMATTER.format(diffInDays, 'day')
  }

  if (Math.abs(diffInHours) > 0) {
    return RELATIVE_FORMATTER.format(diffInHours, 'hour')
  }

  if (Math.abs(diffInMinutes) > 0) {
    return RELATIVE_FORMATTER.format(diffInMinutes, 'minute')
  }

  return RELATIVE_FORMATTER.format(diffInSeconds, 'second')
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function isYesterday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  )
}

export function isThisWeek(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  return d >= weekStart && d <= weekEnd
}

export function isThisMonth(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}
