import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SimpleHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SimpleHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    const errorMessage = exception.message || 'Unexpected error occurred';

    // Cleaner log with structured stack trace information
    this.logger.error(
      `\nError Details:\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Status Code: ${status}\n` +
        `\t- Message: ${errorMessage}\n` +
        `\t- Stack Trace:\n${this.formatStackTrace(exception.stack)}\n`, // Beautifully formatted stack trace
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
    };

    response.status(status).json(errorResponse);
  }

  // Helper method to format the stack trace for cleaner display
  private formatStackTrace(stack: string): string {
    return stack
      .split('\n')
      .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
      .join('\n');
  }
}
