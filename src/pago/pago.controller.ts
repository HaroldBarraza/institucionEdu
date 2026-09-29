import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PagoService } from './pago.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { AprobarPagoDto } from './dto/aprobar-pago.dto.js';
import { RechazarPagoDto } from './dto/rechazar-pago.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags("pagos")
@ApiBearerAuth()
@Controller('pago')
@Roles(Role.ADMINISTRADOR,Role.RECEPCIONISTA)
export class PagoController {
    constructor(private readonly pagoService:PagoService){}

    @Get()
    findAll(){
        return this.pagoService.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.pagoService.findOne(+id)
    }
    @Post()
    @Roles(Role.ESTUDIANTE,Role.ADMINISTRADOR,Role.RECEPCIONISTA)
    create(@Body() dto:CreatePagoDto){
        return this.pagoService.create(dto)
    }
    @Patch(":id/aprobar")
    aprobar(@Param("id") id:string, @Body() dto:AprobarPagoDto){
        return this.pagoService.aprobar(+id, dto)
    }
    @Patch(":id/rechazar")
    rechazar(@Param("id") id:string, @Body() dto:RechazarPagoDto){
        return this.pagoService.rechazar(+id, dto)
    }

}
