import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorDto {
  @ApiProperty({ example: 'Pablo' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1, { message: 'este campo no puede estar vacio' })
  @IsNotEmpty()
  nombre: string;
  @ApiProperty({ example: 'Perez' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1, { message: 'este campo no puede estar vacio' })
  @IsNotEmpty()
  appaterno: string;
  @ApiProperty({ example: 'Garcia' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1, { message: 'este campo no puede estar vacio' })
  @IsNotEmpty()
  apmaterno: string;

  @ApiProperty({ example: '+51987654321' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6, { message: 'el numero tiene que tener al menos 6 caracteres' })
  @Matches(/^\+?\d+$/, {
    message: 'el numero solo puede contener numeros y el simbolo + ',
  })
  telefono: string;
  @ApiProperty({ example: 'example@example.com' })
  @IsEmail({}, { message: 'El correo tiene que estar en un formato valido' })
  email: string;
}
