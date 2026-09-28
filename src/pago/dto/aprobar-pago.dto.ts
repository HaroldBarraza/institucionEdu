import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AprobarPagoDto {
  @ApiProperty({
    example: 2,
    description: 'id_usuario del recepcionista que verificó el pago',
  })
  @IsInt()
  @IsPositive()
  verificado_por_usuario_id: number;
}