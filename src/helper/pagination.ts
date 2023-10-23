export const paginationGeneratePatch= (page: number, size: number)=>{
    const offset= (page-1)*size

    return {
        take: size, offset
    }
}

export const paginationInfo= (page: number, size: number, total: number, actualCount:number)=>{
    const totalPage=Math.ceil(total/size)
    const hasPrev= page>1
    const hasNext= page<total
    return{
        hasNext,hasPrev,totalItem: total,currentPage: page, totalPage
    }
}