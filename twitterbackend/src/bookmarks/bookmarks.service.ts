
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class BookmarksService {
    constructor(
        private prisma:PrismaService
    ){}

    async bookmarkPost(userId:number,postId:number){
        return  this.prisma.bookmark.create({
            data:{
                userId:userId,
                postId:postId
            }
        })
    }

    async  removebookmark(userId:number, postId:number){
        return  this.prisma.bookmark.delete({
            where:{
                userId_postId:{userId,postId}
            }
        })
    }

    async  getUserBookmarks(userId:number){
        return this.prisma.bookmark.findMany({
            where:{
                userId:userId
            },
            include:{
                post:{
                    include:{
                        user:{
                            select:{
                                username:true,email:true
                            }
                        }
                    }
                }
            }
        })
    }
}
