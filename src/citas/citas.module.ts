import { Module } from '@nestjs/common';
import { CitasController } from './citas.controller.js';
import { CitasService } from './citas.service.js';
import { PacientesService } from '../pacientes/pacientes.service.js';
import { PacientesModule } from '../pacientes/pacientes.module.js';
import { UsersModule } from '../users/users.module.js';


@Module({
  imports:[PacientesModule, UsersModule],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
