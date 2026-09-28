import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PagoService } from './pago.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { AprobarPagoDto } from './dto/aprobar-pago.dto.js';
import { RechazarPagoDto } from './dto/rechazar-pago.dto.js';

@ApiTags("pagos")
@Controller('pago')
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
