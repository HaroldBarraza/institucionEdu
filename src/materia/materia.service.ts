import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';

@Injectable()
export class MateriaService {
    constructor(private readonly prisma:PrismaService){}
    findAll(){
        return this.prisma.materia.findMany()
    }
    async fidOne(id:number){
        const materia = await this.prisma.materia.findUnique({
            where:{id_materia: id},
            include:{
                grupos:true
            }
        })
        if(!materia){
            throw new NotFoundException(`la materia con id ${id} no existe`)
        }
        return materia
    }
    async create(dto:CreateMateriaDto){
        return this.prisma.materia.create({
            data:dto,
        })
    }
    async update(id:number, dto:UpdateMateriaDto){
        await this.fidOne(id)
        return this.prisma.materia.update({
            where:{id_materia: id},
            data:dto,
        })
    }
}
