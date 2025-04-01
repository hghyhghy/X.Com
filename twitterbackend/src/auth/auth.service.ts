
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prisma:PrismaService, private jwtService:JwtService){}
    async  hashPassword(password:string):Promise<string>{
        return  bcrypt.hash(password,10)
    }
    async validateuser(username:string,password:string):Promise<{id:number,username:string} | null>{
        const user  =  await this.prisma.user.findUnique({
            where:{username}
        })
        if(user && (await bcrypt.compare(password,user.password))){
            const {password,...rest} = user
            return rest
        }

        return null

    }

    async login(name:string,password:string){
        const user  =  await this.prisma.user.findUnique({
            where:{username:name}
        })
        if(!user){
            throw new UnauthorizedException("User not found")
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {name:user.username , sub:user.id}
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, name: user.username },
        };

    }

    async register(email:string, password:string , name:string){

        const hashedPassword  =  await this.hashPassword(password)
        return this.prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                username:name
            },
            select:{
                id:true,
                username:true,
                email:true
            }
        })
    }

    async  getUSerDetails(userId:number){
        const user  =  await this.prisma.user.findUnique({
            where:{id:userId},
            select:{id:true,username:true,email:true}
        })

        if(!user){
            throw new UnauthorizedException("user not found")
        }
        return user
    }


}
