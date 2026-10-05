import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type{ Request } from 'express';
import { MockpayService } from './mockpay.service.js';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto.js';
import { Public } from '../auth/decorators/public.decorators.js';

@ApiTags('1.2 Pagos-Mockpay')
@ApiBearerAuth()
@Controller('pagos/mockpay')
export class MockPayController {
  constructor(private readonly mockPayService: MockpayService) {}

  @Post('checkout')
  @Public()
  @ApiOperation({ summary: 'Crea un checkout de MockPay' })
  crearCheckout(@Body() dto: CrearPreferenciaDto, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.mockPayService.crearCheckout(dto.obligacion_id, baseUrl);
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notificaciones de MockPay' })
  webhook(@Body() body: any) {
    return this.mockPayService.procesarWebhook(body);
  }

  @Get('exito')
  @Public()
  exito() {
    return { mensaje: 'Pago procesado exitosamente.' };
  }

  @Get('fallo')
  @Public()
  fallo() {
    return { mensaje: 'El pago ha fallado o fue cancelado.' };
  }
}

@Controller()
export class GlobalWebhookController {
  constructor(private readonly mockPayService: MockpayService) {}

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  webhookRaiz(@Body() body: any) {
    return this.mockPayService.procesarWebhook(body);
  }
}