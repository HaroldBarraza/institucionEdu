import { Controller, Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { createEspecialidadDto } from './dto/create.especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update.especialidad.dto.js';
import { dot } from 'node:test/reporters';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';


@ApiTags("especialidad")
@ApiBearerAuth()
@Controller('especialidad')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class EspecialidadController {
    constructor(private readonly especialidadService: EspecialidadService){}
    @ApiOperation({summary: "se obtiene la lista de especialidades"})
    @Get()
    findAll(){
        return this.especialidadService.findall()
    }
    @ApiOperation({summary: "se obtiene una especialidad"})
    @Get(":id")
    findOne(@Param('id') id:string){
        return this.especialidadService.findone(+id)
    }
    @ApiOperation({summary: "crea una nueva especializacion"})
    @Post()
    create(@Body() dto:createEspecialidadDto){
        return this.especialidadService.create(dto)
    }
    @ApiOperation({summary: "actuliza la informacion de un especializacion"})
    @Patch(":id")
    update(@Body() dto:UpdateEspecialidadDto, @Param("id")id:string){
        return this.especialidadService.update(+id, dto)
    }
}
