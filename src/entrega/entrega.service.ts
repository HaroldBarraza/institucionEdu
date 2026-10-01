import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';
import { UpdateEntregaDto } from './dto/update-entrega.dto.js';
import { CalificarEntregaDto } from './dto/calificar-entrega.dto.js';
import { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import {
  EstadoInscripcion,
  EstadoUsuario,
  Role,
} from '../generated/prisma/enums.js';

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
  async create(dto: CreateEntregaDto, user: JwtPayload) {
    const asignacion = await this.prisma.asignacion.findUnique({
      where: { id_asignacion: dto.asignacion_id },
    });
    if (!asignacion) {
      throw new NotFoundException(
        `no se encontro la asginacion con id ${dto.asignacion_id}`,
      );
    }
    const inscripcion = await this.prisma.inscripcion.findFirst({
      where: {
        estudiante_id: user.sub,
        grupo_id: asignacion.grupo_id,
        estado: EstadoInscripcion.INSCRITO,
      },
    });
    if (!inscripcion) {
      throw new BadRequestException(`no esta incrito en este curso`);
    }
    const entregaunique = await this.prisma.entrega.findFirst({
      where: {
        asignacion_id: dto.asignacion_id,
        estudiante_id: user.sub,
      },
    });
    if (entregaunique) {
      throw new BadRequestException(
        `ya entrego la tarea solo se admite una entrega`,
      );
    }
    return this.prisma.entrega.create({
      data: {
        asignacion_id: dto.asignacion_id,
        estudiante_id: user.sub,
        contenido_texto: dto.contenido_texto,
      },
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                apmaterno: true,
              },
            },
          },
        },
      },
    });
  }
  async update(id: number, dto: UpdateEntregaDto, user:JwtPayload) {
    const entrega = await this.finOne(id)
    if(entrega.estudiante_id !== user.sub){
      throw new NotFoundException(`solo puede entregar tareas que te pertenscan`)
    }
    if(entrega.calificacion !== null){
      throw new BadRequestException(`no se puede entregar una tarea ya calificada`)
    }
    return this.prisma.entrega.update({
      where: {
        id_entrega: id,
      },
      data: dto,
      include: {
        asignacion: true,
        estudiante: {
          include: {
            usuario:{
              select:{
                id_usuario: true,
                nombre:true,
                appaterno:true,
              }
            },
          },
        },
      },
    });
  }
  async calificar(id: number, dto: CalificarEntregaDto, user:JwtPayload) {
    const entrega = await this.prisma.entrega.findUnique({
      where:{
        id_entrega: id
      },include:{
        asignacion:{
          include:{
            grupo:true
          }
        }
      }
    });
    if(!entrega){
      throw new NotFoundException(`la entrega con id ${id} no existe`)
    }

    if (entrega.calificacion !== null) {
      throw new BadRequestException(`la entrega ya esta calificada`);
    }
    if(entrega.asignacion.grupo.docente_id === user.sub ){
      throw new NotFoundException(`solo puede calificar entregas a las que este asignado`)
    }
    return this.prisma.entrega.update({
      where: {
        id_entrega: id,
      },
      data: {
        calificacion: dto.calificacion,
        calificado_docente: user.sub,
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
