import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';
import { PacientesService } from './pacientes.service.js';
import { CreatePacienteDto } from './dto/create.pacientes.dto.js';
import { UpdatePacienteDto } from './dto/update.paciente.dto.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags("pacientes")
@ApiBearerAuth()
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("RECEPCIONISTA", "GERENCIA")
export class PacientesController {
    constructor(private readonly PacientesService:PacientesService) {}
    @ApiOperation({summary: "obtener la lista de todos los pacientes"})
    @Get()
    finAll(){
        return this.PacientesService.findAll()
    }
    @ApiOperation({summary: "obtener la informacion de un paciente segun id "})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.PacientesService.findOne(+id)
    }
    @ApiOperation({summary: "crear un nuevo paciente"})
    @Post()
    create(@Body() CreatePacienteDto:CreatePacienteDto){
        return this.PacientesService.create(CreatePacienteDto)
    }
    @ApiOperation({summary: "actualizar la informacion de una paciente segun id"})
    @Patch(":id")
    update(@Param("id") id:string, @Body()UpdatePacienteDto:UpdatePacienteDto){
        return this.PacientesService.update(+id, UpdatePacienteDto)
    }
    @ApiOperation({summary: "eliminar un paciente segun el id "})
    @Delete(":id")
    remove(@Param("id") id:string){
        return this.PacientesService.remove(+id)
    }
}
