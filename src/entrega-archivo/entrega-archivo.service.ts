import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEntregaArchivoDto } from './dto/create-entrega-archivo.dto.js';
import { UpdateEntregaArchivoDto } from './dto/update-entrega-archivo.dto.js';

@Injectable()
export class EntregaArchivoService {
  constructor(private readonly prisma: PrismaService) {}
  finAll() {
    return this.prisma.entregaArchivo.findMany({
      include: {
        entrega: {
          include: {
            asignacion: true,
            estudiante: {
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
          },
        },
      },
      orderBy: { id_archivo: 'desc' },
    });
  }
  //obtener las entregas del docente que esta activo 
  async findOne(id: number) {
    const archivo = await this.prisma.entregaArchivo.findUnique({
      where: {
        id_archivo: id,
      },
      include: {
        entrega: {
          include: {
            asignacion: true,
            estudiante: {
              include: {
                usuario: true,
              },
            },
          },
        },
      },
    });
    if (!archivo) {
      throw new NotFoundException(`el archivo con id ${id} no se encontro`);
    }
    return archivo;
  }
  //feat solo un estudiante pude crear un nuevo entregable y se extrae del token el id 
  async create(dto: CreateEntregaArchivoDto) {
    return await this.prisma.entregaArchivo.create({
      data: dto,
      include: {
        entrega: true,
      },
    });
  }
  //feat solo un profesor puede calificar una calificacion
  async update(id: number, dto: UpdateEntregaArchivoDto) {
    await this.findOne(id);
    return this.prisma.entregaArchivo.update({
      where: { id_archivo: id },
      data: dto,
      include: { entrega: true },
    });
  }
}
