import { Injectable } from '@nestjs/common';
import content from './assets/content.json';
import config from './assets/config.json';
import featureToggles from './assets/feature-toggles.json';

@Injectable()
export class ConfigService {
  getContent(): typeof content {
    return content;
  }
  getAppConfig(): typeof config {
    return config;
  }
  getFeatureToggles(): typeof featureToggles {
    return featureToggles;
  }
}
