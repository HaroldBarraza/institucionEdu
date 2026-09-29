import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistroEstudianteService } from './registro-estudiante.service.js';
import { CreateRegistroEstudianteDto } from './dto/registro-usuario.dto.js';
import { Public } from '../auth/decorators/public.decorators.js';


@ApiTags("Registro Estudiante")
@Controller('registro-estudiante')
export class RegistroEstudianteController {
    constructor(private readonly registerService:RegistroEstudianteService){}
    @Public()
    @Post("postulante")
    register(@Body() dto:CreateRegistroEstudianteDto){
        return this.registerService.registrarPostulante(dto)
    }

}
