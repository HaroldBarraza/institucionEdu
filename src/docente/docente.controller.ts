import { Body, Controller, Param, Post, Get, Patch} from '@nestjs/common';


import { ApiTags } from '@nestjs/swagger';
import { DocenteService } from './docente.service.js';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';

@ApiTags('docentes')
@Controller('docente')
export class DocenteController {
    constructor(private readonly docenteService:DocenteService){}
    @Get()
    findAll(){
        return this.docenteService.findAll
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.docenteService.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateDocenteDto){
        return this.docenteService.create(dto)
    }
    @Patch("id")
    update(@Param("id")id:string, @Body() dto:UpdateDocenteDto){
        return this.docenteService.update(+id, dto)

    }
}
