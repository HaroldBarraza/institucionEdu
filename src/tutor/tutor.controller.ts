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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags("Tutor")
@ApiBearerAuth()
@Controller('tutor')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}
  @Get()
  findAll() {
    return this.tutorService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorService.findOne(+id);
  }
  @Post()
  create(@Body() dto: CreateTutorDto) {
    return this.tutorService.create(dto);
  }
  @Patch(':id')
  update(@Body() dto: UpdateTutorDto, @Param('id') id: string) {
    return this.tutorService.update(+id, dto);
  }
}
