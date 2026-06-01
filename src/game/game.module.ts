import { Module } from '@nestjs/common';

import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PhysicsModule } from 'src/physics/physics.module';

@Module({
  controllers: [GameController],
  providers: [GameGateway, GameService],
     imports: [
    PhysicsModule,
  ],
})
export class GameModule {}