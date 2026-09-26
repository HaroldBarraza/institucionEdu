import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  IsEnum,
  IsOptional,
  IsInt,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { role } from '../../prisma/generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'example@example.com', required: false })
  @IsEmail({}, { message: 'El correo tiene que estar en un formato valido' })
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'password123', required: false })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el password tiene que tener como minimo 3 caracteres',
  })
  @IsOptional()
  password: string;

  @ApiProperty({ example: 'MEDICO' })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(role, {
    message: 'Rol invalido escoja entre RECEPCIONISTA o MEDICO o GERENCIA',
  })
  role: role;

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
  name_empleado: string;

  @ApiProperty({ example: 'Perez', required: false })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, { message: 'el apellido debe tener como minimo 3 caracteres' })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsOptional()
  appaterno: string;

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
  appmaterno: string;

  @ApiProperty({ example: '+51987654321' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el numero tiene que tener al menos 6 caracteres' })
  @Matches(/^[+\-\d]+$/, {
    message: 'el numero solo puede contener numeros y el simbolo + y -',
  })
  telefono: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt({ message: 'el id del paciente debe ser un numero entero' })
  @IsPositive({
    message: 'el id del paciente tiene que ser un numero positivo',
  })
  @Min(1, {
    message: 'el numero de especialidad numero tiene que ser mayor a 0',
  })
  @Max(3, { message: 'el numero de especialidad no tiene que ser mayor a 3' })
  id_especialidad?: number;
}
