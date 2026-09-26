import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEspecialidadDto {
  @ApiProperty({ example: 'Cardiologia' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'la especialidad tiene que tener al menos 3 caracteres',
  })
  @Matches(/^[a-zA-záéóíúÁÉÍÚÓ\s]+$/, {
    message: 'solo se aceptan letras en nombre de especialidad',
  })
  @IsNotEmpty({ message: 'Este campo es obligatorio' })
  name_especialidad: string;

  @ApiProperty({ example: 'especialista en el corazon' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3, {
    message: 'la descripcion tiene que tener al menos 3 caracteres',
  })
  @Matches(/^[a-zA-záéóíúÁÉÍÚÓ\s]+$/, {
    message: 'solo se aceptan letras en la descripcion',
  })
  @IsNotEmpty({ message: 'Este campo es obligatorio' })
  descripcion_especialidad: string;
}
