import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';
import { TechGeminiService } from 'src/tech-gemini/tech-gemini.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  providers: [TechnologyService, TechGeminiService, PrismaService],
  controllers: [TechnologyController]
})
export class TechnologyModule {}
