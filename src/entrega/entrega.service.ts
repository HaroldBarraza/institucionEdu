import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';
import { UpdateEntregaDto } from './dto/update-entrega.dto.js';
import { CalificarEntregaDto } from './dto/calificar-entrega.dto.js';


@Injectable()
export class EntregaService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.entrega.findMany({
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
        calificadoPorDocente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                appaterno: true,
              },
            },
          },
        },
        archivos: true,
      },
      orderBy: { fecha_entrega: 'desc' },
    });
  }
  async finOne(id: number) {
    const entrega = await this.prisma.entrega.findUnique({
      where: {
        id_entrega: id,
      },
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario: true,
          },
        },
        calificadoPorDocente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                appaterno: true,
              },
            },
          },
        },
        archivos: true,
      },
    });
    if (!entrega) {
      throw new NotFoundException(`la entrega con id ${id} no se encuetra`);
    }
    return entrega;
  }
  async create(dto: CreateEntregaDto) {
    return this.prisma.entrega.create({
      data: dto,
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
  async update(id: number, dto: UpdateEntregaDto) {
    return this.prisma.entrega.update({
      where: {
        id_entrega: id,
      },
      data: dto,
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
  async calificar(id: number, dto: CalificarEntregaDto) {
    const entrega = await this.finOne(id);
    if (entrega.calificacion !== null) {
      throw new BadRequestException(`la entrga ya esta calificada`);
    }
    return this.prisma.entrega.update({
      where: {
        id_entrega: id,
      },
      data: {
        calificacion: dto.calificacion,
        calificado_docente: dto.calificado_docente,
        fecha_calificacion: new Date(),
      },
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario: true,
          },
        },
        calificadoPorDocente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                appaterno: true,
              },
            },
          },
        },
      },
    });
  }
}
