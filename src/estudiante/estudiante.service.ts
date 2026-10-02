import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@Injectable()
export class EstudianteService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.estudiante.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
            telefono: true,
            estado: true,
          },
        },
        tutor: true,
      },
    });
  }
  async finOne(id: number) {
    const result = await this.prisma.estudiante.findUnique({
      where: { id_estudiante: id },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
            telefono: true,
            estado: true,
          },
        },
        tutor: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`el estudiante con id ${id} no existe`);
    }
    return result;
  }
  async create(dto: CreateEstudianteDto) {
    return this.prisma.estudiante.create({
      data: dto,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
          },
        },
        tutor: true,
      },
    });
  }
  async update(dto: UpdateEstudianteDto, id: number) {
    await this.finOne(id);
    return this.prisma.estudiante.update({
      where: {
        id_estudiante: id,
      },
      data: dto,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
          },
        },
        tutor: true,
      },
    });
  }
  async gethistorial(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id_estudiante: id },
      select: {
        id_estudiante: true,
        codigo_matricula: true,
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            nombre: true,
            appaterno: true,
            apmaterno: true,
            telefono: true,
            estado: true,
          },
        },
        obligaciones: {
          select: {
            id_obligacion: true,
            razon: true,
            monto: true,
            fecha_emision: true,
            fecha_vencimiento: true,
            estado: true,
            periodo: {
              select: { nombre: true, year: true, numero: true },
            },
            pagos: {
              select: {
                id_pago: true,
                monto: true,
                metodo: true,
                estado: true,
                fecha_pago: true,
                referencia_pasarela: true,
                fecha_verificacion: true,
                verificadoPorUsuario: {
                  select: {
                    id_usuario: true,
                    nombre: true,
                    appaterno: true,
                    rol: true,
                  },
                },
              },
              orderBy: { fecha_pago: 'desc' },
            },
          },
          orderBy: { fecha_vencimiento: 'desc' },
        },
      },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante ${id} no encontrado`);
    }

    return estudiante;
  }
}
