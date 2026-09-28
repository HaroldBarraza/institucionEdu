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
import { ObligacionesService } from './obligaciones.service.js';
import { CreateObligacionDto } from './dto/create-obligacion.dto.js';
import { UpdateObligacionDto } from './dto/update-obligacion.dto.js';
import { CambiarEstadoObligacionDto } from './dto/cambiar-estado-obligacion.dto.js';

@ApiTags('obligaciones')
@Controller('obligaciones')
export class ObligacionesController {
    constructor(private readonly obligacionservice: ObligacionesService) {}
    @Get()
    findAll(){
        return this.obligacionservice.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.obligacionservice.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateObligacionDto){
        return this.obligacionservice.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateObligacionDto){
        return this.obligacionservice.update(+id, dto)
    }
    @Patch(":id")
    updateestado(@Param("id") id:string, @Body() dto:CambiarEstadoObligacionDto){
        return this.obligacionservice.cambiarestado(+id, dto)
    }
}
