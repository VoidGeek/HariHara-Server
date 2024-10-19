import {
  NotFoundException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

// Map for error messages, offering dynamic access
const errorMessages = new Map<string, string>([
  ['UNAUTHORIZED', 'Invalid credentials'],
  ['USER_NOT_FOUND', 'User not found'],
  ['ALREADY_LOGGED_IN', 'User already logged in'],
  ['NO_ACTIVE_SESSION', 'No active session'],
  // More error messages can be added dynamically
]);

export class BaseService {
  // General method for throwing HTTP exceptions using Map for error messages
  protected throwHttpException(key: string, statusCode: HttpStatus) {
    const message = errorMessages.get(key) || 'Unknown error'; // Default to 'Unknown error' if key is not found
    throw new HttpException(message, statusCode);
  }

  // UnauthorizedException for authentication/authorization errors using Map
  protected throwUnauthorizedException(key: string = 'UNAUTHORIZED') {
    const message = errorMessages.get(key) || 'Unauthorized access';
    throw new UnauthorizedException(message);
  }

  // NotFoundException for entity not found, dynamically using entity name and ID
  protected throwNotFoundException(entityName: string, id: number) {
    throw new NotFoundException(
      `${entityName} with ID ${id} not found. Please make sure the ${entityName} exists.`,
    );
  }

  // Handle database operations and throw NotFoundException if needed
  protected async handleDatabaseOperation<T>(
    operation: Promise<T>,
    id: number,
    entityName: string,
  ): Promise<T> {
    const result = await operation;
    if (!result) {
      this.throwNotFoundException(entityName, id);
    }
    return result;
  }
}
