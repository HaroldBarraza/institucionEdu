import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAsignacionDto } from './dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto.js';


@Injectable()
export class AsignacionService {
    constructor(private readonly prisma:PrismaService){}
    findAll(){
        return this.prisma.asignacion.findMany({
            include:{
                grupo:{
                    include:{
                        materia:true,
                        periodo: true,
                    }
                },
                docente:{
                    include:{
                        usuario:{
                            select:{
                                id_usuario:true,
                                nombre:true,
                                appaterno:true,
                                apmaterno: true,
                            }
                        }
                    }
                }
            },
            orderBy:{creacion_asignacion:"desc"}
        })
    }
    async findOne(id:number){
        const asignacion = await this.prisma.asignacion.findUnique({
            where:{id_asignacion: id},
            include:{
                grupo:{
                    include:{
                        materia:true,
                        periodo: true,
                    }
                },
                docente:{
                    include:{
                        usuario:{
                            select:{
                                id_usuario:true,
                                nombre:true,
                                appaterno:true,
                                apmaterno:true
                            }
                        }
                    }
                },
                entregas:true
            }
        })
        if(!asignacion){
            throw new NotFoundException(`no se encontro la asignacion con id ${id}`)
        }
        return asignacion
    }
    create(dto: CreateAsignacionDto){
        return this.prisma.asignacion.create({
            data:dto,
            include:{
                grupo:{
                    include:{
                        materia:true,
                        periodo:true
                    }
                    
                },docente:{
                    include:{
                        usuario:true
                    }
                }
            }
        })
    }
    async update(id:number, dto:UpdateAsignacionDto){
        await this.findOne(id)
        return this.prisma.asignacion.update({
            where:{id_asignacion:id},
            data: dto,
            include:{
                grupo:{
                    include:{
                        materia:true,
                        periodo:true
                    }
                },
                docente:{
                    include:{
                        usuario:true
                    }
                }
            }
        })
    }
}
