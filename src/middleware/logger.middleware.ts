import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP'); // Create a logger with the context "HTTP"

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req; // Get HTTP method and request URL
    const startTime = Date.now(); // Get the request start time

    // When the response finishes, log the details
    res.on('finish', () => {
      const { statusCode } = res; // Get the status code of the response
      const endTime = Date.now(); // Calculate request end time
      const processingTime = endTime - startTime; // Calculate the processing time

      // Log the method, URL, status, and processing time
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${processingTime}ms`,
      );
    });

    next(); // Pass the control to the next middleware or route handler
  }
}
