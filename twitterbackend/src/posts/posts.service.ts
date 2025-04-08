
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class PostsService {

    constructor(
        private  prisma:PrismaService
    ){}
    async createPost(data: any, userId: number) {
        try {
          const {
            content,
            topic,
            hashtags,
            links,
            media,
          } = data;
      
          let parsedLinks: any = null;
          let parsedMedia: any = null;
      
          try {
            parsedLinks = links ? (typeof links === 'string' ? JSON.parse(links) : links) : null;
          } catch (err) {
            console.error('Invalid JSON in links:', links);
            throw new Error('Invalid links format');
          }
      
          try {
            parsedMedia = media ? (typeof media === 'string' ? JSON.parse(media) : media) : null;
          } catch (err) {
            console.error(' Invalid JSON in media:', media);
            throw new Error('Invalid media format');
          }
      
          const newPost = await this.prisma.posts.create({
            data: {
              content: content?content:null,
              topic: topic ? topic : null,
              hashtags:hashtags ? hashtags:null,
              links: parsedLinks ? parsedLinks : null,
              media: parsedMedia,
              userId: userId,
            },
          });
      
          return newPost;
      
        } catch (error) {
          console.error('🔥 Error in createPost:', error);
          throw new Error('Could not create post');
        }
      }
      

    async getAllPosts(){
        const result =    await  this.prisma.posts.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                user:{
                    select:{
                        id:true,
                        username:true,
                        email:true
                    }
                }
            }
        })

        console.log(result)
        return result
    }

    async getUserPosts(userId:number){
        return await this.prisma.posts.findMany({
            where:{
                userId:userId
            },
            orderBy:{
                createdAt:'desc'
            }
        })
    }

    async deletePost(postId:number,  userId:number){
        const  post  =  await  this.prisma.posts.findUnique({
            where:{
                id:postId
            }
        })
        
        if (!post || post.userId !== userId) {
            throw new Error('Post not found or unauthorized');
        }
        return await this.prisma.posts.delete({
            where:{
                id:postId
            }
        })
  
    }

    async removeMediaFromPost(postId:number, updates: {
        mediaUrlToRemove?: string;
        content?: string;
        topic?: string;
        hashtags?: string;
        links?: any;
      }){
        const  post  =  await  this.prisma.posts.findUnique({
            where:{
                id:postId
            }
        })
        if (!post ) {
            throw new Error('Post not found or no media to update');
        }
        let updatedMedia = post.media;

        // If mediaUrlToRemove is provided, remove that media item
        if (updates.mediaUrlToRemove && post.media) {
          const currentMedia = post.media as Array<any>;
          updatedMedia = currentMedia.filter(
            (item: any) => item.url !== updates.mediaUrlToRemove
          );
        }
      
        const updatedPost = await this.prisma.posts.update({
          where: { id: postId },
          data: {
            content: updates.content ?? post.content,
            topic: updates.topic ?? post.topic,
            hashtags: updates.hashtags ?? post.hashtags,
            links: updates.links ?? post.links,
            media: updatedMedia ? updatedMedia : Prisma.JsonNull,

          },
        });
      
        return updatedPost;
      
    }

    async appendMediaToPost(postId:number  ,  newMedia:any[] , userId:number){
        const  post  =  await this.prisma.posts.findUnique({
            where:{
                id:postId
            }
        })
        if (!post) throw new Error('Post not found');
        if (post.userId !== userId) throw new Error('Unauthorized');
        const currentMedia  =  (post.media || [])  as any[]
        const updated  =  await this.prisma.posts.update({
            where:{
                id:postId
            },
            data:{
                media:[
                    ...currentMedia, ...newMedia
                ]
            }
        })

        return updated
    }


    async likePost(postId:number){
      return  this.prisma.posts.update({
        where:
        {
          id:postId
        },
        data:{
          likes:{
            increment : 1
          }
        }
      })
    }

    async dislikePosts(postId:number){
      return this.prisma.posts.update({
        where:{
          id:postId
        },
        data:{
          dislikes:{
            increment:1
          }
        }
      })
    }
}
