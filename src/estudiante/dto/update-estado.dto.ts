import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoUsuario } from '../../generated/prisma/enums.js';

export class CambiarEstadoDto {
  @IsNotEmpty({ message: 'El campo estado es obligatorio.' })
  @IsEnum(EstadoUsuario, { message: 'El estado proporcionado no es válido utilize SUSPENDIDO_MORA'})
  estado: EstadoUsuario;
}