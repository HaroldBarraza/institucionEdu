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
import { UpdateObligacionDto } from './dto/update-obligacion.dto.js';
import { CambiarEstadoObligacionDto } from './dto/cambiar-estado-obligacion.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('obligaciones')
@ApiBearerAuth()
@Controller('obligaciones')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class ObligacionesController {
  constructor(private readonly obligacionservice: ObligacionesService) {}
  @Get()
  findAll() {
    return this.obligacionservice.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.obligacionservice.findOne(+id);
  }
  @Post()
  create(@Body() dto: CreateObligacionDto) {
    return this.obligacionservice.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateObligacionDto) {
    return this.obligacionservice.update(+id, dto);
  }
  @Patch(':id/estado')
  updateestado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoObligacionDto,
  ) {
    return this.obligacionservice.cambiarestado(+id, dto);
  }
  @Patch('admin/marcarvencidas')
  @Roles(Role.ADMINISTRADOR)
  marcarVencidas() {
    return this.obligacionservice.marcarVencidas();
  }

  @Patch('admin/suspender-morosos')
  @Roles(Role.ADMINISTRADOR)
  suspenderMorosos() {
    return this.obligacionservice.suspenderMorosos();
  }
}
