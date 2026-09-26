import { Body, Controller,Get, Post } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service.js';
import { CreateEspecialidadDto } from './dto/create.especilidad.dto.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorators.js';


@ApiTags("especialidades")
@ApiBearerAuth()
@Controller('especialidades')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA','GERENCIA')
export class EspecialidadesController {
    constructor(private readonly EspecialidadesService:EspecialidadesService){}
    @ApiOperation({summary: "obtener lista de todas las especiliadidades"})
    @Get()
    findAll(){
        return this.EspecialidadesService.findAll()
    }
    @ApiOperation({summary: "crear una nueva especialidad"})
    @Post()
    create(@Body() CreateEspecialidadDto: CreateEspecialidadDto){
        return this.EspecialidadesService.create(CreateEspecialidadDto)
    }

}
