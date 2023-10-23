import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common"
import { Observable } from "rxjs"
import {Request} from "express"


@Injectable()
export class ChangePasswordGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req= context.switchToHttp().getRequest<Request>()
        const {password, confirmPassword}= req.body as {password: string, confirmPassword: string}
        if(password!==confirmPassword){
            return false 
        }
        return true
    }
}