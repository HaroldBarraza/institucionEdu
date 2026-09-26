import { Controller, Get } from '@nestjs/common';
import { EstadoCitasService } from './estado_citas.service.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorators.js';


@ApiTags("estado de citas")
@ApiBearerAuth()
@Controller('estado-citas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA','GERENCIA')
export class EstadoCitasController {
    constructor(private readonly EstadoCitasService:EstadoCitasService){}
    @ApiOperation({summary:"obtener una lista de los estados de citas"})
    @Get()
    findAll(){
        return this.EstadoCitasService.findAll()
    }
}
