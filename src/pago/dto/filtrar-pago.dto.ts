import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RazonPago } from '../../generated/prisma/enums.js';

export class FiltroPagoDto {
  @ApiProperty({
    enum: RazonPago,
    required: false,
    example: RazonPago.MATRICULA,
    description: 'Filtrar por tipo de pago: MATRICULA, MENSUALIDAD u OTRO',
  })
  @IsEnum(RazonPago)
  @IsOptional()
  razon?: RazonPago;
}