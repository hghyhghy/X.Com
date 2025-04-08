import { Module } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { ExploreController } from './explore.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Module({
  providers: [ExploreService,PrismaService , GeminiService],
  controllers: [ExploreController]
})
export class ExploreModule {}
