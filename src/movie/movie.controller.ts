import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PaginationData } from 'src/dto/movie';
import { PaginationGuard } from 'src/guards/pagination.guard';

@Controller('api/v1')
@UseGuards(AuthGuard)
export class MovieController {
    constructor(private readonly movieService: MovieService){}

    @Get("trends")
    getTrending(){
        return this.movieService.getTrendingMovies()
    }

    @Get("movies")
    @UseGuards(PaginationGuard)
    getMovies(@Query() paginationData: PaginationData){
        return this.movieService.getAllMovies(paginationData)
    }

    @Get("recommended")
    @UseGuards(PaginationGuard)
    getRecommended(@Query() paginationData: PaginationData){
        return this.movieService.getRecommendedMovies(paginationData)
    }

    @Get("tvseries")
    @UseGuards(PaginationGuard)
    getTvseries(@Query() paginationData: PaginationData){
        return this.movieService.getTvSeries(paginationData)
    }
}
