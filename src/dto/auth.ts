import {IsEmail, IsString, IsNotEmpty, IsOptional, IsStrongPassword} from "class-validator"

export class SignupBody{

    @IsNotEmpty({message: "Provide a valid email"})
    @IsString({message: "Provide a valid email"})
    @IsEmail()
    email: string
    
    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    lastname: string
}

export class LoginUser{

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class ChangePassword{
    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @IsNotEmpty()
    @IsStrongPassword()
    confirmPassword: string

}

export class EmailValidator{
    @IsNotEmpty({message: "Provide a valid email"})
    @IsString({message: "Provide a valid email"})
    @IsEmail()
    email: string
}