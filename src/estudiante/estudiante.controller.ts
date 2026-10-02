import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { CurrentUser} from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@ApiTags('estudiantes')
@ApiBearerAuth()
@Controller('estudiante')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class EstudianteController {
    constructor(private readonly estudianteService:EstudianteService){}
    @ApiOperation({summary: "obtiene la lista de todos los estudiantes"})
    @Get()
    findAll(){
        return this.estudianteService.findAll()
    }
    @ApiOperation({summary: "obtiene la informacion de "})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.estudianteService.finOne(+id)
    }
/*     @ApiOperation({summary: "se crea un nuevo estudiante"})
    @Post()
    create(@Body() dto:CreateEstudianteDto){
        return this.estudianteService.create(dto)
    } */
    @ApiOperation({summary: "actulizar informaicon de un id "})
    @Patch(":id")
    update(@Param("id") id:string, @Body() dto:UpdateEstudianteDto){
        return this.estudianteService.update(dto,+id)
    }
    @ApiOperation({summary: "se obtiene la informaicon financiera de un alumno"})
    @Get("me/:id")
    getdeudas(@Param() id:string){
        return this.estudianteService.gethistorial(+id)
    }
}
