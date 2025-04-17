
import { Controller, Post, Delete, Param, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'; 
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bookmarks')
export class BookmarksController {

    constructor(

        private  readonly  bookmarkservice:BookmarksService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    async  bookmark(@Param('postId') postId:string,  @Req() req:Request){

        const  userId  =  (req.user as any)?.id
        const numberpostId =  parseInt(postId,10)
        return  this.bookmarkservice.bookmarkPost(userId,numberpostId)

    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':postId')
    async unbookmark(@Param('postId') postId:string,  @Req() req:Request){
        const  userId  =  (req.user as any)?.id
        const numberpostId =  parseInt(postId,10)
        return  this.bookmarkservice.removebookmark(userId,numberpostId)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('all')
    async  getBookmarks(@Req() req:Request){
        const  userId  =  (req.user as any)?.id
        return this.bookmarkservice.getUserBookmarks(userId)

    }
    

    
}
