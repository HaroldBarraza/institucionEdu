import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ObligacionesService } from './obligaciones.service.js';
import { CreateObligacionDto } from './dto/create-obligacion.dto.js';
import { CambiarEstadoObligacionDto } from './dto/cambiar-estado-obligacion.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('obligaciones')
@ApiBearerAuth()
@Controller('obligaciones')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class ObligacionesController {
  constructor(private readonly obligacionservice: ObligacionesService) {}
  @ApiOperation({summary: "obitiene la listas de aplicaciones "})
  @Get()
  findAll() {
    return this.obligacionservice.findAll();
  }
  @ApiOperation({summary: "obtiene la informacion de de una obligacion"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.obligacionservice.findOne(+id);
  }
  @ApiOperation({summary: "crea una nueva obligacion"})
  @Post()
  create(@Body() dto: CreateObligacionDto) {
    return this.obligacionservice.create(dto);
  }
  @ApiOperation({summary: "actualiza la informacion de una obligacion"})
  @Patch(':id/estado')
  updateestado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoObligacionDto,
  ) {
    return this.obligacionservice.cambiarestado(+id, dto);
  }
  @ApiOperation({summary: "Crea una nueva aplicacion"})
  @Patch('admin/marcarvencidas')
  @Roles(Role.ADMINISTRADOR)
  marcarVencidas() {
    return this.obligacionservice.marcarVencidas();
  }
  @ApiOperation({summary: "actualiza la informacion de una obligacion "})
  @Patch('admin/suspender-morosos')
  @Roles(Role.ADMINISTRADOR)
  suspenderMorosos() {
    return this.obligacionservice.suspenderMorosos();
  }
}
