import { Controller,Get,Post,Body,Req, UseGuards } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
@Controller('trending')
export class TrendingController {

    constructor(private trendingService:TrendingService){}

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    async generateTrendingTopic(@Req()  req:Request , @Body('topic') topic:string){
        const userId =  (req.user as any)?.id
        return  this.trendingService.generateTrendingTopics(topic,userId)

    }

    @UseGuards(JwtAuthGuard)
    @Get('posts')
    async  getTrendingPosts(){
        return this.trendingService.getTrendingTopics()
    }

}
