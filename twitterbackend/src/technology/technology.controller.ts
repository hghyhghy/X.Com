import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('technology')
export class TechnologyController {

    constructor(
        private  readonly  technologyservice:TechnologyService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    async  generateTechtopic(@Req() req:Request ,  @Body('topic') topic:string){
        const userId=  (req.user as any)?.id
        return  this.technologyservice.generateTechtopics(topic,userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('posts')
    async getTechTopic(){
        return this.technologyservice.getTechTopics()
    }

}
