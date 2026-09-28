import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive, Matches } from 'class-validator';
import { Dias } from '../../generated/prisma/enums.js';

export class CreateHorarioGrupoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  grupo_id: number;

  @ApiProperty({ enum: Dias, example: Dias.LUNES })
  @IsEnum(Dias)
  dia_semana: Dias;

  @ApiProperty({ example: '08:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hora_inicio debe tener formato HH:mm',
  })
  hora_inicio: string;

  @ApiProperty({ example: '10:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hora_fin debe tener formato HH:mm',
  })
  hora_fin: string;
}