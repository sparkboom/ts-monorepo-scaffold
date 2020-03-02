import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('content')
  getContent(): any {
    return this.configService.getContent();
  }

  @Get()
  getConfig(): any {
    return this.configService.getAppConfig();
  }

  @Get('features')
  getFeatureToggles(): any {
    return this.configService.getFeatureToggles();
  }
}
