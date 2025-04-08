
import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini/gemini.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ExploreService {

    constructor(
        private  prisma : PrismaService,
        private  gemini:GeminiService
    ) {}

    async generatePost(topic: string, userId: number): Promise<any> {
        try {
            console.log(`Generating post for topic: ${topic}, UserID: ${userId}`);
    
            const aiResponse = await this.gemini.generateContent(topic);
            console.log("AI Response:", aiResponse);
    
            if (!aiResponse || !aiResponse.content) {
                throw new Error("AI did not generate any content.");
            }
    
            const { content, links = [], hashtags = [] } = aiResponse; // Safe destructuring
    
            const post = await this.prisma.post.create({
                data: {
                    content,
                    topic,
                    links: links.length ? JSON.stringify(links) : "[]", // Handle undefined links
                    hashtags: hashtags?.join(', ') || "", // Handle undefined hashtags
                    userId
                }
            });
    
            console.log("Post saved successfully:", post);
            return post;
    
        } catch (error) {
            console.error("Error in generatePost:", error.message);
            throw new Error("Error generating post");
        }
    }
    
    async getPostsByTopic(topic: string): Promise<any> {
        try {
            const posts = await this.prisma.post.findMany({
                where: { topic: topic },
                orderBy: { createdAt: "desc" }
            });
    
            // Ensure links are always arrays
            return posts.map(post => ({
                ...post,
                links: Array.isArray(post.links) ? post.links : [], // Ensure links is an array
            }));
        } catch (error) {
            throw new Error('Error fetching posts');
        }
    }
    
    


}
