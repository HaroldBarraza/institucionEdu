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
import { InscripcionService } from './inscripcion.service.js';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { UpdateEstadoInscripcionDto } from './dto/update-estado-inscripcion.dto.js';

@ApiTags("inscripcio")
@Controller('inscripcion')
export class InscripcionController {
    constructor(private readonly inscripcionService: InscripcionService) {}
    @Get()
    findAll(){
        return this.inscripcionService.findall()
    }
    @Get(":id")
    findOne(id:number){
        return this.inscripcionService.findOne(+id)
    }
    @Post()
    create(dto:CreateInscripcionDto){
        return this.inscripcionService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateEstadoInscripcionDto){
        return this.inscripcionService.update(+id,dto)
    }
}
