import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PeriodoService } from './periodo.service.js';
import { CreatePeriododto } from './dto/create.periodo.dto.js';
import { CambiarEstadoPeriododto } from './dto/update.periodo.dto.js';


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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.periodoService.findOne(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoPeriododto,
  ) {
    return this.periodoService.updateEstado(id, dto);
  }
}
