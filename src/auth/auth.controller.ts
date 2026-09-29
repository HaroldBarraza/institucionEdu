import {
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  HttpCode,
  Request,
  Get,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorators.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { JwtPayload } from './decorators/current-user.decorator.js';

@ApiTags('Authenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
  @ApiBearerAuth()
  @Get('perfil')
  perfil(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
