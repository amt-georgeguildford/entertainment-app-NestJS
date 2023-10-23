import {IsOptional, } from"class-validator"
export class PaginationData{

    @IsOptional()
    search: string
    @IsOptional()
    page: string
    @IsOptional()
    size: string
}