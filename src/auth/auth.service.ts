import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import {
  CreatePasswordBody,
  JwtPayload,
  LoginBody,
  SignupBody,
} from 'src/helper/types';
import {
  decryptPassword,
  encryptPassword,
} from 'src/helper/passwordEncryption';
import { ConfigService } from '@nestjs/config';
import { get } from 'http';
@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(loginBody: LoginBody) {
    const { email, password } = loginBody;
    const userExist = await this.databaseService.getUserBy({ email });
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    if (!userExist.isActive) {
      throw new BadRequestException('Create new paasword to active account');
    }
    const PASSWORD_SECRET = this.configService.get<string>('PASSWORD_SECRET');
    const verifyPassword = decryptPassword(
      password,
      userExist.password,
      PASSWORD_SECRET,
    );
    if (!verifyPassword) {
      throw new BadRequestException('User does not exist');
    }
    const payload = {
      id: userExist.id,
      email: userExist.email,
      firstname: userExist.firstname,
      lastname: userExist.lastname,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '4h',
    });
    const currentDate = new Date().getTime();
    const expirationTime = 4 * 60 * 60 * 1000;
    const expiresIn = new Date(currentDate + expirationTime);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '1d',
    });
    const whereClause = {
      id: userExist.id,
    };
    await this.databaseService.updateUser(whereClause, {
      token: refreshToken,
    });
    const response = {
      user: {
        id: userExist.id,
        email: userExist.email,
        firstname: userExist.firstname,
        lastname: userExist.lastname,
        isActive: userExist.isActive
      },
      session: {
        accessToken,
        expiresIn,
      },
    };
    return response;
  }

  async signup(signupBody: SignupBody) {
    const userExist = await this.databaseService.getUserBy({
      email: signupBody.email,
    });

    if (userExist) {
      throw new BadRequestException('User already exist');
    }
    const defaultPassword= "User@123"
    const hashedPassword= encryptPassword(defaultPassword,this.configService.get("PASSWORD_SECRET"))
    const createUser = await this.databaseService.createUser(signupBody);
    const {id, firstname,lastname, email, isActive, createdAt}= createUser
    const user={id,email, firstname, lastname, isActive, createdAt}
    const payload= {
      id,email,firstname,lastname,
    }
    const resetToken= this.jwtService.sign(payload, {secret: this.configService.get("ACCESS_TOKEN_SECRET"),expiresIn:"10h"})

    return {user, resetToken};
  }

  async createPassword(
    user: JwtPayload,
    createPasswordBody: CreatePasswordBody,
  ) {
    const { password,confirmPassword } = createPasswordBody;
    if(password!==confirmPassword){
      throw new BadRequestException("Passwords  must match")
    }
    const userExit = await this.databaseService.getUserBy({ id: user.id });
    if (!userExit) {
      throw new BadRequestException('User does not exist');
    }
    if (userExit.isActive || userExit.password) {
      throw new BadRequestException('Password has already been created');
    }

    const passwordSecret = this.configService.get<string>('PASSWORD_SECRET');
    const hashed = encryptPassword(password, passwordSecret);
    const whereClause = {
      id: userExit.id,
    };
    await this.databaseService.updateUser(whereClause, {
      password: hashed,
      isActive: true,
    });
    const response = {
      mesaage: 'Password created successfully.',
    };
    return response;
  }

  async changePassword(
    user: JwtPayload,
    changePasswordBody: CreatePasswordBody,
  ) {
    const { password } = changePasswordBody;
    const userExist = await this.databaseService.getUserBy({ id: user.id });
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    if (!userExist.reset) {
      throw new UnauthorizedException('Session ended');
    }
    const passwordSecret = this.configService.get('PASSWORD_SECRET');
    const hashed = encryptPassword(password, passwordSecret);

    const whereClause = {
      id: user.id,
    };
    await this.databaseService.updateUser(whereClause, {
      password: hashed,
      reset: false,
    });
    const response ={
      message: "Password successfully reset. Login with new credential"
    }
    return response
  }

  async requestResetPassword({email}: {email: string}){
    const userExist= await this.databaseService.getUserBy({email})
    if(!userExist){
        throw new BadRequestException("User does not exist")
    }
    const payload={
        id: userExist.id,
        email: userExist.email,
        firstname: userExist.firstname,
        lastname: userExist.lastname
    }
    const sessionToken = this.jwtService.sign(payload, {
        secret: this.configService.get("ACCESS_TOKEN_SECRET"), expiresIn: "4m"
    })
    const whereClause={
        id: userExist.id
    }
    await this.databaseService.updateUser(whereClause, {reset: true})
    const response={
        message: "Request to reset password successful. Check mail for the next step",
        sessionToken
    }
    return response
  }

  async validateResetPasswordLink(user: JwtPayload){
    console.log(user)
    const userExist= await this.databaseService.getUserBy({id: user.id})
    if(!userExist){
        throw new BadRequestException("User does not exist")
    }
    if(!userExist.reset){
        throw new UnauthorizedException("Session has been used")
    }
    const response={
        message: "link verified"
    }
    return response
  }
}
