import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateDocenteDto {
  @ApiProperty({ example: 2, required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  especialidad_id?: number;

  @ApiProperty({ example: '2024-03-15', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaContrato?: Date;
}