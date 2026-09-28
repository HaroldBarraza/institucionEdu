import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service.js';
import { GrupoController } from './grupo.controller.js';

@Module({
  providers: [GrupoService],
  controllers: [GrupoController]
})
export class GrupoModule {}
