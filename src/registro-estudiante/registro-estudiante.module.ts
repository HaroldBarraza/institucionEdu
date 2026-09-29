import { Module } from '@nestjs/common';
import { RegistroEstudianteService } from './registro-estudiante.service.js';
import { RegistroEstudianteController } from './registro-estudiante.controller.js';

@Module({
  providers: [RegistroEstudianteService],
  controllers: [RegistroEstudianteController]
})
export class RegistroEstudianteModule {}
