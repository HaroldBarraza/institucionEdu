import { Module } from '@nestjs/common';
import { EspecialidadesController } from './especialidades.controller.js';
import { EspecialidadesService } from './especialidades.service.js';

@Module({
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService]
})
export class EspecialidadesModule {}
