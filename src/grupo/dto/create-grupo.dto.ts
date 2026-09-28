import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { EstadoGrupo } from '../../generated/prisma/enums.js';

export class CreateGrupoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  materia_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  periodo_id: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  docente_id: number;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  cupo_maximo: number;

  @ApiProperty({ enum: EstadoGrupo, required: false })
  @IsEnum(EstadoGrupo)
  @IsOptional()
  estado?: EstadoGrupo;
}