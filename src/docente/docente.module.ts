import { Module } from '@nestjs/common';
import { DocenteService } from './docente.service.js';
import { DocenteController } from './docente.controller.js';

@Module({
  providers: [DocenteService],
  controllers: [DocenteController]
})
export class DocenteModule {}
