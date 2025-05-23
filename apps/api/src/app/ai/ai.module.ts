import { createOpenAI } from '@ai-sdk/openai';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AI_LANGUAGE_MODEL, AiService } from './ai.service';
@Module({
  providers: [
    AiService,
    {
      provide: AI_LANGUAGE_MODEL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const aiApiKey = configService.getOrThrow<string>('app.ai.apiKey');
        const aiModelId = configService.getOrThrow<string>('app.ai.modelId');

        const openAi = createOpenAI({
          compatibility: 'strict',
          apiKey: aiApiKey,
        });

        return openAi(aiModelId);
      },
    },
  ],
  exports: [AiService],
})
export class AiModule {}
