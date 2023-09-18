import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto): Promise<string> {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDto): Promise<string> {
    return this.authService.signin(body);
  }
}
