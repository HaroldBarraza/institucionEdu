import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ example: 1, description: 'id del grupo' })
  @IsInt()
  @IsPositive()
  grupo_id: number;
}