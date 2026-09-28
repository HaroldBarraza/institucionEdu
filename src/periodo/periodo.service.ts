import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoPeriodo } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePeriododto } from './dto/create.periodo.dto.js';
import { CambiarEstadoPeriododto } from './dto/update.periodo.dto.js';

const LIMITE_CREDITOS_ESTANDAR = 22

@Injectable()
export class PeriodoService {
    constructor(private readonly prisma:PrismaService){}
    async findAll(){
        return this.prisma.periodo.findMany({
            orderBy:{year: "desc"}
        })
    }async findOne(id:number){
        const result = await this.prisma.periodo.findUnique({
            where:{
                id_periodo: id
            },
            include:{grupos: true}
        })
        if(!result){
            throw new NotFoundException(`Periodo ${id} no encontrado`)
        }
        return result
    }
    async create (dto: CreatePeriododto){
        const {year} = dto;
        const result = await this.prisma.periodo.findFirst({
            where: { year }
        })
        if(result){
            throw new ConflictException(`ya se tiene un periodo creado`)
        }
        const [primerSemestre, segundoSemestre] = await this.prisma.$transaction([
            this.prisma.periodo.create({
                data: {
                    year,
                    numero: 1,
                    nombre: `Primer Semestre ${year}`,
                    fecha_inicio: new Date(`${year}-02-01T00:00:00Z`),
                    fecha_fin: new Date(`${year}-07-31T00:00:00Z`),
                    limite_creditos: LIMITE_CREDITOS_ESTANDAR,
                    estado: EstadoPeriodo.PREPARADO
                }
            }),
            this.prisma.periodo.create({
                data:{
                                        year,
                    numero: 2,
                    nombre: `Segundo Semestre ${year}`,
                    fecha_inicio: new Date(`${year}-08-01T00:00:00Z`),
                    fecha_fin: new Date(`${year}-12-31T00:00:00Z`),
                    limite_creditos: LIMITE_CREDITOS_ESTANDAR,
                    estado: EstadoPeriodo.PREPARADO
                }
            })
        ])
        return [primerSemestre, segundoSemestre]
    }
    async updateEstado(id:number, dto: CambiarEstadoPeriododto){
        const result = await this.findOne(id)
        if(result?.estado === dto.estado){
            throw new BadRequestException(`El periodo ya esta en estado ${dto.estado}`)
        }
        this.validarTransicion(result!.estado, dto.estado)
        if(dto.estado === EstadoPeriodo.ACTIVO){
            await this.validarUnicoActivo(id)
        }
        return this.prisma.periodo.update({
            where:{
                id_periodo: id
            },
            data:{
                estado: dto.estado
            }
        })
    }
    private validarTransicion(actual: EstadoPeriodo, nuevo: EstadoPeriodo){
        const permitidas: Record<EstadoPeriodo, EstadoPeriodo[]> = {
            [EstadoPeriodo.PREPARADO]:[EstadoPeriodo.ACTIVO],
            [EstadoPeriodo.ACTIVO]:[EstadoPeriodo.CERRADO],
            [EstadoPeriodo.CERRADO]:[],
        }
        if(!permitidas[actual].includes(nuevo)){
            throw new BadRequestException(`trancicion no permitida ${actual} -> ${nuevo}`)
        }
    }
    private async validarUnicoActivo(excluirId?:number){
        const activo = await this.prisma.periodo.findFirst({
            where:{
                estado:EstadoPeriodo.ACTIVO,
                NOT:excluirId ? {id_periodo:excluirId} : undefined
            }
        })
        if(activo){
            throw new BadRequestException(
                `Ya existe un periodo activo: "${activo.nombre}"`
            )
        }
    }
    
}
