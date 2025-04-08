
import { Controller, Get, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
@Controller('explore')
export class ExploreController {

    constructor(
        private readonly exploreservice:ExploreService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    async  generatePsot(@Body('topic') topic:string ,  @Req() req:Request){
        const userID = (req.user as any)?.id
        return  this.exploreservice.generatePost(topic,userID)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':topic')
    async getPostsByTopic(@Param('topic') topic:string){
        return this.exploreservice.getPostsByTopic(topic)
    }


}
