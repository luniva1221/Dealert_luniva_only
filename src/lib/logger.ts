type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (process.env.NODE_ENV === 'production') {
    // In production, output structured JSON for log aggregators
    console[level === 'debug' ? 'log' : level](JSON.stringify(entry))
  } else {
    const prefix = { info: '🔵', warn: '🟡', error: '🔴', debug: '⚪' }[level]
    console[level === 'debug' ? 'log' : level](`${prefix} [${entry.timestamp}] ${message}`, context ?? '')
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
}