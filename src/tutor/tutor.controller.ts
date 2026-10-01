import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateTutorDto } from './dto/update.tutor.dto.js';
import { CreateTutorDto } from './dto/create.tutor.dto.js';
import { TutorService } from './tutor.service.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags("Tutor")
@ApiBearerAuth()
@Controller('tutor')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}
  @ApiOperation({summary: "obtiene la lista de tutores existentes"})
  @Get()
  findAll() {
    return this.tutorService.findAll();
  }
  @ApiOperation({summary: "busca la informaicon de un tutor en especifico segun el id"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorService.findOne(+id);
  }
  @ApiOperation({summary: "crea un nuevo tutor"})
  @Post()
  create(@Body() dto: CreateTutorDto) {
    return this.tutorService.create(dto);
  }
  @ApiOperation({summary: "Actualiza la informacion de un tutor"})
  @Patch(':id')
  update(@Body() dto: UpdateTutorDto, @Param('id') id: string) {
    return this.tutorService.update(+id, dto);
  }
}
