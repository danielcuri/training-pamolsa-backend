import { PartialType } from '@nestjs/swagger';
import { CreateTrainingTemplateDto } from './create-training-template.dto';

export class UpdateTrainingTemplateDto extends PartialType(
  CreateTrainingTemplateDto,
) {}
