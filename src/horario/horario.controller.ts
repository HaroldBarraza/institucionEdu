import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HorarioService } from './horario.service.js';
import { CreateHorarioGrupoDto } from './dto/create-horario-grupo.dto.js';
import { UpdateHorarioGrupoDto } from './dto/update-horario-grupo.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('horarios-grupo')
@ApiBearerAuth()
@Controller('horario')
@Roles(Role.ADMINISTRADOR,Role.RECEPCIONISTA)
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
