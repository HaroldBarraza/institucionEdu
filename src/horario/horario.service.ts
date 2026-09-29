import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateHorarioGrupoDto } from './dto/create-horario-grupo.dto.js';
import { UpdateHorarioGrupoDto } from './dto/update-horario-grupo.dto.js';

@Injectable()
export class HorarioService {
  constructor(private readonly prisma: PrismaService) {}

  async findall() {
    return await this.prisma.horarioGrupo.findMany({
      include: { grupo: true },
      orderBy: [
        { grupo_id: 'asc' },
        { dia_semana: 'asc' },
        { hora_inicio: 'asc' },
      ],
    });
  }
  async findOne(id: number) {
    const result = await this.prisma.horarioGrupo.findUnique({
      where: {
        id_horario: id,
      },
      include: {
        grupo: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`el horario con id ${id} no existe`);
    }
    return result;
  }
  async create(dto: CreateHorarioGrupoDto) {
    this.validatehoras(dto.hora_inicio, dto.hora_fin);
    return await this.prisma.horarioGrupo.create({
      data: {
        grupo_id: dto.grupo_id,
        dia_semana: dto.dia_semana,
        hora_inicio: new Date(`1970-01-01T${dto.hora_inicio}:00Z`),
        hora_fin: new Date(`1970-01-01T${dto.hora_fin}:00Z`),
      },
      include: {
        grupo: true,
      },
    });
  }
  async update(id: number, dto: UpdateHorarioGrupoDto) {
    const actual = await this.findOne(id);
    const hora_inicio = dto.hora_inicio
      ? new Date(`1970-01-01T${dto.hora_inicio}:00Z`)
      : actual.hora_inicio;
    const hora_fin = dto.hora_fin
      ? new Date(`1970-01-01T${dto.hora_fin}:00Z`)
      : actual.hora_fin;

    if (hora_fin <= hora_inicio) {
      throw new BadRequestException(
        `la hora de inicio tiene que se menos a la hora fin`,
      );
    }
    return await this.prisma.horarioGrupo.update({
      where: { id_horario: id },
      data: {
        dia_semana: dto.dia_semana,
        grupo_id: dto.grupo_id,
        ...(dto.hora_inicio && {hora_inicio}),
        ...(dto.hora_fin && {hora_fin}),
      },
      include: { grupo: true },
    });
  }
  private validatehoras(hora_inicio: string, hora_fin: string) {
    if (hora_fin <= hora_inicio) {
      throw new BadRequestException(
        `la hora de inicio tiene que se menos a la hora fin`,
      );
    }
  }
}
