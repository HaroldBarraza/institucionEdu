import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { MercadoPagoService } from './mercado-pago.service.js';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto.js';
import { Public } from '../auth/decorators/public.decorators.js';
import { ConfigService } from '@nestjs/config';

@ApiTags('1.2 Pagos-Mercadopago')
@ApiBearerAuth()
@Controller('pagos/mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mpService: MercadoPagoService,
    private readonly config: ConfigService,
  ) {}

  @Post('preference')
  @Public()
  @ApiOperation({ summary: 'Crear preferecias de pago Mercado Pago' })
  crearPreferencias(@Body() dto: CrearPreferenciaDto) {
    const baseUrl = this.config.get<string>('APP_BASE_URL')!;
    return this.mpService.crearPreferencia(dto.obligacion_id, baseUrl);
  }
  @ApiExcludeEndpoint()
  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de notificaciones de Mercado Pago' })
  webhook(
    @Query('type') type: string,
    @Query('data.id') dataId: string,
    @Body() body: any,
  ) {
    const paymentId = dataId || body?.data?.id;
    if (!paymentId) {
      throw new BadRequestException('Webhook sin payment id');
    }
    return this.mpService.procesarWebhook(String(paymentId));
  }
  @ApiExcludeEndpoint()
  @Public()
  @Get('exito')
  exito() {
    return { mensaje: 'Pago aprobado. Espera la aprobacion de recepcion' };
  }
  @ApiExcludeEndpoint()
  @Public()
  @Get('pendiente')
  pendiente() {
    return { mensaje: 'Pago pendiente. Espera la confirmacion' };
  }
  @ApiExcludeEndpoint()
  @Public()
  @Get('fallo')
  fallo() {
    return { mensaje: 'Pago rechazado. Intenta de nuevo.' };
  }
}
