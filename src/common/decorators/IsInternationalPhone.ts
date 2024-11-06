// src/decorators/IsInternationalPhone.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationMessages } from '../../common/constants/validation-message';

@ValidatorConstraint({ async: false })
class IsInternationalPhoneConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    const phonePattern = /^\+[1-9]\d{1,14}$/;
    return phonePattern.test(phoneNumber);
  }

  defaultMessage() {
    return ValidationMessages.internationalPhone;
  }
}

export function IsInternationalPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    // Changed Object to object
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInternationalPhoneConstraint,
    });
  };
}
