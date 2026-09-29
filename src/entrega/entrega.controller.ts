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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags("Entrega")
@Controller('entrega')
@Roles(Role.ADMINISTRADOR, Role.ESTUDIANTE, Role.PROFESOR)
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}
  @Get()
  findAll() {
    return this.entregaService.findAll();
  }
  @Get(":id")
  findOne(@Param("id") id:string){
    return this.entregaService.finOne(+id)
  }
  @Post()
  create(@Body() dto:CreateEntregaDto){
    return this.entregaService.create(dto)
  }
  @Patch(":id")
  update(@Param("id") id:string, @Body() dto:UpdateEntregaDto){
    return this.entregaService.update(+id, dto)
  }
  @Patch(":id/calificar")
  calificar(@Param("id") id:string, @Body() dto:CalificarEntregaDto){
    return this.entregaService.calificar(+id, dto)
  }
}
