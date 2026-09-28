import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTutorDto } from './dto/create.tutor.dto.js';
import { UpdateTutorDto } from './dto/update.tutor.dto.js';

@Injectable()
export class TutorService {
    constructor(private readonly prisma:PrismaService){}
    async findAll(){
        return await this.prisma.tutor.findMany({
            orderBy:{
                nombre:"asc"
            }
        })
    }
    async findOne(id:number){
        const result =  await this.prisma.tutor.findFirst({
            where:{
                id_tutor: id
            },
            include:{
                estudiantes: true
            }
        }) 
        if(!result){
            throw new NotFoundException(`el tutor con id ${id} no existe`)
        }
        return result
    }
    async create(dto:CreateTutorDto){
        return this.prisma.tutor.create({
            data: dto
        })
    }
    async update(id:number, dto:UpdateTutorDto){
        const result = await this.prisma.tutor.findUnique({
            where: {id_tutor:id}
        })
        if(!result){
            throw new NotFoundException(`el tutor con id ${id} no exite`)
        }
        return await this.prisma.tutor.update({
            where:{id_tutor:id},
            data: dto
        })
    }
}
