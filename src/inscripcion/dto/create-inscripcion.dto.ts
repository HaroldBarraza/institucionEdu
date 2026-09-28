import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ example: 10, description: 'id del estudiante' })
  @IsInt()
  @IsPositive()
  estudiante_id: number;

  @ApiProperty({ example: 1, description: 'id del grupo' })
  @IsInt()
  @IsPositive()
  grupo_id: number;
}