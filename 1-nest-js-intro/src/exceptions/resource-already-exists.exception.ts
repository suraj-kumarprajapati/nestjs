import { HttpException } from '@nestjs/common';

export class ResourceAlreadyExistsException extends HttpException {
  constructor(ResourceName: string, fieldName: string, fieldValue: string) {
    super(
      `${ResourceName} with ${fieldName} : '${fieldValue}' already exists`,
      409,
    );
  }
}
