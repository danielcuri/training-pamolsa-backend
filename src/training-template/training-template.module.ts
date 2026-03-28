import { Module } from '@nestjs/common';
import { TrainingTemplateService } from './training-template.service';
import { TrainingTemplateController } from './training-template.controller';

@Module({
  controllers: [TrainingTemplateController],
  providers: [TrainingTemplateService],
})
export class TrainingTemplateModule {}
