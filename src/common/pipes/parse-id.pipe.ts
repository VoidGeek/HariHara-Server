import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Skip ID validation for specific routes where ID is not expected
    // For example, skipping ID validation for 'auth/login' or any other route.
    if (metadata.type === 'param' && metadata.data === 'id') {
      const id = parseInt(value, 10);
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid ID format');
      }
      return id;
    }

    // Return the value as is for routes where 'id' is not expected
    return value;
  }
}
