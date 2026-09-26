import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
/*   Query, 
  Req */
} from '@nestjs/common';
import { CitasService } from './citas.service.js';
import { CreateCitasDto } from './dto/create-citas.dto.js';
import { UpdateCitasDto } from './dto/update-citas.dto.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { CurrentUser } from '../auth/decorators/id_user.decorator.js';
/* import { filterDoctorDto } from './dto/filter-docto.dto.js';
import { FilterforBossDto } from './dto/filter-boos.dto.js'; 
import { FilterestadoDto } from './dto/filter-estado.dto.js'; */


@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA', 'GERENCIA')
export class CitasController {
  constructor(private readonly CitasService: CitasService) {}
  @ApiOperation({ summary: 'lista de todos las citas' })
  @Roles('RECEPCIONISTA', 'GERENCIA', 'MEDICO')
  @Get()
  findAll() {
    return this.CitasService.findAll();
  }
  @ApiOperation({ summary: 'lista de cita por id' })
  @Roles('RECEPCIONISTA', 'GERENCIA', 'MEDICO')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CitasService.findOne(+id);
  }
  @ApiOperation({ summary: 'crear una nueva cita' })
  @Roles('RECEPCIONISTA', 'GERENCIA')
  @Post()
  create(@Body() CreateCitasDto: CreateCitasDto, @CurrentUser('id') creado_por: number) {
    return this.CitasService.create(CreateCitasDto, creado_por);
  }
  @ApiOperation({ summary: 'actulizar una cita segun id' })
  @Roles('RECEPCIONISTA', 'GERENCIA')
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateCitasDto: UpdateCitasDto) {
    return this.CitasService.update(+id, UpdateCitasDto);
  }
  @ApiOperation({ summary: 'eliminar una cita' })
  @Roles('RECEPCIONISTA', 'GERENCIA')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CitasService.remove(+id);
  }
/*   @Get('filter-doctor')
  @ApiOperation({ summary: 'Filtra las citas de un doctor' })
  async filterDoctor(@Query() dto: filterDoctorDto, @Req() req: Request) {
    const id_empleado = req.user?.id;
    const resultado = await this.CitasService.filterforDoctor(
      id_empleado,
      new Date(dto.fecha_inicio),
      new Date(dto.fecha_final),
    );

    if (resultado.length === 0) {
      return { message: 'No tiene citas programadas' };
    }
    return { data: resultado };
  } */
}
