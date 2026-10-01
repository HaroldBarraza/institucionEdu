import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GrupoService } from './grupo.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('grupos')
@ApiBearerAuth()
@Controller('grupo')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}
  @ApiOperation({summary: "optiene la lista de grupos"})
  @Get()
  finall() {
    return this.grupoService.findAll();
  }
  @ApiOperation({summary: "optiene la informacion de un grupo en especifico"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }
  @ApiOperation({summary: "crea un nuevo grupo"})
  @Post()
  create(@Body() dto: CreateGrupoDto) {
    return this.grupoService.create(dto);
  }
  @ApiOperation({summary: "actualiza la informacion de un grupo"})
  @Patch(":id")
  update(@Param('id') id: string, @Body() dto: UpdateGrupoDto) {
    return this.grupoService.update(+id, dto);
  }
}
