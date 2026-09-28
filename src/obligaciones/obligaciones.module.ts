import { Module } from '@nestjs/common';
import { ObligacionesController } from './obligaciones.controller.js';
import { ObligacionesService } from './obligaciones.service.js';

@Module({
  controllers: [ObligacionesController],
  providers: [ObligacionesService]
})
export class ObligacionesModule {}
