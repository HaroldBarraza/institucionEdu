import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ example: 10, description: 'id_usuario del usuario con rol ESTUDIANTE' })
  @IsInt()
  @IsPositive()
  id_estudiante: number;

  @ApiProperty({ example: 'MAT-2026-00001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  codigo_matricula: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  tutor_id?: number;
}