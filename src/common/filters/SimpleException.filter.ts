import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // This will catch all types of exceptions
export class SimpleExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SimpleExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response, request);
    } else {
      this.handleNonHttpException(exception, response, request);
    }
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    request: Request,
  ) {
    const status = exception.getStatus();
    const errorMessage = this.getErrorMessage(exception);

    this.logError(
      'HTTP Exception',
      status,
      request,
      errorMessage,
      exception.stack,
    );

    this.sendErrorResponse(
      response,
      status,
      request,
      errorMessage,
      'HTTP Exception',
    );
  }

  private handleNonHttpException(
    exception: unknown,
    response: Response,
    request: Request,
  ) {
    const status = this.getDynamicStatus(exception); // Get dynamic status
    const errorMessage = this.getNonHttpErrorMessage(exception);

    this.logError(
      'Non-HTTP Exception',
      status,
      request,
      errorMessage,
      exception instanceof Error ? exception.stack : '',
    );

    this.sendErrorResponse(
      response,
      status,
      request,
      errorMessage,
      'Non-HTTP Exception',
    );
  }

  private getErrorMessage(exception: HttpException): string | string[] {
    return Array.isArray(exception.getResponse()['message'])
      ? exception.getResponse()['message']
      : exception.message || 'Unexpected error occurred';
  }

  private getNonHttpErrorMessage(exception: unknown): string {
    return exception instanceof Error
      ? exception.message || 'Unexpected error occurred'
      : 'An unknown error occurred';
  }

  private getDynamicStatus(exception: unknown): number {
    if (
      exception instanceof Error &&
      exception.message.includes('Corrupt JPEG data')
    ) {
      return 422; // Unprocessable Entity for corrupt JPEG data
    }
    return 500; // Default status for other non-HTTP exceptions
  }

  private logError(
    exceptionType: string,
    status: number,
    request: Request,
    message: string | string[],
    stack: string,
  ) {
    this.logger.error(
      `\nError Details:\n` +
        `\t- Exception Type: ${exceptionType}\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Status Code: ${status}\n` +
        `\t- Message: ${Array.isArray(message) ? message.join(', ') : message}\n` +
        `\t- Stack Trace:\n${this.formatStackTrace(stack)}\n`,
    );
  }

  private sendErrorResponse(
    response: Response,
    status: number,
    request: Request,
    message: string | string[],
    type: string,
  ) {
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      type,
      message,
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
