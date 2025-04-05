import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TechGeminiService } from '../tech-gemini/tech-gemini.service';
@Injectable()
export class TechnologyService {

    constructor(

        private   prisma:PrismaService,
        private  gemini:TechGeminiService
    ) {}

    async generateTechtopics(topic:string ,  userId:number){
        try {
            
            const insights  =   await this.gemini.getTechnologyInsights(topic)
            const  technology =  await this.prisma.techTopic.create({
                data:{
                    topic:topic,
                    insights:insights,
                    posts:Math.floor(Math.random() * 100000) + 1000,
                    userId:userId
                }
            })

            return technology
        } catch (error) {
            console.log("Error generating technology",  error)
        }
    }

    async  getTechTopics(){
        return this.prisma.techTopic.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })
    }
}
