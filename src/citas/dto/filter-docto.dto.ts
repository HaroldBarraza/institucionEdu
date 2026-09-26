import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class filterDoctorDto {
  @ApiProperty({ example: '2026-12-25', description: 'YYYY-MM-DD' })
  @IsNotEmpty({ message: 'el campo es obligatorio' })
  @IsDateString()
  fecha_inicio: string;
  @ApiProperty({ example: '2026-12-26', description: 'YYYY-MM-DD' })
  @IsNotEmpty({ message: 'el campo es obligatorio' })
  @IsDateString()
  fecha_final: string;
}
