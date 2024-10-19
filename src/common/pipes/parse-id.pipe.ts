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
    if (metadata.type === 'param' && metadata.data === 'id') {
      const id = parseInt(value, 10);

      // Check if the value is a valid number
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid ID format');
      }

      // Check if the ID fits within the valid range for a 32-bit signed integer (INT4)
      if (id > 2147483647) {
        throw new BadRequestException(
          'ID exceeds valid range for a 32-bit signed integer',
        );
      }

      return id;
    }

    // Return the value as is for routes where 'id' is not expected
    return value;
  }
}
