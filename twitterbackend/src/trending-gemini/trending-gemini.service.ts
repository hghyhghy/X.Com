import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

@Injectable()
export class TrendingGeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apikey = process.env.GEMINI_API_KEY1;
    if (!apikey) {
      throw new Error('API key not found');
    }
    this.genAI = new GoogleGenerativeAI(apikey);
  }

  async getTrendingTopics(topic: string): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-002' });

      const prompt = `
        Generate a list of the top 50 trending topics related to "${topic}" worldwide right now. 
        Each topic should be formatted as a hashtag (e.g., #${topic}Update, #${topic}News). 
        Return the output as a plain text list, with each topic on a new line.
      `;

      // 🔥 Ensure we are calling the API correctly
      const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });

      // ✅ Correctly extract the response text
      const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        console.error('⚠️ Empty response from Gemini API');
        return [];
      }

      const topics = textResponse
        .split("\n")
        .map((topic) => topic.trim())
        .filter((topic) => topic.startsWith("#"));

      return topics.slice(0, 50);
    } catch (error) {
      console.error('❌ Error fetching trending topics:', error);
      return [];
    }
  }
}
