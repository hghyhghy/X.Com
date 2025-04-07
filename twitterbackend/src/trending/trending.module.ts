import { Module } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrendingGeminiService } from 'src/trending-gemini/trending-gemini.service';
@Module({
  providers: [TrendingService,TrendingGeminiService,  PrismaService],
  controllers: [TrendingController]
})
export class TrendingModule {}
