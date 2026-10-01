import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EntregaService } from './entrega.service.js';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';
import { UpdateEntregaDto } from './dto/update-entrega.dto.js';
import { CalificarEntregaDto } from './dto/calificar-entrega.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { CurrentUser} from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags("1.4 Entrega")
@Controller('entrega')
@Roles(Role.ADMINISTRADOR, Role.ESTUDIANTE, Role.PROFESOR)
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}
  @ApiOperation({summary: "obtener la lista de todas las entregas de los alumnos"})
  @Get()
  findAll() {
    return this.entregaService.findAll();
  }
  @ApiOperation({summary:"obtiene la entrega de una persona"})
  @Get(":id")
  findOne(@Param("id") id:string){
    return this.entregaService.finOne(+id)
  }
  @Roles(Role.ESTUDIANTE)
  @ApiOperation({summary: "se crea una nueva entrega de tarea"})
  @Post()
  create(@Body() dto:CreateEntregaDto, @CurrentUser() user:JwtPayload ){
    return this.entregaService.create(dto,user)
  }
  @ApiOperation({summary:"actualiza una entrega del estudiante"})
  @Patch(":id")
  update(@Param("id") id:string, @Body() dto:UpdateEntregaDto,@CurrentUser() user:JwtPayload ){
    return this.entregaService.update(+id, dto, user)
  }
  @Roles(Role.ADMINISTRADOR, Role.PROFESOR)
  @ApiOperation({summary: "el profesor califica una entrega de sus asignaciones "})
  @Patch(":id/calificar")
  calificar(@Param("id") id:string, @Body() dto:CalificarEntregaDto,@CurrentUser() user:JwtPayload ){
    return this.entregaService.calificar(+id, dto, user)
  }
}
