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

    const errorMapping: Record<
      string,
      { status: HttpStatus; message: string }
    > = {
      P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
      P2002: {
        status: HttpStatus.CONFLICT,
        message: 'Unique constraint failed',
      },
      P2003: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Foreign key constraint failed',
      },
      // Add more Prisma error codes as needed
    };

    const { status, message } = errorMapping[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    };

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.meta?.cause || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
