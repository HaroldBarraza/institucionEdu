import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegistroEstudianteService } from './registro-estudiante.service.js';
import { CreateRegistroEstudianteDto } from './dto/registro-usuario.dto.js';
import { Public } from '../auth/decorators/public.decorators.js';


@ApiTags("1.1 Registro Estudiante")
@Controller('registro-estudiante')
export class RegistroEstudianteController {
    constructor(private readonly registerService:RegistroEstudianteService){}
    @ApiOperation({summary: "crea un nuevo postulante"})
    @Public()
    @Post("postulante")
    register(@Body() dto:CreateRegistroEstudianteDto){
        return this.registerService.registrarPostulante(dto)
    }

}
