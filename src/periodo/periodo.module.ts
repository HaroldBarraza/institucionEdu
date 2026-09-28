import { Module } from '@nestjs/common';
import { PeriodoController } from './periodo.controller.js';
import { PeriodoService } from './periodo.service.js';

@Module({
  controllers: [PeriodoController],
  providers: [PeriodoService]
})
export class PeriodoModule {}
