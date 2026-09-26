import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterforBossDto{
    @ApiProperty({example: "Cardiologia"})
    @IsNotEmpty({message:"este campo es obligatorio"})
    @IsDateString()
    especialidad:string

    @ApiProperty({example:'2026-12-12'})
    @IsNotEmpty({message: "este campo es obligatorio"})
    @IsDateString()
    fecha_inicio:string

}