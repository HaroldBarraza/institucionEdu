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
import { GrupoService } from './grupo.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';

@ApiTags('grupos')
@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}
  @Get()
  finall() {
    return this.grupoService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }
  @Post()
  create(@Body() dto: CreateGrupoDto) {
    return this.grupoService.create(dto);
  }
  @Patch()
  update(@Param('id') id: string, @Body() dto: UpdateGrupoDto) {
    return this.grupoService.update(+id, dto);
  }
}
