import { Module } from '@nestjs/common';
import { TemplateOperationService } from './template-operation.service';
import { TemplateOperationController } from './template-operation.controller';

@Module({
  controllers: [TemplateOperationController],
  providers: [TemplateOperationService],
})
export class TemplateOperationModule {}

