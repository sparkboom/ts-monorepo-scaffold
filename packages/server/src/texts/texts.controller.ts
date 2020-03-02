import { Controller, Get } from '@nestjs/common';
import { TextsService } from './texts.service';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) { }

  @Get('en')
  getContent(): any {
    return this.textsService.getEnTexts();
  }

  @Get('es')
  getFeatureToggles(): any {
    return this.textsService.getEsTexts();
  }
}
