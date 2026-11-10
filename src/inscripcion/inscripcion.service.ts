import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoGrupo,
  EstadoInscripcion,
  EstadoPeriodo,
  EstadoUsuario,
} from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { UpdateEstadoInscripcionDto } from './dto/update-estado-inscripcion.dto.js';
import { JwtPayload } from '../auth/decorators/current-user.decorator.js';

//para qyue no sea repetitivo en el front
export const MotivoRechazoMatricula = {
  GRUPO_NO_EXISTE: 'GRUPO_NO_EXISTE',
  GRUPO_CERRADO: 'GRUPO_CERRADO',
  PERIODO_NO_ACTIVO: 'PERIODO_NO_ACTIVO',
  ESTUDIANTE_NO_EXISTE: 'ESTUDIANTE_NO_EXISTE',
  ESTUDIANTE_NO_ACTIVO: 'ESTUDIANTE_NO_ACTIVO',
  GRUPO_LLENO: 'GRUPO_LLENO',
  MATERIA_YA_CURSADA: 'MATERIA_YA_CURSADA',
  LIMITE_CREDITOS: 'LIMITE_CREDITOS',
  TRASLAPE_HORARIO: 'TRASLAPE_HORARIO',
} as const;

export type MotivoRechazoMatricula =
  (typeof MotivoRechazoMatricula)[keyof typeof MotivoRechazoMatricula];

function rechazo(code: MotivoRechazoMatricula, message: string) {
  return new BadRequestException({ message, code });
}

@Injectable()
export class InscripcionService {
  constructor(private readonly prisma: PrismaService) {}
  async findall() {
    return this.prisma.inscripcion.findMany({
      include: {
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
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
      },
      orderBy: { fecha_inscripcion: 'desc' },
    });
  }
  async findOne(id: number) {
    const result = await this.prisma.inscripcion.findUnique({
      where: {
        id_inscripcion: id,
      },
      include: {
        estudiante: {
          include: {
            usuario: true,
          },
        },
        grupo: {
          include: {
            materia: true,
            periodo: true,
            horarios: true,
          },
        },
        obligaciones: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`la inscripcion con id ${id} no existe`);
    }
    return result;
  }
  async create(dto: CreateInscripcionDto, user: JwtPayload) {
    const grupo = await this.prisma.grupo.findUnique({
      where: { id_grupo: dto.grupo_id },
      include: {
        periodo: true,
        horarios: true,
        materia: true,
      },
    });
    if (!grupo) {
      throw rechazo(
        'GRUPO_NO_EXISTE',
        `el grupo con id ${dto.grupo_id} no existe`,
      );
    }
    if (grupo.estado !== EstadoGrupo.ABIERTO) {
      throw rechazo(
        'GRUPO_CERRADO',
        `el grupo no esta abierto el estado actual es de ${grupo.estado}`,
      );
    }
    if (grupo.periodo.estado !== EstadoPeriodo.ACTIVO) {
      throw rechazo(
        'PERIODO_NO_ACTIVO',
        `el periodo ${grupo.periodo.nombre} no esta activo`,
      );
    }
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id_estudiante: user.sub },
      include: {
        usuario: true,
      },
    });
    if (!estudiante) {
      throw rechazo('ESTUDIANTE_NO_EXISTE', `estudiante ${user.sub} no existe`);
    }
    if (estudiante.usuario.estado !== EstadoUsuario.ACTIVO) {
      throw rechazo(
        'ESTUDIANTE_NO_ACTIVO',
        `el estudiante no esta activo estado:${estudiante.usuario.estado}`,
      );
    }
    await this.validarcupos(grupo.id_grupo, grupo.cupo_maximo);
    const inscripcionesActivas = await this.prisma.inscripcion.findMany({
      where: {
        estudiante_id: user.sub,
        estado: EstadoInscripcion.INSCRITO,
        grupo: { periodo_id: grupo.periodo_id },
      },
      include: {
        grupo: {
          include: {
            materia: true,
            horarios: true,
          },
        },
      },
    });
    this.validarMateria(inscripcionesActivas, grupo.materia_id);
    this.ValidarCreditos(
      inscripcionesActivas,
      grupo.materia.creditos,
      grupo.periodo.limite_creditos,
    );
    this.validarTraslape(inscripcionesActivas, grupo.horarios);
    return this.prisma.inscripcion.create({
      data: {
        estudiante_id: user.sub,
        grupo_id: dto.grupo_id,
      },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
  async update(id: number, dto: UpdateEstadoInscripcionDto) {
    const inscripcion = await this.findOne(id);
    if (inscripcion.estado === dto.estado) {
      throw new BadRequestException(
        `el estado de la inscripcion no puede ser la misma`,
      );
    }
    return this.prisma.inscripcion.update({
      where: { id_inscripcion: id },
      data: { estado: dto.estado },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
        estudiante: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
  private async validarcupos(grupo_id: number, cupo_maximo: number) {
    const inscritos = await this.prisma.inscripcion.count({
      where: {
        grupo_id: grupo_id,
        estado: EstadoInscripcion.INSCRITO,
      },
    });
    if (inscritos >= cupo_maximo) {
      throw rechazo('GRUPO_LLENO', `El grupo esta lleno`);
    }
  }
  private validarMateria(
    inscripcion: { grupo: { materia_id: number } }[],
    materia_id: number,
  ) {
    const yaInscrito = inscripcion.some(
      (i) => i.grupo.materia_id === materia_id,
    );
    if (yaInscrito) {
      throw rechazo(
        'MATERIA_YA_CURSADA',
        `El estudiante ya esta inscrito en la misma materia en el mismo periodo`,
      );
    }
  }
  private ValidarCreditos(
    inscripcion: { grupo: { materia: { creditos: number } } }[],
    creditosNuevos: number,
    limite: number,
  ) {
    const creditosActuales = inscripcion.reduce(
      (acumulador, i) => acumulador + i.grupo.materia.creditos,
      0,
    );
    if (creditosActuales + creditosNuevos > limite) {
      throw rechazo(
        'LIMITE_CREDITOS',
        `Supera el límite de créditos del periodo (${limite}). Actual: ${creditosActuales}, intentando sumar: ${creditosNuevos}`,
      );
    }
  }
  private validarTraslape(
    inscripciones: {
      grupo: {
        horarios: {
          dia_semana: string;
          hora_inicio: Date;
          hora_fin: Date;
        }[];
      };
    }[],
    horariosNuevos: {
      dia_semana: string;
      hora_inicio: Date;
      hora_fin: Date;
    }[],
  ) {
    for (const inscripcion of inscripciones) {
      for (const actual of inscripcion.grupo.horarios) {
        for (const nuevo of horariosNuevos) {
          if (actual.dia_semana !== nuevo.dia_semana) continue;

          const solapan =
            actual.hora_inicio < nuevo.hora_fin &&
            nuevo.hora_inicio < actual.hora_fin;

          if (solapan) {
            throw rechazo(
              'TRASLAPE_HORARIO',
              `Traslape de horario el ${nuevo.dia_semana} entre ${nuevo.hora_inicio.toISOString().slice(11, 16)} y ${nuevo.hora_fin.toISOString().slice(11, 16)}`,
            );
          }
        }
      }
    }
  }
}
