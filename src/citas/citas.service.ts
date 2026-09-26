import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCitasDto } from './dto/create-citas.dto.js';
import { UpdateCitasDto } from './dto/update-citas.dto.js';
import { PacientesService } from '../pacientes/pacientes.service.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UsersService } from '../users/users.service.js';

const formatDate = (date: Date | string | null): string | null => {
  if (!date) return null;
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

const formatTime = (time: Date | string | null): string | null => {
  if (!time) return null;
  return format(new Date(time), 'HH:mm', { locale: es });
};
@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacienteService: PacientesService,
    private readonly userService: UsersService,
  ) {}
  async findAll() {
    return this.prisma.citas.findMany({
      orderBy: { id_cita: 'asc' },
      include: {
        pacientes: {
          select: {
            name_paciente: true,
            appaterno_paciente: true,
            apmaterno_paciente: true,
            genero: true,
            fecha_nacimiento: true,
          },
        },
        estado: {
          select: {
            name_estado: true,
          },
        },
        medico: {
          select: {
            name_empleado: true,
            appaterno: true,
            especialidades: true,
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
    });
  }
  async create(CreateCitasDto: CreateCitasDto, creado_por:number) {
    await this.pacienteService.findOne(CreateCitasDto.id_paciente);
    await this.userService.findMedico(CreateCitasDto.id_medico);
    await this.userService.findCreater(creado_por);

    const [h, m] = CreateCitasDto.hora_de_cita.split(':').map(Number);
    const horaDate = new Date();
    horaDate.setHours(h, m, 0, 0);
    return await this.prisma.citas.create({
      data: {
        fecha_de_cita: CreateCitasDto.fecha_de_cita,
        hora_de_cita: horaDate, // 👈 ahora sí, Date
        id_medico: CreateCitasDto.id_medico,
        id_paciente: CreateCitasDto.id_paciente,
        descripcion: CreateCitasDto.descripcion,
        creado_por,
        id_estado: 1,
      },
    });
  }
  async findOne(id_cita: number) {
    const cita = await this.prisma.citas.findUnique({
      where: { id_cita },
    });
    if (!cita) {
      throw new NotFoundException(`la cita ${id_cita} no existe`);
    }
    return cita;
  }
  async update(id_cita: number, UpdateCitasDto: UpdateCitasDto) {
    const citavalidate = await this.prisma.citas.findUnique({
      where: { id_cita },
    });
    if (!citavalidate) {
      throw new NotFoundException(`la cita ${id_cita} no existe`);
    }
    return await this.prisma.citas.update({
      where: { id_cita },
      data: UpdateCitasDto,
    });
  }
  async remove(id_cita: number) {
    const citavalidate = await this.prisma.citas.findUnique({
      where: { id_cita },
    });
    if (!citavalidate) {
      throw new NotFoundException(`la cita ${id_cita} no existe`);
    }
    const cita = await this.prisma.citas.delete({
      where: { id_cita },
    });
    return `se elimino con extito el usuario con id ${id_cita}`;
  }
  async filterforDoctor(
    id_empleado: number,
    fecha_inicio: Date,
    fecha_final: Date,
  ) {
    const inicio = new Date(fecha_inicio);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha_final);
    fin.setHours(23, 59, 59, 999);
    const datos = await this.prisma.citas.findMany({
      where: {
        medico: { id_empleado },
        fecha_de_cita: { gte: inicio, lte: fin },
      },
      select: {
        fecha_de_cita: true,
        hora_de_cita: true,
        estado: {
          select: {
            name_estado: true,
          },
        },
        pacientes: {
          select: {
            name_paciente: true,
            appaterno_paciente: true,
            fecha_nacimiento: true,
            genero: true,
            telefono: true,
          },
        },
        descripcion: true,
      },
    });
    return datos.map((cita) => ({
      ...cita,
      fecha_de_cita: formatDate(cita.fecha_de_cita),
      hora: formatTime(cita.hora_de_cita),
    }));
  }
  async filtrarCitasEstado(fecha: Date) {
    const hora_inicio = new Date(fecha);
    hora_inicio.setHours(0, 0, 0, 0);
    const hora_fin = new Date(fecha);
    hora_fin.setHours(23, 59, 59, 999);

    const completado = await this.prisma.citas.count({
      where: {
        fecha_de_cita: {
          gte: hora_inicio,
          lte: hora_fin,
        },
        estado: {
          name_estado: 'COMPLETADA',
        },
      },
    });
    const cancelado = await this.prisma.citas.count({
      where: {
        fecha_de_cita: { gte: hora_inicio, lte: hora_fin },
        estado: {
          name_estado: 'CANCELADA',
        },
      },
    });
    return {
      fecha_de_cita: formatDate(fecha),
      completado: completado,
      cancelado: cancelado,
      total: completado + cancelado,
    };
  }
  async filtrarEspecialidad(fecha_inicio: Date, fecha_final: Date) {
    const fecha_ini = new Date(fecha_inicio);
    fecha_ini.setHours(0, 0, 0, 0);
    const fecha_fin = new Date(fecha_final);
    fecha_fin.setHours(23, 59, 59, 999);
    const resultado = await this.prisma.$queryRaw<
      Array<{ especialidad: string; total: BigInt }>
    >`SELECT e.name_especialidad AS especialidad,
             COUNT(c.id_cita) AS total
      FROM citas c
      JOIN users u ON c.id_medico = u.id_empleado
      JOIN especialidades e ON u.id_especialidad = e.id_especialidad
      WHERE c.fecha_de_cita BETWEEN ${fecha_ini} AND ${fecha_fin}
      GROUP BY e.name_especialidad
      ORDER BY total DESC`;

    return resultado.map((row) => ({
      especialidad: row.especialidad,
      total: Number(row.total),
    }));
  }
}
