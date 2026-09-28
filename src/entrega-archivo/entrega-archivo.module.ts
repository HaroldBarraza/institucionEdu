import { Module } from '@nestjs/common';
import { EntregaArchivoController } from './entrega-archivo.controller.js';
import { EntregaArchivoService } from './entrega-archivo.service.js';

@Module({
  controllers: [EntregaArchivoController],
  providers: [EntregaArchivoService]
})
export class EntregaArchivoModule {}
