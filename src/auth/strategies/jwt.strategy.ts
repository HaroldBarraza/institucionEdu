import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { EstadoUsuario } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtPayload } from '../decorators/current-user.decorator.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: payload.sub },
      select: {
        id_usuario: true,
        email: true,
        rol: true,
        estado: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no existe');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException(
        `Usuario no habilitado. Estado: ${usuario.estado}`,
      );
    }

    return {
      sub: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
    };
  }
}
