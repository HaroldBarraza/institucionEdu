import { Type } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  Min,
  IsNumber,

} from 'class-validator';
import { EstadoPeriodo } from '../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePeriododto {
  @ApiProperty({ example: '2026'})
  @Type(()=> Number)
  @IsInt()
  @Min(new Date().getFullYear())
  year: number;
}
