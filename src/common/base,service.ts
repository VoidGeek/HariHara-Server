import { NotFoundException } from '@nestjs/common';

export class BaseService {
  // This method wraps database operations and checks if the result is null.
  protected async handleDatabaseOperation(
    operation: Promise<any>, // The actual database query (e.g., findUnique, update)
    id: number, // The ID of the entity being operated on
    entityName: string, // The name of the entity (e.g., 'Contact', 'User')
  ) {
    // Execute the operation (e.g., find the record in the database)
    const result = await operation;

    // If no record was found, throw a NotFoundException
    if (!result) {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }

    // If the record was found, return the result
    return result;
  }
}
