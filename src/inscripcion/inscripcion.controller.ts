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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { CurrentUser} from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags("1.3 Inscripcion")
@Controller('inscripcion')
@Roles(Role.ADMINISTRADOR,Role.ESTUDIANTE,Role.RECEPCIONISTA)
export class InscripcionController {
    constructor(private readonly inscripcionService: InscripcionService) {}
    @ApiOperation({summary: "obtiene toda las incripciones"})
    @Get()
    findAll(){
        return this.inscripcionService.findall()
    }
    @ApiOperation({summary: "se obtiene la informacion de una inscripcion"})
    @Get(":id")
    findOne(@Param("id")id:number){
        return this.inscripcionService.findOne(+id)
    }
    @ApiOperation({summary: "crea una nueva inscripcion"})
    @Post()
    create(@Body()dto:CreateInscripcionDto, @CurrentUser() user:JwtPayload){
        return this.inscripcionService.create(dto, user)
    }
    @ApiOperation({summary: "actuliza una inscripcion"})
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateEstadoInscripcionDto){
        return this.inscripcionService.update(+id,dto)
    }
}
