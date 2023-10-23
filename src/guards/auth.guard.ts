import {Injectable,CanActivate, ExecutionContext, ArgumentsHost, UnauthorizedException, ForbiddenException } from "@nestjs/common"
import {Request} from "express"
import {JwtService} from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { JwtPayload } from "src/helper/types"
@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService){

    }
    canActivate(context : ExecutionContext){
        
        const req= context.switchToHttp().getRequest<Request>()
         const {authorization}= req.headers
         if(!authorization || typeof authorization !== 'string'){
             throw new UnauthorizedException("Missing Token")
         }
         const[tokenType, token]= authorization.split(" ")
         if(tokenType!== "Bearer"){
             throw new UnauthorizedException("Missing Token")
         }
         const secret= this.configService.get("ACCESS_TOKEN_SECRET")
         const verify= this.verifyToken(token, secret)
         req.user= verify
         return true
    }
    
    verifyToken(token: string, secret: string){
        try {
            return this.jwtService.verify(token,{secret})
        } catch (error) {
            throw new ForbiddenException("Session Ended or Expired")
        }
    }

}

