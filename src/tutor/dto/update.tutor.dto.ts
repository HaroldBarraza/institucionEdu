import { PartialType } from "@nestjs/swagger";
import { CreateTutorDto } from "./create.tutor.dto.js";

export class UpdateTutorDto extends PartialType(CreateTutorDto){}