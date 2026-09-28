import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EstadoUsuario, Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUsuarioDto } from './dto/update.usuario.dto.js';
import { CambiarEstadoUsuarioDto } from './dto/cambiar.estado.dto.js';
import { error } from 'console';
import { CreateUsuarioDto } from './dto/create.usuario.dto.js';

const SELECT_PUBLICO = {
  id_usuario: true,
  email: true,
  nombre: true,
  appaterno: true,
  apmaterno: true,
  telefono: true,
  rol: true,
  estado: true,
  fecha_creacion: true,
} as const;

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(){
    return this.prisma.usuario.findMany({
        select:SELECT_PUBLICO
    })
  }
  async findOne(id:number){
    const usuario = await this.prisma.usuario.findUnique({
        where:{id_usuario:id},
        select:SELECT_PUBLICO
    })
    if(!usuario){
        throw new NotFoundException(`no se encontro al usuario con id ${id}`)
    }
    return usuario
  }
  async create(dto: CreateUsuarioDto){
    const password = await bcrypt.hash(dto.password, 10)

    return this.prisma.usuario.create({
        data:{
            email:dto.email,
            password,
            nombre:dto.nombre,
            appaterno:dto.appaterno,
            apmaterno:dto.apmaterno,
            telefono:dto.telefono,
            rol: dto.rol
        },
        select:SELECT_PUBLICO
    })
  }
  async update(id:number, dto:UpdateUsuarioDto){
    await this.findOne(id)
    return this.prisma.usuario.update({
        where:{id_usuario: id},
        data:dto,
        select:SELECT_PUBLICO
    })
  }
}