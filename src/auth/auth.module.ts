import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { LocalStrategy } from './strategies/local.strategies.js';
import { UsuarioModule } from '../usuario/usuario.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    UsuarioModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(ConfigService:ConfigService) => ({
        secret:ConfigService.get<string>('JWT_SECRET') as StringValue,
        signOptions:{
            expiresIn: ConfigService.get<string>('JWT_EXPIRE_IN') as StringValue
        }
      }) 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
