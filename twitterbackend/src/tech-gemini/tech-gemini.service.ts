
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable()
export class TechGeminiService {

    private genAI:GoogleGenerativeAI;
    constructor(){
        const apikey =  process.env.GEMINI_API_KEY2;
        if(!apikey){
            throw new Error('Api key  is not found')
        }

        this.genAI = new GoogleGenerativeAI(apikey)

    }

    async  getTechnologyInsights(topic:string):Promise<string[]>{
        try {
            const model  =  this.genAI.getGenerativeModel({model:"gemini-1.5-pro-002"})
            const prompt = `
            Generate a list of the top 10 most recent and relevant technology insights or updates related to "${topic}". 
            Each insight should be concise (max 30 words) and formatted as a plain text line.
            Use relevant hashtags (e.g., #${topic}Tech, #${topic}Trends).
            Only return the list, no extra explanations.
          `;
    
          const result  =  await model.generateContent({contents:[{role:'user' , parts:[{text:prompt}]}]})
          const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            console.error('Empty response from Gemini API');
            return [];
          }
    
          const techInsights = textResponse
            .split('\n')
            .map((item) => item.replace(/^\d+\.\s*/, '').trim())
            .filter((item) => item.length > 0);
            return techInsights.slice(0,10)
        } catch (error) {
            console.log('Error fetching resposne ', error)
            return []
        }

    }

}
