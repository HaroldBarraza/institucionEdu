import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoDeuda,
  EstadoPago,
  MetodoPago,
} from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { FiltroPagoDto } from './dto/filtrar-pago.dto.js';
import { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}
  /*   async findAll() {
    return await this.prisma.pago.findMany({
      include: {
        obligacion: {
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
          },
        },
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
    });
  } */
  async findOne(id: number) {
    const pago = await this.prisma.pago.findUnique({
      where: { id_pago: id },
      include: {
        obligacion: {
          include: {
            estudiante: {
              include: {
                usuario: true,
              },
            },
          },
        },
        verificadoPorUsuario: {
          select: {
            id_usuario: true,
            nombre: true,
            appaterno: true,
            rol: true,
          },
        },
      },
    });
    if (!pago) {
      throw new NotFoundException(`el pago con id ${id} no existe`);
    }
    return pago;
  }
  async create(dto: CreatePagoDto, user: JwtPayload) {
    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: { id_obligacion: dto.obligacion_id },
    });
    if (!obligacion) {
      throw new NotFoundException(
        `no se encuentra la obligacion numero ${dto.obligacion_id}`,
      );
    }
    if (obligacion.estado === EstadoDeuda.PAGADO) {
      throw new BadRequestException(`la obligacion ya esta pagada`);
    }
    if (obligacion.estado === EstadoDeuda.CANCELADA) {
      throw new BadRequestException(`la obligacion ya esta cancelada`);
    }
    if (dto.monto > Number(obligacion.monto)) {
      throw new BadRequestException(`el monto del pago supero a la deuda`);
    }
    if (dto.monto < Number(obligacion.monto)) {
      throw new BadRequestException(
        `el monto del pago tiene que ser no menor a ${obligacion.monto}`,
      );
    }
    const caja = dto.metodo === MetodoPago.CAJA;

    const datoApro = caja
      ? {
          estado: EstadoPago.ACEPTADO,
          fecha_verificacion: new Date(),
          verificado_por_usuario_id: user.sub,
        }
      : {
          estado: EstadoPago.PENDIENTE,
          fecha_verificacion: null,
          verificado_por_usuario_id: null,
        };

    return this.prisma.$transaction(async (tx) => {
      if (caja) {
        await tx.obligacionFinanciera.update({
          where: { id_obligacion: dto.obligacion_id },
          data: { estado: EstadoDeuda.PAGADO },
        });
      }

      return tx.pago.create({
        data: {
          ...dto,
          ...datoApro,
        },
        include: {
          obligacion: true,
        },
      });
    });
  }
  async aprobar(id: number, user: JwtPayload) {
    const pago = await this.findOne(id);
    if (pago.estado === EstadoPago.ACEPTADO) {
      throw new BadRequestException(`el pago ya esta aceptado`);
    }
    if (pago.estado === EstadoPago.RECHAZADO) {
      throw new BadRequestException(`el pago ya fue rechazado`);
    }
    return this.prisma.$transaction(async (tx) => {
      const pagoActualizado = await tx.pago.update({
        where: {
          id_pago: id,
        },
        data: {
          estado: EstadoPago.ACEPTADO,
          verificado_por_usuario_id: user.sub,
          fecha_verificacion: new Date(),
        },
      });
      const pagoAprobados = await tx.pago.aggregate({
        where: {
          obligacion_id: pago.obligacion_id,
          estado: EstadoPago.ACEPTADO,
        },
        _sum: { monto: true },
      });
      const totalPagado = Number(pagoAprobados._sum.monto ?? 0);
      const montoObligacion = Number(pago.obligacion.monto);
      if (totalPagado >= montoObligacion) {
        await tx.obligacionFinanciera.update({
          where: {
            id_obligacion: pago.obligacion_id,
          },
          data: { estado: EstadoDeuda.PAGADO },
        });
      }
      return pagoActualizado;
    });
  }
  async rechazar(id: number, user: JwtPayload) {
    const pago = await this.findOne(id);
    if (pago.estado === EstadoPago.ACEPTADO) {
      throw new BadRequestException(`el pago ya esta aceptado`);
    }
    if (pago.estado === EstadoPago.RECHAZADO) {
      throw new BadRequestException(`el pago fue rechazado`);
    }
    return this.prisma.pago.update({
      where: {
        id_pago: id,
      },
      data: {
        estado: EstadoPago.RECHAZADO,
        verificado_por_usuario_id: user.sub,
        fecha_verificacion: new Date(),
      },
    });
  }
  async filtrar(filtro: FiltroPagoDto = {}) {
    return this.prisma.pago.findMany({
      where: {
        obligacion: {
          razon: filtro.razon,
        },
      },
      include: {
        obligacion: {
          include: {
            estudiante: {
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
            periodo: {
              select: {
                nombre: true,
                year: true,
                numero: true,
              },
            },
          },
        },
        verificadoPorUsuario: {
          select: {
            id_usuario: true,
            nombre: true,
            appaterno: true,
            rol: true,
          },
        },
      },
    });
  }
}
