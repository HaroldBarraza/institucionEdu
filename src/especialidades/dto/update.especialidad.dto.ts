import { PartialType } from "@nestjs/swagger";
import { CreateEspecialidadDto } from "./create.especilidad.dto.js";

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto){}