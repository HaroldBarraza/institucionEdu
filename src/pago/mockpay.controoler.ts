import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'crea un pago de mockpay' })
  crearCheckout(@Body() dto: CrearPreferenciaDto) {
    return this.mockPayService.crearCheckout(dto.obligacion_id);
  }
  @ApiExcludeEndpoint()
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notificaciones de MockPay (S2S)' })
  webhook(@Body() body: any) {
    if (!body || (!body.id && !body.status)) {
      throw new BadRequestException('Payload de webhook inválido');
    }
    return this.mockPayService.procesarWebhook(body);
  }

  @ApiExcludeEndpoint()
  @Public()
  @Get('exito')
  exito() {
    return {
      mensaje:
        'Pago procesado exitosamente. La actualización dependerá de la confirmación del webhook.',
    };
  }

  @ApiExcludeEndpoint()
  @Public()
  @Get('fallo')
  fallo() {
    return { mensaje: 'El pago ha fallado o fue cancelado.' };
  }
}
