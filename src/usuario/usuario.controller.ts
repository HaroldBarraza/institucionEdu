import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create.usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update.usuario.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('2.1 Usuarios')
@ApiBearerAuth()
@Controller('usuario')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService){}
    @ApiOperation({summary: "obtiene la lista de usuarios"})
    @Get()
    findAll(){
        return this.usuarioService.findAll()
    }
    @ApiOperation({summary: "obtiene la informacion de un usuario segun el id "})
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.usuarioService.findOne(+id)
    }
    @ApiOperation({summary: "crea un nuevo usuario"})
    @Post()
    create(@Body() dto:CreateUsuarioDto){
        return this.usuarioService.create(dto)
    }
    @ApiOperation({summary: "actualiza la informacion de un usuario segun el id "})
    @Patch(":id")
    update(@Param("id") id:number, @Body()dto:UpdateUsuarioDto){
        return this.usuarioService.update(id,dto)
    }
    @ApiOperation({summary: "Activa la cuenta de un postulante"})
    @Patch(":id/aprobar")
    aprobar(@Param("id") id:string){
        return this.usuarioService.aprobarPostulante(+id)
    }
}
