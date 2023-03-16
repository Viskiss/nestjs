import { registerDecorator } from 'class-validator';

export function IsPassword() {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: 'Password length min 5',
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && value.length > 4;
        },
      },
    });
  };
}
