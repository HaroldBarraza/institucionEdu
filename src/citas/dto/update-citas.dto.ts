import { PartialType } from "@nestjs/swagger";
import { CreateCitasDto } from "./create-citas.dto.js";

export class UpdateCitasDto extends PartialType(CreateCitasDto){}
    