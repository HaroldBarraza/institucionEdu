import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, Matches, IsInt,MaxDate, IsPositive,IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDocenteDto {
  @ApiProperty({ example: 'juan.perez@sgaf.com' })
  @IsEmail({}, { message: 'El correo tiene que estar en un formato válido' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, {
    message: 'el password tiene que tener como mínimo 6 caracteres',
  })
  password: string;

  @ApiProperty({ example: 'Juan' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el nombre tiene que tener como mínimo 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóúÁÉÍÓÚ\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, { message: 'el apellido debe tener como mínimo 3 caracteres' })
  @Matches(/^[a-zA-Z áéíóúÁÉÍÓÚ\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  appaterno: string;

  @ApiProperty({ example: 'Gómez' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'el apellido materno tiene que tener al menos 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóúÁÉÍÓÚ\s]+$/, {
    message: 'no se aceptan caracteres especiales',
  })
  apmaterno: string;

  @ApiProperty({ example: '+51987654321' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el número tiene que tener al menos 6 caracteres' })
  @Matches(/^[+\-\d]+$/, {
    message: 'el número solo puede contener números y el símbolo + y -',
  })
  telefono: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  especialidad_id: number;

  @ApiProperty({ example: '2024-03-15' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(new Date(), {
    message: 'la fecha nacimiento no puede ser una futura',
  })
  fechaContrato: Date;
}
