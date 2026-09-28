import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CalificarEntregaDto {
  @ApiProperty({ example: 5, description: 'id del docente que califica' })
  @IsInt()
  @IsPositive()
  calificado_docente: number;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  @Min(0)
  @Max(20)
  calificacion: number;
}