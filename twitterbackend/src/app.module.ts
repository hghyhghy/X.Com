import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { GeminiService } from './gemini/gemini.service';
import { ExploreModule } from './explore/explore.module';
import { TrendingGeminiService } from './trending-gemini/trending-gemini.service';
import { TrendingModule } from './trending/trending.module';
import { NewsGeminiService } from './news-gemini/news-gemini.service';
import { NewsModule } from './news/news.module';
import { TechGeminiService } from './tech-gemini/tech-gemini.service';
import { TechnologyModule } from './technology/technology.module';
import { PostsModule } from './posts/posts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [ AuthModule, ExploreModule, TrendingModule, NewsModule, TechnologyModule, PostsModule, BookmarksModule],
  controllers: [AppController],
  providers: [AppService,PrismaService, GeminiService, TrendingGeminiService, NewsGeminiService, TechGeminiService],
})
export class AppModule {}
