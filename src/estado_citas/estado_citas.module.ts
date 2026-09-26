import { Module } from '@nestjs/common';
import { EstadoCitasController } from './estado_citas.controller.js';
import { EstadoCitasService } from './estado_citas.service.js';

@Module({
  controllers: [EstadoCitasController],
  providers: [EstadoCitasService]
})
export class EstadoCitasModule {}
