import { Module } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { EspecialidadController } from './especialidad.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [EspecialidadService],
  controllers: [EspecialidadController]
})
export class EspecialidadModule {}
