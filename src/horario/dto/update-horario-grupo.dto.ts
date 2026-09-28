import { PartialType } from '@nestjs/swagger';
import { CreateHorarioGrupoDto } from './create-horario-grupo.dto.js';

export class UpdateHorarioGrupoDto extends PartialType(CreateHorarioGrupoDto) {}