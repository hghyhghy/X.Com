
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsGeminiService } from 'src/news-gemini/news-gemini.service';
@Injectable()
export class NewsService {

    constructor(
        private prisma:PrismaService,
        private  gemini:NewsGeminiService
    ){}

    async  generateNewsTopic(topic:string,userID:number){
        try {
            
            const newsHeadlines  = await  this.gemini.getNews(topic)
            const newsData  =  await this.prisma.newsTopic.create({
                data:{
                    userId:userID,
                    topic:topic,
                    Posts:Math.floor(Math.random() * 100000)+1000,
                    headlines:newsHeadlines
                }
            })

            return newsData
            
        } catch (error) {
            
        }
    }

    async getNewsTopics(){
        return this.prisma.newsTopic.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })
    }

}
