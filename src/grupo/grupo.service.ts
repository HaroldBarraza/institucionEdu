import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { group } from 'console';

@Injectable()
export class GrupoService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.grupo.findMany({
      include: {
        materia: true,
        periodo: true,
        docente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                appaterno: true,
                apmaterno: true,
              },
            },
          },
        },
        horarios: true,
      },
      orderBy: [{ periodo_id: 'desc' }, { materia_id: 'asc' }],
    });
  }
  async findOne(id: number) {
    const result = await this.prisma.grupo.findUnique({
      where: { id_grupo: id },
      include: {
        materia: true,
        periodo: true,
        docente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                appaterno: true,
                apmaterno: true,
              },
            },
          },
        },
        horarios: true,
        inscripciones: true,
      },
    });
    if(!result){
        throw new NotFoundException(`el grupo con id ${id} no existe`)
    }
    return result
  }
  async create (dto:CreateGrupoDto){
    return this.prisma.grupo.create({
        data:{
            materia_id:dto.materia_id,
            periodo_id:dto.periodo_id,
            docente_id:dto.docente_id,
            codigo: dto.codigo,
            cupo_maximo: dto.cupo_maximo,
            ...(dto.estado && {estado: dto.estado})
        },
        include:{
            materia:true,
            periodo:true,
            docente:true,
        }
    })
  }
  async update (id:number,dto:UpdateGrupoDto){
    await this.findOne(id)
    return await this.prisma.grupo.update({
        where:{
            id_grupo:id
        },
        data:dto,
        include:{
            materia:true,
            periodo:true,
            docente:true,
        }
    })
  }

}
