
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable()
export class NewsGeminiService {

    private  genAI:GoogleGenerativeAI;
    constructor(){
        const apikey = process.env.GEMINI_API_KEY2;
        if(!apikey){
            throw  new Error('Api key is not found ')
        }
        this.genAI =  new GoogleGenerativeAI(apikey)
    }

    async getNews(topic:string):Promise<string[]>{

        try {
            
            const model  =  this.genAI.getGenerativeModel({model:"gemini-1.5-pro-002"})
            const prompt = `
            Generate a list of the top 10 latest news headlines related to "${topic}". 
            The news should be based on real-world trends and recent events.the response should be within 30 words . 
        Each topic should be formatted as a hashtag (e.g., #${topic}Update, #${topic}News). 
        Return the output as a plain text list, with each topic on a new line..
          `;

          const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
          const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            console.error(' Empty response from Gemini API');
            return [];
          }
    
          const newsHeadlines = textResponse
            .split("\n")
            .map((news) => news.replace(/^\d+\.\s*/, "").trim()) // Remove numbering (e.g., "1. News Headline")
            .filter((news) => news.length > 0);
    
          return newsHeadlines.slice(0, 10);
        } catch (error) {
            console.log('Error fetching response ', error)
            return[]
        }
    }

}
