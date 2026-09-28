import { PartialType } from '@nestjs/swagger';
import { CreateEntregaArchivoDto } from './create-entrega-archivo.dto.js';

export class UpdateEntregaArchivoDto extends PartialType(
  CreateEntregaArchivoDto,
) {}