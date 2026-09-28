import { Module } from '@nestjs/common';
import { HorarioService } from './horario.service.js';
import { HorarioController } from './horario.controller.js';

@Module({
  providers: [HorarioService],
  controllers: [HorarioController]
})
export class HorarioModule {}
