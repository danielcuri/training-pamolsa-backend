import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConfigurationService } from './configuration.service';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post('seed-admin')
  create() {
    return this.configurationService.seedUser();
  }
}
