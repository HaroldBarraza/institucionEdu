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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags("pagos")
@ApiBearerAuth()
@Controller('pago')
@Roles(Role.ADMINISTRADOR,Role.RECEPCIONISTA)
export class PagoController {
    constructor(private readonly pagoService:PagoService){}

    @ApiOperation({summary: "obtener la informacion de un pago realizado"})
    @Get()
    findAll(){
        return this.pagoService.findAll()
    }
    @ApiOperation({summary: "obtener lainformacion de un pago en concreto"})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.pagoService.findOne(+id)
    }
    @ApiOperation({summary: "crear un nuevo pago"})
    @Post()
    @Roles(Role.ADMINISTRADOR,Role.RECEPCIONISTA)
    create(@Body() dto:CreatePagoDto){
        return this.pagoService.create(dto)
    }
    @ApiOperation({summary: "actualizar el estado del pago"})
    @Patch(":id/aprobar")
    aprobar(@Param("id") id:string, @Body() dto:AprobarPagoDto){
        return this.pagoService.aprobar(+id, dto)
    }
    @ApiOperation({summary: "actuliza a rechazado el estado de pago"})
    @Patch(":id/rechazar")
    rechazar(@Param("id") id:string, @Body() dto:RechazarPagoDto){
        return this.pagoService.rechazar(+id, dto)
    }

}
