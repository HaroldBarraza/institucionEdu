import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAsignacionDto } from './dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';


@Injectable()
export class AsignacionService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.asignacion.findMany({
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
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
      },
      orderBy: { creacion_asignacion: 'desc' },
    });
  }
  async findOne(id: number) {
    const asignacion = await this.prisma.asignacion.findUnique({
      where: { id_asignacion: id },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
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
        entregas: true,
      },
    });
    if (!asignacion) {
      throw new NotFoundException(`no se encontro la asignacion con id ${id}`);
    }
    return asignacion;
  }

  //feature ya no pedir id sino que solo un maestro pueda crear y que se vincule con el id
  async create(dto: CreateAsignacionDto, user: JwtPayload) {
    const docente = await this.prisma.docente.findFirst({
      where: { id_docente: user.sub }, 
    });

    const grupo = await this.prisma.grupo.findUnique({
      where: { id_grupo: dto.grupo_id },
    });

    if (!grupo) {
      throw new NotFoundException(`El grupo número ${dto.grupo_id} no existe.`);
    }
    if (grupo.docente_id !== docente?.id_docente) {
      throw new BadRequestException(
        'No tienes permisos para crear asignaciones en un grupo que no te pertenece.',
      );
    }

    const docenteIdFinal = docente ? docente.id_docente : grupo.docente_id;

    return this.prisma.asignacion.create({
      data: {
        ...dto,
        docente_id: docenteIdFinal,
      },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
        docente: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                email: true,
                rol: true,
              },
            },
          },
        },
      },
    });
  }

  //feature: que el profesor solo pueda actulizar los cursos que el tiene disponible
  async update(id: number, dto: UpdateAsignacionDto) {
    await this.findOne(id);
    return this.prisma.asignacion.update({
      where: { id_asignacion: id },
      data: dto,
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
        docente: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
}
