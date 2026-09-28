import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CreateDocenteDto {
  @ApiProperty({ example: 5, description: 'id_usuario del usuario con rol PROFESOR' })
  @IsInt()
  @IsPositive()
  id_docente: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  especialidad_id: number;

  @ApiProperty({ example: '2024-03-15' })
  @Type(() => Date)
  @IsDate()
  fechaContrato: Date;
}