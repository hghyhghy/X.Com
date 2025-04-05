import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsGeminiService } from 'src/news-gemini/news-gemini.service';
@Module({
  providers: [NewsService,PrismaService,NewsGeminiService],
  controllers: [NewsController]
})
export class NewsModule {}
