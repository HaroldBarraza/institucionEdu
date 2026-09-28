import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class RechazarPagoDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  verificado_por_usuario_id: number;
}