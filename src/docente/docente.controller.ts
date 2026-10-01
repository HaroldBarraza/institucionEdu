import { Body, Controller, Param, Post, Get, Patch} from '@nestjs/common';


import { DocenteService } from './docente.service.js';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@ApiTags('2.2 Docentes')
@Controller('docente')
@Roles(Role.ADMINISTRADOR)
export class DocenteController {
    constructor(private readonly docenteService:DocenteService){}
    @ApiOperation({summary: "se lista a todos los docentes", description: "se optiene toda la lista de profeosres existentes"})
    @Get()
    findAll(){
        return this.docenteService.findAll()
    }
    @ApiOperation({summary: "se busca a un doncente", description: "se busca la informacion de un docente en concreto"})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.docenteService.findOne(+id)
    }
    @ApiOperation({summary: "se crea un nuevo doncente", description: "se crea un nuevo docente "})
    @Post()
    create(@Body() dto:CreateDocenteDto){
        return this.docenteService.create(dto)
    }
    @ApiOperation({summary: "se actulzia la informacion de un docente"})
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateDocenteDto){
        return this.docenteService.update(+id, dto)

    }
}
