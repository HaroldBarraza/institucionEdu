import { Module } from '@nestjs/common';
import { PagoService } from './pago.service.js';
import { PagoController } from './pago.controller.js';
import { MockPayController } from './mockpay.controoler.js';
import { MockpayService } from './mockpay.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ConfigModule, PrismaModule
  ],
  providers: [PagoService, MockpayService],
  controllers: [PagoController, MockPayController],
  exports: [MockPayController]
})
export class PagoModule {}
