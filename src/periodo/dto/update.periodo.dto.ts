import { PartialType } from '@nestjs/swagger';
import { CreatePeriododto } from '../dto/create.periodo.dto.js';
import { IsEnum } from 'class-validator';
import { EstadoPeriodo } from '../../generated/prisma/enums.js';

export class CambiarEstadoPeriododto{
    @IsEnum(EstadoPeriodo,{message:"tiene que ser un estado valido ACTIVO, CANCELADO"})
    estado:EstadoPeriodo
}