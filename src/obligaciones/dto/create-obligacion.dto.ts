import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { RazonPago } from '../../generated/prisma/enums.js';

export class CreateObligacionDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @IsPositive()
  estudiante_id: number;

  @ApiProperty({ enum: RazonPago, example: RazonPago.MATRICULA })
  @IsEnum(RazonPago)
  razon: RazonPago;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({ example: '2026-03-15' })
  @Type(() => Date)
  @IsDate()
  fecha_vencimiento: Date;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  periodo_id?: number;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  inscripcion_id?: number;
}