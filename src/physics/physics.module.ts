import { PhysicsService } from "./physics.service";
import { Module } from '@nestjs/common';

@Module({
  providers: [
    PhysicsService,
  ],
  exports: [
    PhysicsService,
  ],
})
export class PhysicsModule {}