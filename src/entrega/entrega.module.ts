import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service.js';
import { EntregaController } from './entrega.controller.js';

@Module({
  providers: [EntregaService],
  controllers: [EntregaController]
})
export class EntregaModule {}
