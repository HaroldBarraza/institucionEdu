import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateObligacionDto {
  @ApiProperty({ example: 550.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  monto?: number;

  @ApiProperty({ example: '2026-03-20', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fecha_vencimiento?: Date;
}