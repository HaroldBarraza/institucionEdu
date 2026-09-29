import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateObligacionDto } from './dto/create-obligacion.dto.js';
import { UpdateObligacionDto } from './dto/update-obligacion.dto.js';
import { CambiarEstadoObligacionDto } from './dto/cambiar-estado-obligacion.dto.js';
import { EstadoDeuda, EstadoUsuario } from '../generated/prisma/enums.js';
import { Role } from '../generated/prisma/enums.js';


@Injectable()
export class ObligacionesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.obligacionFinanciera.findMany({
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
        periodo: true,
        pagos: true,
      },
      orderBy: { fecha_vencimiento: 'desc' },
    });
  }
  async findOne(id: number) {
    const obligacion = await this.prisma.obligacionFinanciera.findUnique({
      where: { id_obligacion: id },
      include: {
        estudiante: {
          include: {
            usuario: true,
          },
        },
        periodo: true,
        inscripcion: {
          include: {
            grupo: {
              include: {
                materia: true,
              },
            },
          },
        },
        pagos: true,
      },
    });
    if(!obligacion){
        throw new NotFoundException(`la obligacion con id ${id} no existe`)
    }
    return obligacion
  }
  async create(dto:CreateObligacionDto){
    return this.prisma.obligacionFinanciera.create({
        data:dto,
        include:{
            estudiante:{
                include:{
                    usuario:true
                }
            },periodo:true
        }
    })
  }
  async update(id:number, dto:UpdateObligacionDto){
    const obligacion = await this.findOne(id)
    if(obligacion.estado === 'PAGADO'){
        throw new BadRequestException(`no se puede modificar cuando el estod es pagado`)
    }
    return this.prisma.obligacionFinanciera.update({
        where:{id_obligacion:id},
        data:dto,
        include:{
            estudiante:{
                include:{
                    usuario:true
                }
            },
            periodo:true
        }
    })
  }
  async cambiarestado(id:number, dto:CambiarEstadoObligacionDto){
    const obligacion = await this.findOne(id)
    if(obligacion.estado === dto.estado){
        throw new BadRequestException(`la obligacion ya esta en ese estado`)
    }
    return this.prisma.obligacionFinanciera.update({
        where:{id_obligacion:id},
        data:{estado:dto.estado},
        include:{
            estudiante:{
                include:{
                    usuario:true
                }
            },periodo:true
        }
    })
  }
  async marcarVencidas() {
  const resultado = await this.prisma.obligacionFinanciera.updateMany({
    where: {
      estado: EstadoDeuda.PENDIENTE,
      fecha_vencimiento: { lt: new Date() },
    },
    data: { estado: EstadoDeuda.VENCIDO },
  });

  return {
    message: `${resultado.count} obligaciones marcadas como VENCIDAS`,
    count: resultado.count,
  };
}

async suspenderMorosos() {
  const obligacionesVencidas = await this.prisma.obligacionFinanciera.findMany({
    where: { estado: EstadoDeuda.VENCIDO },
    select: { estudiante_id: true },
    distinct: ['estudiante_id'],
  });

  const ids = obligacionesVencidas.map((o) => o.estudiante_id);

  if (ids.length === 0) {
    return { message: 'No hay estudiantes morosos', count: 0 };
  }

  const resultado = await this.prisma.usuario.updateMany({
    where: {
      id_usuario: { in: ids },
      rol: Role.ESTUDIANTE,
      estado: EstadoUsuario.ACTIVO,
    },
    data: { estado: EstadoUsuario.SUSPENDIDO_MORA },
  });

  return {
    message: `${resultado.count} estudiantes suspendidos por mora`,
    count: resultado.count,
  };
}
}
