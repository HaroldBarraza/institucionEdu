import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service.js';
import { TutorController } from './tutor.controller.js';


@Module({
  providers: [TutorService],
  controllers: [TutorController]
})
export class TutorModule {}
