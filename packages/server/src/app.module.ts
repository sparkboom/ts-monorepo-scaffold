import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TextsModule } from './texts/texts.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
    }),
    ConfigModule,
    TextsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
