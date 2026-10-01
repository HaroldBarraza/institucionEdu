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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorators.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { JwtPayload } from './decorators/current-user.decorator.js';

@ApiTags('2.3 Authenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({summary:"Inicio de sesion", description: "el login para que los usuarios se puedan logear"})
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
  @ApiBearerAuth()
  @ApiOperation({summary: "Ve perfil de usuario logueado", description: "para ver el perfil del usuario logeado"})
  @Get('perfil')
  perfil(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
