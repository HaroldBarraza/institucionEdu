import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateEstudianteDto {
  @ApiProperty({ example: 2, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  tutor_id?: number;
}