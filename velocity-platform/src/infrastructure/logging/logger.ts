/**
 * Logger Infrastructure
 * Centralized logging for PRISM components
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  component: string
  data?: any
}

export class Logger {
  private static instance: Logger
  private logLevel: LogLevel = LogLevel.INFO
  private logs: LogEntry[] = []

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level
  }

  error(component: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, component, message, data)
  }

  warn(component: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, component, message, data)
  }

  info(component: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, component, message, data)
  }

  debug(component: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, component, message, data)
  }

  private log(level: LogLevel, component: string, message: string, data?: any): void {
    if (level <= this.logLevel) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        component,
        data
      }
      
      this.logs.push(entry)
      
      // Console output
      const levelStr = LogLevel[level]
      const timestamp = entry.timestamp.toISOString()
      console.log(`[€{timestamp}] €{levelStr} [€{component}]: €{message}`, data || '')
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}