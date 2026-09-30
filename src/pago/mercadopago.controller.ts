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
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { MercadoPagoService } from './mercado-pago.service.js';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto.js';
import { Public } from '../auth/decorators/public.decorators.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('pagos-mercadopago')
@ApiBearerAuth()
@Controller('pagos/mercadopago')
export class MercadoPagoController {
  constructor(private readonly mpService: MercadoPagoService) {}

  @Post('preference')
  @Roles(Role.ADMINISTRADOR, Role.ESTUDIANTE, Role.RECEPCIONISTA)
  @ApiOperation({ summary: 'Crear preferecias de pago Mercado Pago' })
  crearPreferencias(@Body() dto: CrearPreferenciaDto, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.mpService.crearPreferencia(dto.obligacion_id, baseUrl);
  }
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
  @Public()
  @Get('exito')
  exito() {
    return { mensaje: 'Pago aprobado. Espera la aprobacion de recepcion' };
  }
  @Public()
  @Get('pendiente')
  pendiente() {
    return { mensaje: 'Pago pendiente. Espera la confirmacion' };
  }
  @Public()
  @Get('fallo')
  fallo() {
    return { mensaje: 'Pago rechazado. Intenta de nuevo.' };
  }
}
