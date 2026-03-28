import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingTemplateDto } from './create-training-template.dto';

export class UpdateTrainingTemplateDto extends PartialType(
  CreateTrainingTemplateDto,
) {}
