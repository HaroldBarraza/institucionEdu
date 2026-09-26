import { IsDateString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FilterestadoDto{
    @ApiProperty({example:"2026-12-25"})
    @IsNotEmpty({message: "el campo es obligatorio"})
    @IsDateString()
    fecha: string

}