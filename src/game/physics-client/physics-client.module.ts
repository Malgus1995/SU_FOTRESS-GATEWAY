import {
  Module,
} from '@nestjs/common';

import {
  PhysicsClientService,
} from './physics-client.service';

@Module({
  providers: [
    PhysicsClientService,
  ],

  exports: [
    PhysicsClientService,
  ],
})
export class PhysicsClientModule {}