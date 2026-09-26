import { PartialType } from '@nestjs/swagger'
import { CreatePacienteDto } from './create.pacientes.dto.js'


export class UpdatePacienteDto extends PartialType(CreatePacienteDto){}
