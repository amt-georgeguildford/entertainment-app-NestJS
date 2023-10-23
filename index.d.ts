declare global{
    namespace Express{
        interface Request{
            user: {
                id: string,
                email: string,
                firstname: string,
                lastname: string
            }
        }
    }
}

export {}