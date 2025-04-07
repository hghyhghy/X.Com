
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrendingGeminiService } from 'src/trending-gemini/trending-gemini.service';
@Injectable()
export class TrendingService {

    constructor(

        private  prisma:PrismaService,
        private  gemini:TrendingGeminiService
    ){}

    async  generateTrendingTopics(topic:string, userId:number){
        try {
            
            const topics  =  await  this.gemini.getTrendingTopics(topic)
            const trendingTopics =  topics.map((topic) =>  ({
                topic,
                posts:Math.floor(Math.random() * 100000)+1000,
                userId
            }))
            await this.prisma.trendingTopic.createMany({data:trendingTopics})
            return trendingTopics
        } catch (error) {
            console.error('Error generating trending topic',  error)
            throw new Error("Failed to generate trending topics.");

        }
    }

    async  getTrendingTopics(){
        return await this.prisma.trendingTopic.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
    }
}
