import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoInscripcion } from '../../generated/prisma/enums.js';

export class UpdateEstadoInscripcionDto {
  @ApiProperty({ enum: EstadoInscripcion, example: EstadoInscripcion.RETIRADO })
  @IsEnum(EstadoInscripcion)
  estado: EstadoInscripcion;
}