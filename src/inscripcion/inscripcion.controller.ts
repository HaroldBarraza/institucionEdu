import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InscripcionService } from './inscripcion.service.js';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { UpdateEstadoInscripcionDto } from './dto/update-estado-inscripcion.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags("inscripcio")
@Controller('inscripcion')
@Roles(Role.ADMINISTRADOR,Role.ESTUDIANTE,Role.RECEPCIONISTA)
export class InscripcionController {
    constructor(private readonly inscripcionService: InscripcionService) {}
    @Get()
    findAll(){
        return this.inscripcionService.findall()
    }
    @Get(":id")
    findOne(@Param("id")id:number){
        return this.inscripcionService.findOne(+id)
    }
    @Post()
    create(dto:CreateInscripcionDto){
        return this.inscripcionService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateEstadoInscripcionDto){
        return this.inscripcionService.update(+id,dto)
    }
}
