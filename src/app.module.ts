import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PacientesModule } from './pacientes/pacientes.module.js';
import { EspecialidadesModule } from './especialidades/especialidades.module.js';
import { UsersModule } from './users/users.module.js';
import { EstadoCitasModule } from './estado_citas/estado_citas.module.js';
import { CitasModule } from './citas/citas.module.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(10).required(),
        PORT: Joi.number().default(3000)
      })
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'clinica',
    }),
    PrismaModule,
    PacientesModule,
    EspecialidadesModule,
    UsersModule,
    EstadoCitasModule,
    CitasModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService,{provide: APP_GUARD, useClass: JwtAuthGuard}, {provide:APP_GUARD,useClass: RolesGuard}],
})
export class AppModule {}
