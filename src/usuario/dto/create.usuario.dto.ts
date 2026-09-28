import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';
import { Transform } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'juan.perez@sgaf.com' })
  @IsEmail({}, { message: 'El correo tiene que estar en un formato valido' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, {
    message: 'el password tiene que tener como minimo 6 caracteres',
  })
  password: string;

  @ApiProperty({ example: 'Juan'})
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el nombre tiene que tener como minimo 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  nombre: string;

  @ApiProperty({ example: 'Perez'})
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, { message: 'el apellido debe tener como minimo 3 caracteres' })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  appaterno: string;

  @ApiProperty({ example: 'Garcia' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el apellido materno tiene que tener almenos 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  apmaterno: string;

  @ApiProperty({ example: '+51987654321' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el numero tiene que tener al menos 6 caracteres' })
  @Matches(/^[+\-\d]+$/, {
    message: 'el numero solo puede contener numeros y el simbolo + y -',
  })
  telefono: string;

  @ApiProperty({
    enum: [Role.ADMINISTRADOR, Role.RECEPCIONISTA, Role.PROFESOR],
  })
  @IsEnum(Role)
  rol: Role;
}
