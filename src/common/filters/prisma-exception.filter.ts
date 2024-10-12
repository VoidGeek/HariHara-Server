import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    // Handle specific Prisma error codes
    if (exception.code === 'P2025') {
      // Record not found error
      status = HttpStatus.NOT_FOUND;
      message = 'Record not found';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.meta?.cause || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
