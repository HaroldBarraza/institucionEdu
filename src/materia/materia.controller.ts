import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MateriaService } from './materia.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('materias')
@Controller('materia')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class MateriaController {
    constructor(private readonly materiaService:MateriaService){}
    @ApiOperation({summary: "obtiene toda la informacion de todas las materias"})
    @Get()
    findall(){
        return this.materiaService.findAll()
    }
    @ApiOperation({summary: "obtiene la informacion de la materia especifica"})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.materiaService.fidOne(+id)
    }
    @ApiOperation({summary: "crea una nueva materia"})
    @Post()
    create(@Body() dto:CreateMateriaDto){
        return this.materiaService.create(dto)
    }
    @ApiOperation({summary: "actuliza la inromacion de una materia"})
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateMateriaDto){
        return this.materiaService.update(+id, dto)
    }

}
