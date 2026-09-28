import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAsignacionDto {
  @ApiProperty({ example: 'Ensayo sobre derivadas (actualizado)', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(150)
  titulo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  instrucciones?: string;

  @ApiProperty({ example: '2026-04-20T23:59:00Z', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fecha_limite?: Date;
}