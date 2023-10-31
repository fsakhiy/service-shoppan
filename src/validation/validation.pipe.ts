import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { FailedResponse } from 'src/common/response/response.dto';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);

    const errors = await validate(obj);

    if (errors.length > 0) {
      const missingFields = [];
      for (const error of errors) {
        const constraints = error.constraints;
        if (constraints) {
          missingFields.push(`${error.property}`);
        }
      }
      throw new BadRequestException(
        new FailedResponse('missing required field', {
          missing: true,
          fields: missingFields,
        }),
      );
    }

    return value;
  }
}
