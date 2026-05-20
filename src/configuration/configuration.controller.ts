import { Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ConfigurationService } from './configuration.service';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  /** Sin JWT: el arranque del admin lo controla `ALLOW_CONFIGURATION` en el servicio. */
  @Public()
  @Post('seed-admin')
  create() {
    return this.configurationService.seedUser();
  }
}
