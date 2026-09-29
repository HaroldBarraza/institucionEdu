import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PeriodoService } from './periodo.service.js';
import { CreatePeriododto } from './dto/create.periodo.dto.js';
import { CambiarEstadoPeriododto } from './dto/update.periodo.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';


@ApiBearerAuth()
@ApiTags('periodos')
@Controller('periodo')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @Post()
  create(@Body() dto: CreatePeriododto) {
    return this.periodoService.create(dto);
  }

  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMINISTRADOR)
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(+id);
  }

  @Patch(':id/estado')
  @Roles(Role.ADMINISTRADOR)
  cambiarEstado(@Param('id') id: string,@Body() dto: CambiarEstadoPeriododto) {
    return this.periodoService.updateEstado(+id, dto);
  }
}
