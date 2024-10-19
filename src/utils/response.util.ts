import { HttpStatus } from '@nestjs/common';

export function createResponse(
  statusCode: HttpStatus,
  message: string,
  data: any = null,
) {
  return {
    statusCode,
    message,
    data, // Just pass the actual user or session data here
  };
}
