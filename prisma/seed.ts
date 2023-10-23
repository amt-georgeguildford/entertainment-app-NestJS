import { PrismaClient } from "@prisma/client"
import data from "./data";
const prisma= new PrismaClient();
(
    async ()=>{
        try {
            await prisma.$connect()
            const categorys=await prisma.category.createMany({
                data:[
                    {
                        id: 1,
                        name: "Movie",
                    },
                    {
                        id: 2,
                        name: "TV Series",
                    },
                ]
            })
            data.forEach(async (item)=>{
                const {title, rating, year, isTrending, category, thumbnail}= item
                let categoryConnect= category==="Movie"? {
                    connect:{
                        id:1
                    }
                }:
                {
                    connect: {
                        id: 2
                    }
                }
                const movie= await prisma.movie.create({
                    data:
                        {
                            title,
                            rating,
                            isTrending,
                            recommended: true,
                            year,
                            category: categoryConnect,
                            
                        }
                    
                })
                const thumbnailType= Object.keys(thumbnail)
                console.log(thumbnailType)
                const thumbnailURL= thumbnailType.map((type)=>{
                    const obj= thumbnail[type]
                    return {
                        ...obj,
                        type,
                        movieId: movie.id
                    } 
                })
                await prisma.thumbNail.createMany({
                    data:thumbnailURL
                })
            })

            await prisma.$disconnect()
        } catch (error) {
            console.log(error)
            await prisma.$disconnect()
        }
    }
)()