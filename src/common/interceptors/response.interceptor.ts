import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    // Skip the interceptor for /auth routes
    if (url.startsWith('/auth')) {
      return next.handle(); // Bypass the interceptor
    }

    return next.handle().pipe(
      map((data) => {
        const response = {
          statusCode: context.switchToHttp().getResponse().statusCode || 200, // Dynamically set the status code
          message: data?.message || 'Request successful',
        };
        if (data?.message) delete data.message;
        response['data'] = data;
        return response;
      }),
    );
  }
}
