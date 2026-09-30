import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AsignacionService } from './asignacion.service.js';
import { CreateAsignacionDto } from './dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('asinacion')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}
  @Get()
  findall() {
    return this.asignacionService.findAll();
  }
  @Get(':id')
  findOne(@Param("id") id:string) {
    return this.asignacionService.findOne(+id);
  }
  @Post()
  create(@Body() dto:CreateAsignacionDto){
    return this.asignacionService.create(dto)
  }
  @Patch(":id")
  update(@Param("id") id:string, @Body() dto:UpdateAsignacionDto){
    return this.asignacionService.update(+id, dto)
  }
}
