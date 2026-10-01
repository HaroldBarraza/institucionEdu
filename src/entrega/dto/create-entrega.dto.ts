import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateEntregaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  asignacion_id: number;

  @ApiProperty({ example: 'Aquí está mi solución...', required: false })
  @IsString()
  @IsOptional()
  contenido_texto?: string;
}