import { Injectable } from '@nestjs/common';
import enTexts from './assets/en.json';
import esTexts from './assets/es.json';

@Injectable()
export class TextsService {
  getEnTexts(): typeof enTexts {
    return enTexts;
  }
  getEsTexts(): typeof esTexts {
    return esTexts;
  }
}
