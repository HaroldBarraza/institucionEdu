import { Module } from '@nestjs/common';
import { AsignacionService } from './asignacion.service.js';
import { AsignacionController } from './asignacion.controller.js';

@Module({
  providers: [AsignacionService],
  controllers: [AsignacionController]
})
export class AsignacionModule {}
