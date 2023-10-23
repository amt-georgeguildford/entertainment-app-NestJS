import { Body, Controller, Post, Get, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ChangePassword, EmailValidator, LoginUser, SignupBody } from 'src/dto/auth';
import { AuthService } from './auth.service';
import {Request} from "express"
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordGuard } from 'src/guards/changePassword.guard';
@Controller('auth')
@UsePipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
}))
export class AuthController {

    constructor(private authService: AuthService){}
    @Post("login")
    @HttpCode(HttpStatus.CREATED)
    async login(@Body() loginUser: LoginUser){
        return this.authService.login(loginUser)
    }

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signUpBody: SignupBody){
        return this.authService.signup(signUpBody)
    }


    @Post("create-password")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPassword(@Body() changePassword: ChangePassword, @Req() req: Request){
        return this.authService.createPassword(req.user, changePassword)
    }

    @Post("request-password-reset")
    @HttpCode(HttpStatus.CREATED)
    async requestReset(@Body() requestResetBody: EmailValidator){
        return this.authService.requestResetPassword(requestResetBody)
    }

    @Get("verify-reset-link")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async validateResetPasswordLink(@Req() req: Request){
        return this.authService.validateResetPasswordLink(req.user)
    }

    @Post("reset-password")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async changePassword(@Body() changePassword: ChangePassword, @Req() req: Request){
        return this.authService.changePassword(req.user, changePassword)
    }
}
