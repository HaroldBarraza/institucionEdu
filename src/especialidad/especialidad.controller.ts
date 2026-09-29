import { Controller, Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { createEspecialidadDto } from './dto/create.especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update.especialidad.dto.js';
import { dot } from 'node:test/reporters';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';


@ApiTags("especialidad")
@ApiBearerAuth()
@Controller('especialidad')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class EspecialidadController {
    constructor(private readonly especialidadService: EspecialidadService){}
    
    @Get()
    findAll(){
        return this.especialidadService.findall()
    }
    @Get(":id")
    findOne(@Param('id') id:string){
        return this.especialidadService.findone(+id)
    }
    @Post()
    create(@Body() dto:createEspecialidadDto){
        return this.especialidadService.create(dto)
    }
    @Patch(":id")
    update(@Body() dto:UpdateEspecialidadDto, @Param("id")id:string){
        return this.especialidadService.update(+id, dto)
    }
}
