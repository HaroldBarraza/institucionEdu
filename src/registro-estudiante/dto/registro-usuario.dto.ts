import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRegistroEstudianteDto {
  @ApiProperty({ example: 'juan.perez@sgaf.com' })
  @IsEmail({}, { message: 'El correo tiene que estar en un formato valido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, {
    message: 'el password tiene que tener como minimo 6 caracteres',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Juan' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el nombre tiene que tener como minimo 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, { message: 'el apellido debe tener como minimo 3 caracteres' })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  apmaterno: string;

  @ApiProperty({ example: '+51987654321' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el numero tiene que tener al menos 6 caracteres' })
  @Matches(/^[+\-\d]+$/, {
    message: 'el numero solo puede contener numeros y el simbolo + y -',
  })
  @IsNotEmpty()
  telefono: string;
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  tutor?: number;
}
