import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class createEspecialidadDto {
  @ApiProperty({ example: 'Matematica', required: true })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'el nombre no puede estar vacio' })
  nombre: string;
  @ApiProperty({
    example: 'Es sobre las matematicas naturales',
    required: false,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Optional()
  @MinLength(1, { message: 'el nombre no puede estar vacio' })
  descripcion?: string;
}
