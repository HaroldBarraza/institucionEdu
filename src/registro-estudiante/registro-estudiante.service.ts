import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRegistroEstudianteDto } from './dto/registro-usuario.dto.js';
import { EstadoDeuda, EstadoPeriodo, EstadoUsuario,RazonPago, Role } from '../generated/prisma/enums.js';
import * as bcrypt from 'bcrypt'

const MATRICULA = 500

@Injectable()
export class RegistroEstudianteService {
    constructor(private readonly prisma: PrismaService){}
    async registrarPostulante(dto:CreateRegistroEstudianteDto){
        const periodo = await this.prisma.periodo.findFirst({
            where:{
                estado:"ACTIVO"
            }
        })
        if(!periodo){
            throw new BadRequestException(`el perido no esta activo aun`)
        }
        const password = await bcrypt.hash(dto.password, 10)
        const condigoMAtricula = await this.generarCodigo()
        return this.prisma.$transaction(async(tx) => {
            const usuario = await tx.usuario.create({
                data:{
                    email:dto.email,
                    password,
                    nombre: dto.nombre,
                    appaterno:dto.appaterno,
                    apmaterno: dto.apmaterno,
                    telefono: dto.telefono,
                    rol:Role.ESTUDIANTE,
                    estado: EstadoUsuario.PENDIENTE_APROBACION
                },
                select:{
                    id_usuario: true,
                    email:true,
                    nombre:true,
                    appaterno:true,
                    apmaterno:true,
                    telefono:true,
                    rol: true,
                    estado: true
                }
            })
            const estudiante = await tx.estudiante.create({
                data:{
                    id_estudiante:usuario.id_usuario,
                    codigo_matricula: condigoMAtricula,
                    tutor_id: dto.tutor ?? null
                }
            })
            const fecha_vencimiento = new Date()
            fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 5)
            const obligacion = await tx.obligacionFinanciera.create({
                data:{
                    estudiante_id:usuario.id_usuario,
                    razon: RazonPago.MATRICULA,
                    monto: MATRICULA,
                    fecha_vencimiento:fecha_vencimiento,
                    estado: EstadoDeuda.PENDIENTE,
                    periodo_id: periodo.id_periodo
                }
            })
            return{
                usuario,
                estudiante,
                obligacion,
                mensaje:"Registro exitoso. Debe pagar la matricula y epserar la aprobacion"
            }
        })
    }
    private async generarCodigo(): Promise<string>{
        const year = new Date().getFullYear();
        const prefijo = `MAT - ${year} -`
        const ultimo = await this.prisma.estudiante.findFirst({
            where:{
                codigo_matricula:{
                    startsWith:prefijo
                }
            },
            orderBy:{
                codigo_matricula:"desc"
            }
        })
        const siguiente = ultimo ? parseInt(ultimo.codigo_matricula.split('-')[2], 10)+1 : 1
        return `${prefijo}${siguiente.toString().padStart(5, '0')}`

    }
    
}
