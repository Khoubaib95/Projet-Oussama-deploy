import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from 'src/@types/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: any) {
    const { email, password, first_name, last_name, phone_number, address } =
      createUserDto;

    return await this.authService.signUp(
      email,
      password,
      first_name,
      last_name,
      phone_number,
      address,
    );
  }

  @Post('signin')
  async signIn(@Body() signInDto: any) {
    const { email, password } = signInDto;

    return await this.authService.signIn(email, password);
  }
  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailBody: { auth_id: string; code: string },
    @Request() request: RequestWithUser,
  ) {
    /*return await this.authService.verifyEmail(
      verifyEmailBody.auth_id,
      verifyEmailBody.code,
    );*/
    return request.user;
  }

  @Post('reset-password')
  async resetpassword(
    @Body() resetPassword: { email: string; password: string; code: string },
  ) {
    return await this.authService.resetpassword(
      resetPassword.email,
      resetPassword.password,
      resetPassword.code,
    );
  }

  @Post('request-reset-password')
  async requestResetpassword(@Body() resetPassword: { email: string }) {
    return await this.authService.requestResetpassword(resetPassword.email);
  }
}
