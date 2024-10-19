import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

// Define the error messages map
const prismaErrorMessages = new Map<string, string>([
  // Unique constraint violation
  ['P2002', 'Unique constraint violation on field: '],

  // Foreign key constraint violation
  ['P2003', 'Foreign key constraint violation'],

  // Record not found
  ['P2025', 'Record not found'],

  // The record searched for in the where condition does not exist
  ['P2001', 'The record searched for in the where condition does not exist'],

  // Missing required field in the input
  ['P2012', 'Missing required field in the input'],

  // Constraint failed on the database
  ['P2004', 'Constraint failed on the database'],

  // Invalid value for the column type
  ['P2005', 'Invalid value for the column type'],

  // Null constraint violation
  ['P2011', 'Null constraint violation'],

  // Too many records matched the query
  ['P2024', 'Too many records matched the query'],

  // Transaction failed
  ['P2026', 'Transaction failed'],

  // General error for unknown database errors
  ['P9999', 'Database error occurred'], // Custom code for fallback
]);

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = this.getErrorMessage(exception);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private getErrorMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const baseMessage =
      prismaErrorMessages.get(exception.code) || 'Database error occurred';

    // For P2002 (Unique constraint violation), append the specific field name if available
    if (exception.code === 'P2002' && exception.meta?.target) {
      return `${baseMessage}${exception.meta.target}`;
    }

    return baseMessage;
  }
}
