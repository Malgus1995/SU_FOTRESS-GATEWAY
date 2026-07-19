import {
  Module,
} from '@nestjs/common';

import {
  PhysicsClientModule,
} from '../physics-client/physics-client.module';

import {
  CommandExecutorService,
} from './command-executor.service';

@Module({
  imports: [
    PhysicsClientModule,
  ],

  providers: [
    CommandExecutorService,
  ],

  exports: [
    CommandExecutorService,
  ],
})
export class CommandModule {}