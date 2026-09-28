import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { APP_GUARD } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config'
import { EspecialidadModule } from './especialidad/especialidad.module.js';
import { TutorModule } from './tutor/tutor.module.js';
import { PeriodoModule } from './periodo/periodo.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { DocenteModule } from './docente/docente.module.js';
import { EstudianteModule } from './estudiante/estudiante.module.js';
import { MateriaModule } from './materia/materia.module.js';
import { GrupoModule } from './grupo/grupo.module.js';
import { HorarioModule } from './horario/horario.module.js';
import { InscripcionModule } from './inscripcion/inscripcion.module.js';
import { ObligacionesModule } from './obligaciones/obligaciones.module.js';
import { PagoModule } from './pago/pago.module.js';
import { AsignacionModule } from './asignacion/asignacion.module.js';
import { EntregaModule } from './entrega/entrega.module.js';
import { EntregaArchivoModule } from './entrega-archivo/entrega-archivo.module.js';

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
    EspecialidadModule,
    TutorModule,
    PeriodoModule,
    UsuarioModule,
    DocenteModule,
    EstudianteModule,
    MateriaModule,
    GrupoModule,
    HorarioModule,
    InscripcionModule,
    ObligacionesModule,
    PagoModule,
    AsignacionModule,
    EntregaModule,
    EntregaArchivoModule,

  ],
  controllers: [AppController],
  providers: [AppService,/* {provide: APP_GUARD, useClass: JwtAuthGuard}, {provide:APP_GUARD,useClass: RolesGuard} */],
})
export class AppModule {}
