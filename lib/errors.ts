// Centralized error handling utilities for Capling app

import { ApiError } from '@/types'

// ============================================================================
// ERROR TYPES
// ============================================================================

export class CaplingError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'CaplingError'
  }
}

export class ValidationError extends CaplingError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field })
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends CaplingError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends CaplingError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends CaplingError {
  constructor(message: string, details?: any) {
    super(message, 'DATABASE_ERROR', 500, details)
    this.name = 'DatabaseError'
  }
}

export class ExternalServiceError extends CaplingError {
  constructor(service: string, message: string, details?: any) {
    super(`${service} error: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, details)
    this.name = 'ExternalServiceError'
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export function handleApiError(error: unknown): ApiError {
  if (error instanceof CaplingError) {
    return {
      error: error.message,
      details: error.details,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      details: error.stack,
    }
  }

  return {
    error: 'An unexpected error occurred',
    details: String(error),
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof CaplingError) {
    return error.statusCode ? error.statusCode >= 500 : false
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof CaplingError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export function validateNumber(value: any, fieldName: string, min?: number, max?: number): void {
  const num = Number(value)
  if (isNaN(num)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }
  if (min !== undefined && num < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`)
  }
  if (max !== undefined && num > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`)
  }
}

export function validateString(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`)
  }
  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`)
  }
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters`)
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }
}

export function validateTransactionCategory(category: string): void {
  const validCategories = ['shopping', 'food', 'transport', 'bills', 'dining', 'entertainment', 'health', 'income']
  if (!validCategories.includes(category)) {
    throw new ValidationError(`Invalid transaction category. Must be one of: ${validCategories.join(', ')}`)
  }
}

export function validateTransactionClassification(classification: string): void {
  const validClassifications = ['responsible', 'irresponsible', 'neutral']
  if (!validClassifications.includes(classification)) {
    throw new ValidationError(`Invalid classification. Must be one of: ${validClassifications.join(', ')}`)
  }
}

// ============================================================================
// API RESPONSE HELPERS
// ============================================================================

export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  }
}

export function createErrorResponse(error: unknown, statusCode: number = 500) {
  const apiError = handleApiError(error)
  return {
    success: false,
    error: apiError.error,
    details: apiError.details,
    code: apiError.code,
  }
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const message = getErrorMessage(error)
  
  console.error(`[${timestamp}] ${context ? `[${context}] ` : ''}${message}`)
  
  if (error instanceof CaplingError && error.details) {
    console.error('Details:', error.details)
  }
  
  if (error instanceof Error && error.stack) {
    console.error('Stack:', error.stack)
  }
}

export function logInfo(message: string, context?: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${context ? `[${context}] ` : ''}${message}`)
  if (data) {
    console.log('Data:', data)
  }
}

// ============================================================================
// RETRY UTILITIES
// ============================================================================

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error
      }
      
      logInfo(`Retry attempt ${attempt}/${maxRetries}`, 'RETRY', { error: getErrorMessage(error) })
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError
}

// ============================================================================
// TIMEOUT UTILITIES
// ============================================================================

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new CaplingError(timeoutMessage, 'TIMEOUT', 408)), timeoutMs)
    })
  ])
}
