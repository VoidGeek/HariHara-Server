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

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let errorMessage: string = 'Unexpected error occurred'; // Default error message

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Check for specific error messages
      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse; // Handle string response
      } else if (exceptionResponse && exceptionResponse['message']) {
        // Handle structured error response
        errorMessage = Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message'].join(', ')
          : exceptionResponse['message'];
      }
    } else {
      // Check if the error message indicates corrupt JPEG data
      if (
        exception instanceof Error &&
        exception.message.includes('Corrupt JPEG data')
      ) {
        errorMessage =
          'Uploaded image is corrupt. Please upload a valid image file.';
        status = 400; // Set a specific status code for client error
      } else {
        // Handle non-HttpException errors
        this.logger.error(`Non-HTTP exception: ${exception}`);
        console.error(`Non-HTTP exception: ${exception}`); // Log to Postman console
      }
    }

    // Log the error details
    this.logger.error(
      `\nError Details:\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Status Code: ${status}\n` +
        `\t- Message: ${errorMessage}\n`,
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
}
