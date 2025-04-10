
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  Req,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('posts')
export class PostsController {

  constructor(private  readonly postsservice:PostsService){}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('media' , 10 , {
      storage:diskStorage({
          destination:(req,file,cb) => {
            const  uploadPath =  'uploads/media';
            if(!fs.existsSync(uploadPath)){
              fs.mkdirSync(uploadPath , {recursive:true});
            }
            cb(null,uploadPath)
          },

          filename:(req,file,cb) => {
            const ext =  path.extname(file.originalname)
            const uniqueName = `${uuidv4()}${ext}`;
            cb(null, `${file.fieldname}-${uniqueName}${ext}`);

          }
      }),

      fileFilter:(req,file,cb) => {
        const allowedTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'video/mp4',
          'video/mov',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      }
    })
  )

  async createPost(
    @UploadedFiles() files:Express.Multer.File[],
    @Body() body:any,
    @Req() req:Request
  )
  {
    try {
      
      const userId  =  (req.user as any)?.id
      const media  =  files?.map((file) =>  {
        const isVideo =  file.mimetype.startsWith('video');
        return {
          type: isVideo ? 'video' : 'image',
          url: `${process.env.SERVER_URL || 'http://localhost:3001'}/uploads/media/${file.filename}`,
        };
      }) || [];

      const data = {
        ...body,
        media,
      }
      
      const post  =  await this.postsservice.createPost(data,userId)
      return {
        success: true,
        message: 'Post created successfully',
        post,
      };
    } catch (error) {
      console.error('Error creating post:', error);
      return {
        success: false,
        message: 'Failed to create post',
      };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllPosts(){
    const  posts  =  await this.postsservice.getAllPosts()
    return {
      success:true,
      posts
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('userposts')
  async getUserPosts(@Req() req:Request){
    const userId = (req.user as any)?.id
    const posts  =  await this.postsservice.getUserPosts(userId)
    return {
      success:true,
      posts
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:postID')
  async deletePost(
    @Param('postID') postId:string,
    @Req() req:Request
  ){
     try {
      const  numberpostId =  parseInt(postId,10)
      const  userId  =  (req.user as any)?.id
      const  deleted  =  await this.postsservice.deletePost(numberpostId,userId)
      return {
        success: true,
        message: 'Post deleted successfully',
        post: deleted,
      };
     } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete post',
      };
     }


  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-media/:postId')
  async removeMediaFromPost(
   @Param('postId') postId:string,
   @Body()  body:{
    mediaUrlToRemove?: string;
    content?: string;
    topic?: string;
    hashtags?: string;
    links?: any;
   }
  )
  {
    try {
      const  numberpostId =  parseInt(postId,10)
      const updated  =  await this.postsservice.removeMediaFromPost(numberpostId,body)
      return {
        success: true,
        message: 'Media removed successfully',
        post: updated,
      };
      

    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove media',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
@Patch('add-media/:postId')
@UseInterceptors(
  FilesInterceptor('media', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'uploads/media';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, `${file.fieldname}-${uniqueName}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/mov'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
  })
)
async addMediaToPost(
  @Param('postId') postId: string,
  @UploadedFiles() files: Express.Multer.File[],
  @Req() req: Request
) {
  try {
    const userId = (req.user as any)?.id;
    const numberPostId = parseInt(postId, 10);

    const newMedia = files.map((file) => {
      const isVideo = file.mimetype.startsWith('video');
      return {
        type: isVideo ? 'video' : 'image',
        url: `${process.env.SERVER_URL || 'http://localhost:3001'}/uploads/media/${file.filename}`,
      };
    });

    const updatedPost = await this.postsservice.appendMediaToPost(numberPostId, newMedia, userId);
    return {
      success: true,
      message: 'Media added to post successfully',
      post: updatedPost,
    };
  } catch (error) {
    console.error('Error adding media:', error);
    return {
      success: false,
      message: error.message || 'Failed to add media',
    };
  }
}

 @Patch('like/:id')
 async  likepost(@Param('id') id:string){
  const numberid =  parseInt(id,10)
  return  this.postsservice.likePost(numberid)
 }

 @Patch('dislike/:id')
 async dislikepost(@Param('id') id:string){
  const numberid =  parseInt(id,10)
  return  this.postsservice.dislikePosts(numberid)
 }

  
}


