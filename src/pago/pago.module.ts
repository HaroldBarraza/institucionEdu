import { Module } from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';
import { MercadoPagoService } from './mercado-pago.service.js';
import { MercadoPagoController } from './mercadopago.controller.js';

@Module({
  providers: [PagoService, MercadoPagoService],
  controllers: [PagoController, MercadoPagoController],
  exports: [MercadoPagoService]
})
export class PagoModule {}
