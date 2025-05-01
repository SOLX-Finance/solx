import { Injectable } from '@nestjs/common';
import { generateObject, LanguageModel } from 'ai';
import { z } from 'zod';

export const AI_LANGUAGE_MODEL = 'AI_LANGUAGE_MODEL';

@Injectable()
export class AiService {
  constructor(private readonly languageModule: LanguageModel) {}

  async analyzeFile(fileContentBase64: string) {
    const response = await this.generateObject(fileContentBase64);
    return response.object;
  }

  private generateObject(prompt: string) {
    return generateObject({
      model: this.languageModule,
      messages: [
        {
          role: 'system',
          content:
            'You are the AI-analyst for our system. Your purpose is to analyze input files (ussualy single files or archives) and try to find any suspicious activity. It might me common viruses, backdoors, nsfw content, etc. The input promt is a file content in base64 format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      schema: z.object({
        overallScore: z.number(),
        findings: z.array(
          z.object({
            type: z.enum([
              'virus',
              'backdoor',
              'extreme_harmful_content',
              'illegal_nsfw',
              'csam',
              'violent_exploitative_content',
              'other',
            ]),
            reason: z.string(),
            confidence: z.number(),
            description: z.string(),
            explanation: z.string(),
          }),
        ),
      }),
    });
  }
}
