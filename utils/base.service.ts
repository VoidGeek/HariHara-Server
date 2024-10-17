import { NotFoundException } from '@nestjs/common';

export class BaseService {
  protected async handleDatabaseOperation(
    operation: Promise<any>,
    id: number,
    entityName: string,
  ) {
    const result = await operation;
    if (!result) {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    return result;
  }
}
