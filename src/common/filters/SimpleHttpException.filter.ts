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

    // Check if the exception message is an array (DTO validation errors) or a string
    const errorMessage = Array.isArray(exception.getResponse()['message'])
      ? exception.getResponse()['message']
      : exception.message || 'Unexpected error occurred';

    // Log the error details
    this.logger.error(
      `\nError Details:\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Status Code: ${status}\n` +
        `\t- Message: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}\n` +
        `\t- Stack Trace:\n${this.formatStackTrace(exception.stack)}\n`,
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      // Send message as it is, array or string
      message: errorMessage,
    };

    response.status(status).json(errorResponse);
  }

  private formatStackTrace(stack: string): string {
    return stack
      .split('\n')
      .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
      .join('\n');
  }
}
