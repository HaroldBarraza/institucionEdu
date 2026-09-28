import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTutorDto } from './dto/update.tutor.dto.js';
import { CreateTutorDto } from './dto/create.tutor.dto.js';
import { TutorService } from './tutor.service.js';

@Controller('tutor')
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
