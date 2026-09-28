import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create.usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update.usuario.dto.js';

@ApiTags('usuarios')
@Controller('usuario')
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
}
