import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoUsuario } from '../../generated/prisma/enums.js';

export class CambiarEstadoUsuarioDto {
  @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
  @IsEnum(EstadoUsuario, {
    message:
      'estado inválido. Valores permitidos: PENDIENTE_APROBACION, ACTIVO, SUSPENDIDO_MORA, INACTIVO',
  })
  estado: EstadoUsuario;
}