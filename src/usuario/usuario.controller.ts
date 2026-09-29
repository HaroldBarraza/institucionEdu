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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create.usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update.usuario.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuario')
@Roles(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService){}
    @Get()
    findAll(){
        return this.usuarioService.findAll()
    }
    @Get(":id")
    findOne(@Param("id") id:string){
        return this.usuarioService.findOne(+id)
    }
    @Post()
    create(@Body() dto:CreateUsuarioDto){
        return this.usuarioService.create(dto)
    }
    @Patch(":id")
    update(@Param("id") id:number, @Body()dto:UpdateUsuarioDto){
        return this.usuarioService.update(id,dto)
    }
    @Patch(":id/aprobar")
    aprobar(@Param("id") id:string){
        return this.usuarioService.aprobarPostulante(+id)
    }
}
