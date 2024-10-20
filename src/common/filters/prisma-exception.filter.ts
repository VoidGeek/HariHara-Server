import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

// Define the error messages map
const prismaErrorMessages = new Map<string, string>([
  ['P2002', 'Already registered'], // Simplified message for unique constraint violation
  ['P2003', 'Foreign key constraint violation'],
  ['P2025', 'Record not found'],
  ['P2001', 'Record not found'],
  ['P2012', 'Missing required field'],
  ['P2004', 'Constraint failed'],
  ['P2005', 'Invalid value for the column'],
  ['P2011', 'Null constraint violation'],
  ['P2024', 'Too many records matched the query'],
  ['P2026', 'Transaction failed'],
  ['P9999', 'Database error occurred'], // General fallback message
]);

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get user-friendly message
    const clientMessage = this.getClientErrorMessage(exception);

    // Log the detailed error for internal purposes
    this.logger.error(
      `Prisma Error:\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Detailed Error: ${exception.message}\n` +
        `\t- Stack Trace:\n${this.formatStackTrace(exception.stack)}\n`,
    );

    // Return sanitized response to the client
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: clientMessage,
    });
  }

  // Function to return a sanitized, user-friendly error message
  private getClientErrorMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    return prismaErrorMessages.get(exception.code) || 'An error occurred';
  }

  // Helper method to format the stack trace for cleaner display in logs
  private formatStackTrace(stack: string): string {
    return stack
      .split('\n')
      .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
      .join('\n');
  }
}
