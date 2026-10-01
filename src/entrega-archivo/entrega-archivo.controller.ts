import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EntregaArchivoService } from './entrega-archivo.service.js';
import { CreateEntregaArchivoDto } from './dto/create-entrega-archivo.dto.js';
import { UpdateEntregaArchivoDto } from './dto/update-entrega-archivo.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('1.5 Entrega-archivos')
@Controller('entrega-archivo')
@Roles(Role.ADMINISTRADOR, Role.ESTUDIANTE, Role.PROFESOR)
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
    update(@Param("id") id:string, @Body() dto:UpdateEntregaArchivoDto){
        return this.entregarArchivoService.update(+id, dto)
    }
}
