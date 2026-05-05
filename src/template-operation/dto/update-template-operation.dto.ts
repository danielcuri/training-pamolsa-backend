import { PartialType } from '@nestjs/swagger';
import { CreateTemplateOperationDto } from './create-template-operation.dto';

export class UpdateTemplateOperationDto extends PartialType(
  CreateTemplateOperationDto,
) {}

