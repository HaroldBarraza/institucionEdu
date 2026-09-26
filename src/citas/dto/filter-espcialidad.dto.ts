import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterespecialidadDto {
  @ApiProperty({ example: '2026-12-25' })
  @IsNotEmpty({ message: 'este campo es obligatorio' })
  @IsDateString()
  fecha_inicio: string;
  @ApiProperty({ example: '2026-12-29' })
  @IsNotEmpty({ message: 'este campo es obligatorio' })
  @IsDateString()
  fecha_final: string;
}
