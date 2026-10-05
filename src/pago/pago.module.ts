import { Module } from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';
import { MercadoPagoService } from './mercado-pago.service.js';
import { MercadoPagoController } from './mercadopago.controller.js';
import { MockPayController } from './mockpay.controoler.js';
import { MockpayService } from './mockpay.service.js';

@Module({
  providers: [PagoService, MockpayService],
  controllers: [PagoController, MockPayController],
  exports: [MockPayController]
})
export class PagoModule {}
