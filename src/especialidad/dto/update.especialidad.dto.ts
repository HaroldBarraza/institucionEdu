import { PartialType } from "@nestjs/swagger";
import { createEspecialidadDto } from "./create.especialidad.dto.js";

export class UpdateEspecialidadDto extends PartialType(createEspecialidadDto) {}