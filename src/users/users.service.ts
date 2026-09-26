import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update.user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.users.findMany({
      omit:{
        password:true
      }
    });
  }
  async findOne(id_empleado: number) {
    const user = await this.prisma.users.findUnique({
      where: { id_empleado },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`el empleado con ${id_empleado} no existe`);
    }
    return user;
  }
  async findMedico(id_empleado:number){
    const user = await this.prisma.users.findUnique({
      where:{id_empleado},
      include:{especialidades:true},
    })
    if(!user){
      throw new NotFoundException(`el medico no existe`)
    }
    if(user.role !== "MEDICO"){
      throw new NotFoundException(`el empleado con id ${id_empleado} no es medico`)
    }
    return user
  }
    async findCreater(id_empleado:number){
    const user = await this.prisma.users.findUnique({
      where:{id_empleado},
      include:{especialidades:true},
    })
    if(!user){
      throw new ForbiddenException(`el empleado no existe`)
    }
    if(user.role === "MEDICO"){
      throw new NotFoundException(`el empleado con id ${id_empleado} no tiene permiso para crear una cita`)
    }
    return user
  }
  async update(id_empleado: number, UpdateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { id_empleado },
    });
    if (!user) {
      throw new NotFoundException(`el empleado con ${id_empleado} no existe`);
    }
    return await this.prisma.users.update({
      where: { id_empleado },
      data: UpdateUserDto,
    });
  }
  async remove(id_empleado: number) {
    const user = await this.prisma.users.findUnique({
      where: { id_empleado },
    });
    if (!user) {
      throw new NotFoundException(`el empleado con ${id_empleado} no existe`);
    }
    const empleado = await this.prisma.users.delete({
      where: { id_empleado },
    });
    return `se elimino con exito el empleado con id ${id_empleado}`;
  }
  async findEspecialidad(especialidad: string) {
    const especialidadfind = await this.prisma.especialidades.findFirst({
      where: {
        name_especialidad: {
          equals: especialidad,
          mode: 'insensitive',
        },
      },
    });
    if (!especialidadfind) {
      throw new NotFoundException(`la especialidad ${especialidad} no existe`);
    }

    return await this.prisma.users.findMany({
      where: {
        role: 'MEDICO',
        especialidades: {
          name_especialidad: {
            equals: especialidad,
            mode: 'insensitive',
          },
        },
      },
      select: {
        name_empleado: true,
        appaterno: true,
        appmaterno: true,
        email: true,
        especialidades: {
          select: {
            name_especialidad: true,
          },
        },
        telefono: true,
      },
    });
  }
}
