import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
@Controller('news')
export class NewsController {
    constructor(
        private readonly newsservice:NewsService 
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    async generateNewsTopic(@Body('topic') topic:string,  @Req() req:Request){
        const userId =  (req.user  as any)?.id
        return  this.newsservice.generateNewsTopic(topic,userId)

    }

    @UseGuards(JwtAuthGuard)
    @Get('posts')
    async  getNewsTopic(){
        return this.newsservice.getNewsTopics()
    }
}
