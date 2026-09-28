import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';
import { Transform } from 'class-transformer';

export class UpdateUsuarioDto {
  @ApiProperty({ example: 'Juan', required: false })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el nombre tiene que tener como minimo 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsOptional()
  nombre?: string;
  @ApiProperty({ example: 'Perez', required: false })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, { message: 'el apellido debe tener como minimo 3 caracteres' })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsOptional()
  appaterno?: string;

  @ApiProperty({ example: 'Garcia', required: false })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el apellido materno tiene que tener almenos 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsOptional()
  apmaterno?: string;

  @ApiProperty({ example: '+51987654321', required:false})
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el numero tiene que tener al menos 6 caracteres' })
  @Matches(/^[+\-\d]+$/, {
    message: 'el numero solo puede contener numeros y el simbolo + y -',
  })
  @IsOptional()
  telefono?: string;
}
