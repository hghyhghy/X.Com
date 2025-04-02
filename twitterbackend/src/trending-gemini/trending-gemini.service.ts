
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

@Injectable()
export class TrendingGeminiService {


    private genAI:GoogleGenerativeAI
    constructor(){
        const apikey=  process.env.GEMINI_API_KEY1
        if (!apikey){
            throw  new Error("APi key not found")
        }
        this.genAI =  new GoogleGenerativeAI(apikey)
    }


    async  getTrendingTopics(): Promise<string[]>{
        try {
            const model   =  await this.genAI.getGenerativeModel({model:"gemini-1.5-pro-002"})
            const prompt = `
            Generate a list of the top 50 trending topics worldwide right now. 
            Each topic should be in a hashtag format (e.g., #WaqfAmendmentBill) and related to real-world events.
            Provide the output in an array format without any extra text.
          `;

          const  response  =  await  model.generateContent(prompt)
          const textResponse =   response.response.text()
          const topics = textResponse
          .split("\n")
          .map((topic) => topic.trim())
          .filter((topic) => topic.startsWith("#")); // Ensure only hashtags are returned
  
        return topics.slice(0, 50);
        } catch (error) {
            console.error("Error fetching trending topics:", error);
            return []
        }
    }
}
