import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
  async create(dto: CreateDocenteDto) {
    return this.prisma.docente.create({
      data: {
        id_docente: dto.id_docente,
        especialidad_id: dto.especialidad_id,
        fechaContrato: dto.fechaContrato,
      },
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
