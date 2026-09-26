import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundError } from 'rxjs';
import { UpdatePacienteDto } from './dto/update.paciente.dto.js';
import { CreatePacienteDto } from './dto/create.pacientes.dto.js';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.pacientes.findMany();
  }
  async findOne(id_paciente: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_paciente },
    });
    if (!paciente) {
      throw new NotFoundException(
        `el paciente con id ${id_paciente} no existe`,
      );
    }
    return paciente;
  }
  async create(CreatePacienteDto: CreatePacienteDto) {
    const create = await this.prisma.pacientes.create({
      data: CreatePacienteDto,
    });
    return create;
  }
  async update(id_paciente: number, UpdatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_paciente },
    });
    if (!paciente) {
      throw new NotFoundException(
        `el paciente con id ${id_paciente} no existe`,
      );
    }
    return await this.prisma.pacientes.update({
      where: { id_paciente },
      data: UpdatePacienteDto,
    });
  }
  async remove(id_paciente: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_paciente },
    });
    if (!paciente) {
      throw new NotFoundException(
        `el paciente con id ${id_paciente} no existe`,
      );
    }
    const pacientedel = await this.prisma.pacientes.delete({
      where: { id_paciente },
    });
    return `se elimino con exito al paciente con id ${id_paciente}`;
  }
  async findforCitas(id_paciente: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_paciente },
    });
    if (!paciente) {
      throw new NotFoundException(
        `no es econtro al paciente con el id ${id_paciente}`,
      );
    }
    return await this.prisma.pacientes.findUnique({
      where: { id_paciente },
      include: {
        citas: {
          orderBy: { fecha_de_cita: 'desc' },
          include: {
            medico: {
              select: {
                name_empleado: true,
                appaterno: true,
                especialidades: {
                  select: {
                    name_especialidad: true,
                  },
                },
              },
            },
            estado: {
              select: {
                name_estado: true,
              },
            },
            users: {
              select: {
                name_empleado: true,
                appaterno: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
