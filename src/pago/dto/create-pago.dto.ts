import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { MetodoPago } from '../../generated/prisma/enums.js';

export class CreatePagoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  obligacion_id: number;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @Min(0.01)
  monto: number;

  @ApiProperty({ enum: MetodoPago, example: MetodoPago.CAJA })
  @IsEnum(MetodoPago)
  metodo: MetodoPago;

  @ApiProperty({ example: 'REF-123456', required: false })
  @IsString()
  @IsOptional()
  referencia_pasarela?: string;

  @ApiProperty({ example: 'https://.../comprobante.jpg', required: false })
  @IsString()
  @IsOptional()
  comprobante_url?: string;
}