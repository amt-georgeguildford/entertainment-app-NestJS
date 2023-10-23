import { Movie } from "@prisma/client";
import { MovieExtension } from "./types";

export const movieResponseFormat= (movie: Movie & MovieExtension)=>{
    const category= movie.category.name
    delete movie.categoryId
    return {
        ...movie,
        category
    }
}