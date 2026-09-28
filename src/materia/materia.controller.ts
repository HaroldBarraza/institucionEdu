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
import { MateriaService } from './materia.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';

@ApiTags('materias')
@Controller('materia')
export class MateriaController {
    constructor(private readonly materiaService:MateriaService){}
    @Get()
    findall(){
        return this.materiaService.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.materiaService.fidOne(+id)
    }
    @Post()
    create(@Body() dto:CreateMateriaDto){
        return this.materiaService.create(dto)
    }
    @Post(":id")
    update(@Param("id") id:string, @Body() dto:UpdateMateriaDto){
        return this.materiaService.update(+id, dto)
    }

}
