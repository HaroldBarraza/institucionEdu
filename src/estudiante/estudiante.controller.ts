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
import { EstudianteService } from './estudiante.service.js';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';

@ApiTags('estudiantes')
@Controller('estudiante')
export class EstudianteController {
    constructor(private readonly estudianteService:EstudianteService){}
    @Get()
    findAll(){
        return this.estudianteService.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.estudianteService.finOne(+id)
    }
    @Post()
    create(@Body() dto:CreateEstudianteDto){
        return this.estudianteService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateEstudianteDto){
        return this.estudianteService.update(dto,+id)
    }
}
