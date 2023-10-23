import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { paginationGeneratePatch, paginationInfo } from 'src/helper/pagination';
import { PaginationSearch } from 'src/helper/types';

@Injectable()
export class MovieService {
    constructor(private readonly databaseService: DatabaseService){}
    async getAllMovies(paginationSearch: PaginationSearch){
        const {page,search,size}= paginationSearch
        const {offset,take}=paginationGeneratePatch(+page,+size)
        const {count,movies}= await this.databaseService.getAllMovies(search,offset,take)
        const pagination= paginationInfo(+page,+size,count, movies.length)
        return {
            data: {
                ...pagination,
                movies
            }
        }
    }
    async getTrendingMovies(){
        return await this.databaseService.getTrendingMovies()
    }
    async getRecommendedMovies(paginationSearch: PaginationSearch){
        const {page,search,size}= paginationSearch
        const {offset,take}=paginationGeneratePatch(+page,+size)
        const {count,movies}= await this.databaseService.getRecommendedMovies(search,offset, take)
        const pagination= paginationInfo(+page,+size,count, movies.length)
        return {
            data: {
                ...pagination,
                movies
            }
        }
    }

    async getTvSeries(paginationSearch: PaginationSearch){
        const {page,search,size}= paginationSearch
        const {offset,take}=paginationGeneratePatch(+page,+size)
        const {count,movies}= await this.databaseService.getAllTvSeries(search,offset, take)
        const pagination= paginationInfo(+page,+size,count, movies.length)
        return {
            data: {
                ...pagination,
                movies
            }
        }
    }

    async getBookMarkMovies(userId: string){
        return await this.databaseService.getBookMarks(userId)
    }

    async createDeleteBookmark(movieId: string, userId: string, state: boolean){
        const movieExist= await this.databaseService.getMovie(movieId)
        if(!movieExist){
            throw new BadRequestException("Movie does not exist")
        }

        if(state){
            const bookmark= await this.databaseService.createBookmarkMovie(movieId,userId)
            const response= {
                data:{
                    bookmark
                },
                message: "Added to bookmark"
            }
            return response
        }
        const bookmarkExist= await this.databaseService.getBookmarkMovie(userId, movieId)
        if(!bookmarkExist){
            throw new BadRequestException("Bookmark item does not exist")
        }
        const bookmark= await this.databaseService.deleteBookmarkMovie(bookmarkExist.id)
        const response={
            data: {
                bookmark
            },
            message: "Deleted from bookmark"
        }
        return response
    }
}
