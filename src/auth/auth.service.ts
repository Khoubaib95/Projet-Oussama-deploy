import {
  Injectable,
  BadRequestException,
  //ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Auth } from '../auth/entities/auth.entity';
import { User, UserRole } from '../user/entities/user.entity';
//import { CreateAuthDto } from './dto/create-auth.dto';
//import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private jwt: JwtService,
  ) {}

  async signUp(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
  ): Promise<any> {
    const existingAuth = await this.authRepository.findOne({
      where: { email },
    });
    if (existingAuth) {
      return { error: 'EMAIL_ALREADY_IN_USE' };
    }
    const hashedPassword = await this.hashPassword(password);
    const autId = uuid();
    const userId = uuid();
    const emailVerificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const auth = new Auth();
    auth.auth_id = autId;
    auth.user_id = userId;
    auth.email = email;
    auth.email_verification_code = emailVerificationCode;
    auth.password = hashedPassword;
    auth.reset_pwd_code = '';
    auth.createdAt = new Date();

    const user = new User();
    user.auth_id = autId;
    user.user_id = userId;
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_number = phone_number;
    user.address = address;
    user.role = UserRole.USER;
    user.auth = auth;

    //auth.user = user;
    try {
      const newAuth = await this.authRepository.save(auth);
      const newUser = await this.userRepository.save(user);
      /*this.sendmail({
        to: email,
        subject: 'Email Verfication',
        text: `Hello ${first_name} ${last_name}, thanks for registration\nthis is your verification code ${emailVerificationCode} do not share it with any one`,
      });*/
      const token = await this.signToken(
        newAuth.auth_id,
        newUser.user_id,
        newAuth.email,
        newUser.role,
      );
      return { message: 'success', token };
    } catch (err) {
      console.log('the error is => ');
      console.log(err);
    }
  }
  async signIn(email: string, password: string): Promise<any> {
    const auth = await this.authRepository.findOne({
      where: { email },
    });

    if (!auth) {
      throw new BadRequestException('WRONG_EMAIL');
    }
    const compareSuccess = await this.comparePasswords(auth.password, password);
    if (!compareSuccess) {
      throw new BadRequestException('WRONG_PASS');
    }
    const user = await this.userRepository.findOne({
      where: { user_id: auth.user_id },
    });

    delete auth.password;
    const token = await this.signToken(
      auth.auth_id,
      user.user_id,
      auth.email,
      user.role,
    );
    return { user: { ...auth, ...user }, token };
  }
  /*
  async update(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
  ): Promise<any> {
    const existingAuth = await this.authRepository.findOne({
      where: { email },
    });
    if (existingAuth) {
      return { error: 'EMAIL_ALREADY_IN_USE' };
    }
    const hashedPassword = await this.hashPassword(password);
    const autId = uuid();
    const userId = uuid();
    const emailVerificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const auth = new Auth();
    auth.auth_id = autId;
    auth.user_id = userId;
    auth.email = email;
    auth.email_verification_code = emailVerificationCode;
    auth.password = hashedPassword;
    auth.createdAt = new Date();

    const user = new User();
    user.auth_id = autId;
    user.user_id = userId;
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_number = phone_number;
    user.address = address;
    user.role = UserRole.USER;
    user.auth = auth;
    try {
      //save auth
      const newAuth = await this.authRepository.save(auth);
      //save user
      await this.userRepository.save(user);

      const token = await this.signToken(newAuth.auth_id, newAuth.email);

      return { sigup: 'success', token };
    } catch (err) {
      console.log('the error is => ');
      console.log(err);
    }
  }*/

  async verifyEmail(auth_id: string, code: string) {
    const existingAuth = await this.authRepository.findOneBy({ auth_id });
    if (!existingAuth) {
      return { error: 'WRONG_EMAIL' };
    }
    if (existingAuth.email_verification_code != code) {
      return { error: 'WRONG_CODE' };
    }
    existingAuth.email_verified = true;
    try {
      await this.authRepository.save(existingAuth);
      return { message: 'success' };
    } catch (err) {
      console.log('the error is => ');
      console.log(err);
    }
  }

  async resetpassword(email: string, password: string, code: string) {
    const existingAuth = await this.authRepository.findOneBy({ email });
    if (!existingAuth) {
      return { error: 'WRONG_EMAIL' };
    }
    if (existingAuth.reset_pwd_code != code) {
      return { error: 'WRONG_CODE' };
    }
    const newHashedPassword = await this.hashPassword(password);
    //const newHashedPassword = password;
    existingAuth.password = newHashedPassword;
    try {
      await this.authRepository.save(existingAuth);
      return { message: 'success' };
    } catch (err) {
      console.log('the error is => ');
      console.log(err);
    }
  }

  async requestResetpassword(email: string): Promise<any> {
    const existingAuth = await this.authRepository.findOneBy({ email });
    if (!existingAuth) {
      return { error: 'WRONG_EMAIL' };
    }
    try {
      const resetPwdCode = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
      existingAuth.reset_pwd_code = resetPwdCode;

      await this.authRepository.save(existingAuth);
      //send email with verification code
      /*this.sendmail({
        to: email,
        subject: 'Email Verfication',
        text: `Hello\nthis is your reset password verification code ${resetPwdCode} do not share it with any one`,
      });*/
      return { message: 'success' };
    } catch (err) {
      console.log(err);
    }
  }
  async hashPassword(password: string) {
    const saltOrRounds = 10;

    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(hash: string, password: string) {
    return await bcrypt.compare(password, hash);
  }
  async signToken(
    auth_id: string,
    user_id: string,
    email: string,
    role: string,
  ) {
    const payload = {
      auth_id,
      user_id,
      email,
      role,
    };
    const token = await this.jwt.signAsync(payload, {
      secret: 'your_secret_key',
    });

    return token;
  }

  async sendmail({ to, subject, text }) {
    const e = await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
    if (e.accepted[0] === to) {
      /*return {
        message: 'email send',
      };*/
    } else {
      //return { message: 'email not send' };
      throw new Error('email not send');
    }
  }
}
