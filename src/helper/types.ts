export interface LoginBody{
    email: string
    password: string
}

export interface SignupBody{
    email: string
    firstname: string
    lastname: string
}

export interface CreatePasswordBody{
    password: string
    confirmPassword: string,
}

export interface JwtPayload{
    id: string
    email: string,
    firstname: string,
    lastname: string
}

export interface MovieExtension{
    category: {
        id: number;
        name: string;
    };
}

export interface PaginationSearch{
    page?: string
    search?: string
    size?: string
}
