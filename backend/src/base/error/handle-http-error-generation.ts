import { BadRequestException } from '@nestjs/common';
import { ErrorConstants } from 'src/base/constants';

export default function handleHttpErrorGeneration(error: any) {
  if (error.code == ErrorConstants.UNIQUE_CONSTRAINT) {
    return new BadRequestException(error.detail);
  }
}
