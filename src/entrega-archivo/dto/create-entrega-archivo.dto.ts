import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateEntregaArchivoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entrega_id: number;

  @ApiProperty({ example: 'https://storage.sgaf.com/entregas/ensayo.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url: string;

  @ApiProperty({ example: 'ensayo.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mimeType: string;
}