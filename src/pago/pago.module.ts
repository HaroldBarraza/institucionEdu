import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';
import { MockPayController } from './mockpay.controoler.js';
import { MockpayService } from './mockpay.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [PagoService, MockpayService],
  controllers: [PagoController, MockPayController],
  exports: [PagoService, MockpayService], 
})
export class PagoModule {}