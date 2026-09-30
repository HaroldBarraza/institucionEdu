import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CrearPreferenciaDto {
  @ApiProperty({ example: 1, description: 'id de la obligación a pagar' })
  @IsInt()
  @IsPositive()
  obligacion_id: number;
}