import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AsignacionService } from './asignacion.service.js';
import { CreateAsignacionDto } from './dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('2.4 Asignacion')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}
  @ApiOperation({summary: "obtener todas las tarea ", description: "obtiene todas las asignaicones existenetes"})
  @Get()
  findall() {
    return this.asignacionService.findAll();
  }
  @ApiOperation({summary: "para obtener una tarea", description: "se obtiene una tarea de la relacion de tareas existentes "})
  @Get(':id')
  findOne(@Param("id") id:string) {
    return this.asignacionService.findOne(+id);
  }
  @Roles(Role.ADMINISTRADOR, Role.PROFESOR)
  @ApiOperation({summary: "crea una nueva asginacion", description: "el profesor crea un nueva asiganacio para una grupo determinado"})
  @Post()
  create(@Body() dto:CreateAsignacionDto){
    return this.asignacionService.create(dto)
  }
  @Roles(Role.ADMINISTRADOR, Role.PROFESOR)
  @ApiOperation({summary: "actuliza un asignacion", description: "el profesor pude actulizar una asignaicon que desee"})
  @Patch(":id")
  update(@Param("id") id:string, @Body() dto:UpdateAsignacionDto){
    return this.asignacionService.update(+id, dto)
  }
}
