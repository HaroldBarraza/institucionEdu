import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoDeuda } from '../../generated/prisma/enums.js';

export class CambiarEstadoObligacionDto {
  @ApiProperty({ enum: EstadoDeuda, example: EstadoDeuda.PAGADO })
  @IsEnum(EstadoDeuda, {
    message:
      'estado inválido. Valores permitidos: PENDIENTE, PAGADO, CANCELADO, VENCIDO',
  })
  estado: EstadoDeuda;
}