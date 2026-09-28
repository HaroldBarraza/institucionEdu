import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEntregaDto {
  @ApiProperty({ example: 'Contenido actualizado...', required: false })
  @IsString()
  @IsOptional()
  contenido_texto?: string;
}