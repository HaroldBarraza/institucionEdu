import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  MinDate,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCitasDto {
  @ApiProperty({ example: '2026-10-01' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message: 'la fecha de la cita no puede ser una fecha pasada',
  })
  @IsNotEmpty({ message: 'la fecha de la cita es obligatorio' })
  fecha_de_cita: Date;

  @ApiProperty({ example: '14:40' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'la hora debe estar en formato HH:mm ejmeplo 14:40',
  })
  @IsNotEmpty({ message: 'la hora de la cita es obligatorio' })
  hora_de_cita: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'el id del medico debe ser un numero entero' })
  @IsPositive({ message: 'el id del medico tiene que ser un numero positivo' })
  id_medico: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'el id del paciente debe ser un numero entero' })
  @IsPositive({
    message: 'el id del paciente tiene que ser un numero positivo',
  })
  id_paciente: number;

  @ApiProperty({ example: 'el paciente experimenta fuerte dolor de cabeza' })
  @IsNotEmpty({ message: 'el campo de descripcion es obligatorio' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'la descripcion debe tener como minimo 3 caracteres',
  })
  @Matches(/^[a-zA-Z áéíóú\s]+$/, {
    message: 'no se aceptan caracteres especiales en la descripcion',
  })
  descripcion: string;
}
