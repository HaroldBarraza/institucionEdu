import { Body, Controller, Param, Post, Get, Patch} from '@nestjs/common';


import { DocenteService } from './docente.service.js';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('docentes')
@Controller('docente')
@Roles(Role.ADMINISTRADOR)
export class DocenteController {
    constructor(private readonly docenteService:DocenteService){}
    @Get()
    findAll(){
        return this.docenteService.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.docenteService.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateDocenteDto){
        return this.docenteService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateDocenteDto){
        return this.docenteService.update(+id, dto)

    }
}
