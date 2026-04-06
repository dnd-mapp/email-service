import {
    isFQDN,
    isIP,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isHost', async: false })
export class IsHostConstraint implements ValidatorConstraintInterface {
    public validate(value: unknown) {
        if (typeof value !== 'string') return false;
        return isIP(value) || isFQDN(value, { require_tld: false });
    }

    public defaultMessage(args: ValidationArguments) {
        return `"${args.property}" must be a valid IP address or hostname`;
    }
}

/**
 * Decorator to validate a string is a valid Host (IP or Hostname)
 */
export function IsHost(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsHostConstraint,
        });
    };
}
