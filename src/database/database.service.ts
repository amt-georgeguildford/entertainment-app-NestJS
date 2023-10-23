import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {Prisma, User} from "@prisma/client"
import { SignupBody } from 'src/helper/types';
import { off } from 'process';
import { movieResponseFormat } from 'src/helper/databaseResponseFormat';

@Injectable()
export class DatabaseService {
    constructor(private readonly prisma: PrismaService){}
    async getUserBy(whereClause: Prisma.UserWhereInput){
        return await this.prisma.user.findFirst({
            where: whereClause
        })
    }

    async createUser(user: SignupBody){
        return await this.prisma.user.create({
            data: user,
        })
    }

    async updateUser(whereClause: Prisma.UserWhereUniqueInput, updateUser: Partial<User>, ){
        return await this.prisma.user.update({
            where: whereClause,
            data: updateUser
        })
    }

    async getMovie(movieId: string){
        const movie=  await this.prisma.movie.findFirst({
            where: {
                id: movieId
            },
            include: {
                category: true
            }
        })
        return movieResponseFormat(movie)
    }
    async getTrendingMovies(){
        const movies= await this.prisma.movie.findMany({
            where:{
                isTrending: true
            }, 
            include:{
                category: true
            }
        })
        return movies.map((movie)=>movieResponseFormat(movie))
    }

    async getRecommendedMovies(search: string, offset: number, take: number){
        let whereClause
        whereClause=search? {
            recommended: true,
            title: {
                contains: search,
                mode: "insensitive"
            }
        }: {
            recommended: true
        }

        const [movies, count]= await this.prisma.$transaction([

            this.prisma.movie.findMany({
                where: whereClause,
                skip: offset,
                take,
                include: {
                    category: true
                }
            }),
            this.prisma.movie.count({
                where: whereClause
            })
        ])
        const response={
            movies: movies.map((movie)=>movieResponseFormat(movie)),
            count,
        }
        return response
    }

    async getAllMovies(search: string, offset: number, take:number){
        let whereClause
        whereClause= search? {
            categoryId: 1,
            title: {
                contains: search,
                mode: "insensitive"
            }
        }: {
            categoryId: 1
        }
        const [movies, count]= await this.prisma.$transaction([
            this.prisma.movie.findMany({
                where: whereClause,
                skip: offset,
                take,
                include:{
                    category: true
                }
            }),
            this.prisma.movie.count({
                where: whereClause
            }),

        ])

        const response = {
            movies:movies.map((movie)=>movieResponseFormat(movie)),
            count
        }
        return response
    }

    async getAllTvSeries(search: string, offset:number, take: number){
        let whereClause
        whereClause= search? {
            categoryId: 2,
            title: {
                contains: search,
                mode: "insensitive"
            }
        }: {
            categoryId: 2
        }
        const [movies, count]= await this.prisma.$transaction([
            this.prisma.movie.findMany({
                where:whereClause,
                skip: offset,
                take,
                include: {
                    category: true
                }
            }),
            this.prisma.movie.count({
                where: whereClause
            })
        ])
        const response={
            movies: movies.map((movie)=>movieResponseFormat(movie)),
            count
        }
        return response
    }

    async getBookMarks(userId: string){
        const bookMarks= await this.prisma.bookMark.findMany({
            where:{
                userId
            },
            include:{
                movie: true
            }
        })

        return  bookMarks
    }

    async getBookmarkMovie(userId: string, movieId: string){
        return this.prisma.bookMark.findFirst({
            where: {
                userId,
                movieId
            }
        })
    }
    async createBookmarkMovie(movieId: string, userId: string){
        return await this.prisma.bookMark.create({
            data:{
                movieId,
                userId
            }
        })
    }
    async deleteBookmarkMovie(bookmarkId: string){
        return await this.prisma.bookMark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}
