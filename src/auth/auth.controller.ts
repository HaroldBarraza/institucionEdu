
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';
@ApiTags('Authenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
  @Public()
  @Post('register')
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }
}
