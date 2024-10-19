import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: this.getSuccessMessage(statusCode),
        data,
      })),
    );
  }

  private getSuccessMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      200: 'Request successful',
      201: 'Resource created successfully',
      204: 'No content',
    };

    return messages[statusCode] || 'Request processed successfully';
  }
}
