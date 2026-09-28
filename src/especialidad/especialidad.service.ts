import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { createEspecialidadDto } from './dto/create.especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update.especialidad.dto.js';

@Injectable()
export class EspecialidadService {
    constructor( private readonly prisma:PrismaService){}
    async findall(){
        return await this.prisma.especialidad.findMany({
            orderBy:{nombre: "asc"}
        })
    }
    async findone(id:number){
        const result = await this.prisma.especialidad.findUnique({
            where:{
                id_especialidad:id
            }
        })
        if(!result){
            throw new NotFoundException(`la especialidad con id  ${id} no existe`)
        }
        return result
    }
    async create(dto: createEspecialidadDto){
        const existe = await this.prisma.especialidad.findFirst({
            where:{
                nombre:{
                    equals:dto.nombre,
                    mode: "insensitive"
                }
            }
        })
        if(!existe){
            throw new ConflictException (`la especialidad ${dto.nombre} ya existe`)
        }
        return this.prisma.especialidad.create({data: dto})
    }
    async update(id: number, dto: UpdateEspecialidadDto){
        const existe = await this.prisma.especialidad.findFirst({
            where:{
                nombre:{
                    equals: dto.nombre, mode: "insensitive"},
                    NOT: {id_especialidad: id}
            }
        })
        if(existe){
            throw new ConflictException(`la especialidad con nombre ${dto.nombre} ya existe`)
        }
        return await this.prisma.especialidad.update({
            where:{
                id_especialidad:id
            },
            data: dto
        })
        
    }

}
