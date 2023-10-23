import {CanActivate, Injectable, ExecutionContext, BadRequestException} from "@nestjs/common"
import {Request} from "express"
@Injectable()
export class PaginationGuard implements CanActivate{
   
    canActivate(context: ExecutionContext){
       const req= context.switchToHttp().getRequest<Request>()
        let {search, page, size}= req.query as {search?: string, page?: string, size?: string}
        page= page? page: "1"
        size= size? size: "5"
        if(isNaN(parseInt(page)) || isNaN(parseInt(size))){
            throw new BadRequestException("Provide correct data into for pagination")
        }
        req.query.page= page
        req.query.size= size
       return true
    }
}