import { NotFoundException } from '@nestjs/common';

export class BaseService {
  protected async handleDatabaseOperation<T>(
    operation: Promise<T>,
    id: number,
    entityName: string,
  ): Promise<T> {
    const result = await operation;
    if (!result) {
      throw new NotFoundException(
        `${entityName} with ID ${id} not found. Please make sure the contact exists.`,
      );
    }
    return result;
  }
}
