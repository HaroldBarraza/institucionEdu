import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMateriaDto {
  @ApiProperty({ example: 'Matemática I' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsPositive()
  creditos: number;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @Min(0)
  costo_inscripcion: number;

  @ApiProperty({ example: 250.0 })
  @IsNumber()
  @Min(0)
  costo_mensualidad: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  especialidad_id?: number;
}