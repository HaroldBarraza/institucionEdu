import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs'
import { EstadoUsuario, Role } from '../generated/prisma/enums.js';


const SELECT_PUBLICO = {
  id_usuario: true,
  email:true,
  nombre: true,
  appaterno: true,
  apmaterno: true,
  telefono: true,
  rol: true,
  estado: true
}

@Injectable()
export class DocenteService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.docente.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
            telefono: true,
          },
        },
        especialidad: true,
      },
      orderBy: { id_docente: 'asc' },
    });
  }
  async findOne(id: number) {
    const docente = await this.prisma.docente.findUnique({
      where: { id_docente: id },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
            telefono: true,
          },
        },
        especialidad: true,
      },
    });
    if (!docente) {
      throw new NotFoundException(`Docente ${id} no existe`);
    }
    return docente;
  }
  //feat: que se cree en conjunto como en estudiante
  async create(dto: CreateDocenteDto) {
    const email = await this.prisma.usuario.findUnique({
      where: {email:dto.email}
    })
    if(email){
      throw new BadRequestException(`el email ${dto.email} ya esta en uso`)
    }
    const especialidad = await this.prisma.especialidad.findUnique({
      where:{id_especialidad: dto.especialidad_id}
    })
    if(!especialidad){
      throw new BadRequestException (`La especialidad ${dto.especialidad_id} no existe`)
    }
    const password = await bcrypt.hash(dto.password, 10)
    return this.prisma.$transaction(async(tx) => {
      const usuario = await tx.usuario.create({
        data:{
          email:dto.email,
          password,
          nombre:dto.nombre,
          appaterno:dto.appaterno,
          apmaterno:dto.apmaterno,
          telefono:dto.telefono,
          rol:Role.PROFESOR,
          estado: EstadoUsuario.ACTIVO
        },
        select: SELECT_PUBLICO
      })
      const docente = await tx.docente.create({
        data:{
          id_docente:usuario.id_usuario,
          especialidad_id: dto.especialidad_id,
          fechaContrato: dto.fechaContrato
        },
        include: {especialidad:true}
      })
      return {...usuario, docente}
    })
  }
  async update(id: number, dto: UpdateDocenteDto) {
    await this.findOne(id);
    return this.prisma.docente.update({
      where: { id_docente: id },
      data: dto,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
          },
        },
        especialidad: true,
      },
    });
  }
}
