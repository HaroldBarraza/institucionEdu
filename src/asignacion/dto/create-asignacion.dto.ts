import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAsignacionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  grupo_id: number;

  @ApiProperty({ example: 5, description: 'id del docente que publica' })
  @IsInt()
  @IsPositive()
  docente_id: number;

  @ApiProperty({ example: 'Ensayo sobre derivadas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiProperty({ example: 'Resolver los ejercicios 1-10 del capítulo 3...' })
  @IsString()
  @IsNotEmpty()
  instrucciones: string;

  @ApiProperty({ example: '2026-04-15T23:59:00Z' })
  @Type(() => Date)
  @IsDate()
  fecha_limite: Date;
}