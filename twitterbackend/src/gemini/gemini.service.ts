
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { json } from 'stream/consumers';

dotenv.config()
@Injectable()
export class GeminiService {

    private genAI:  GoogleGenerativeAI;

    constructor(){
        const apikey  = process.env.GEMINI_API_KEY
        if (!apikey){
            throw  new Error("APi key not found")
        }
        this.genAI=  new GoogleGenerativeAI(apikey)
    }

    async  generateContent(topic:string):Promise<{content:string, links:string[]; hashtags:string[]}>{

        try {
            
            const model  =  this.genAI.getGenerativeModel({model:"gemini-1.5-pro-002"})
            const prompt = `Generate a Twitter-style post about "${topic}". The post should be engaging and include:
            - A short, catchy text about the topic.
            - At least one relevant link.
            - A few hashtags related to the topic.
            
            Format the response in JSON:
            {
              "content": "your generated text",
              "links": ["https://example.com"],
              "hashtags": ["#example", "#topic"]
            }`;

            const result  =  await model.generateContent(prompt)
            const response  =  await result.response
            const text =  await response.text()
            const jsonData  =  JSON.parse(text)
            
      return {
        content: jsonData.content || "No content generated.",
        links: jsonData.links || [],
        hashtags: jsonData.hashtags || [],
      };
        } catch (error) {
            throw new Error(`Gemini API request failed: ${error.message}`);

        }
    }


}
