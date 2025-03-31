
import { Body, Controller, Post , NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {

    constructor(private  readonly  authService:AuthService){}

    @Post('register')
    async register(@Body()  body: {email:string,  password:string,  username:string}){
        return this.authService.register(body.email ,  body.password ,  body.username)
    }

    @Post('login')
    async  login(@Body() body:{username:string, password:string}){
        const user  =  await this.authService.validateUSer(body.username , body.password)
        if(!user){
            throw  new NotFoundException("Invalid Credentials")
        }
        return this.authService.login(body.username, body.password)
    }
}
