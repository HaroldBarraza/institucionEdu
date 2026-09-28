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
import { EntregaArchivoService } from './entrega-archivo.service.js';
import { CreateEntregaArchivoDto } from './dto/create-entrega-archivo.dto.js';
import { UpdateEntregaArchivoDto } from './dto/update-entrega-archivo.dto.js';

@ApiTags('entrega-archivos')
@Controller('entrega-archivo')
export class EntregaArchivoController {
    constructor(private readonly entregarArchivoService: EntregaArchivoService){}
    @Get()
    findAll(){
        return this.entregarArchivoService.finAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.entregarArchivoService.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateEntregaArchivoDto){
        return this.entregarArchivoService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, dto:UpdateEntregaArchivoDto){
        return this.entregarArchivoService.update(+id, dto)
    }
}
