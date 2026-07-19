import {
  Module,
} from '@nestjs/common';

import {
  GameController,
} from './game.controller';

import {
  GameGateway,
} from './game.gateway';

import {
  GameService,
} from './game.service';

import {
  CommandModule,
} from './command/command.module';

@Module({
  imports: [
    CommandModule,
  ],

  controllers: [
    GameController,
  ],

  providers: [
    GameGateway,
    GameService,
  ],

  exports: [
    GameService,
  ],
})
export class GameModule {}