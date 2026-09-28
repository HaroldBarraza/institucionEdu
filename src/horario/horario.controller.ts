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
import { HorarioService } from './horario.service.js';
import { CreateHorarioGrupoDto } from './dto/create-horario-grupo.dto.js';
import { UpdateHorarioGrupoDto } from './dto/update-horario-grupo.dto.js';

@ApiTags('horarios-grupo')
@Controller('horario')
export class HorarioController {
    constructor(private readonly horarioService:HorarioService){}
    @Get()
    findall(){
        return this.horarioService.findall()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.horarioService.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateHorarioGrupoDto){
        return this.horarioService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:number, @Body() dto:UpdateHorarioGrupoDto){
        return this.horarioService.update(+id,dto)
    }
}
