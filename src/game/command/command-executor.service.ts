import {
  Injectable,
  Logger,
} from '@nestjs/common';

import type {
  PlayerCommand,
  GameSnapshot,
} from '../common/types/snapshots';

import type {
  Room,
} from '../entities/rooms.entity';

import {
  PhysicsClientService,
} from '../physics-client/physics-client.service';

@Injectable()
export class CommandExecutorService {
  private readonly logger =
    new Logger(
      CommandExecutorService.name,
    );

  constructor(
    private readonly physicsClient:
      PhysicsClientService,
  ) {}

  async execute(
    room: Room,
    command: PlayerCommand,
  ): Promise<GameSnapshot> {
    this.logger.debug(
      `Execute ${command.type} room=${room.id} player=${command.playerId}`,
    );

    const nextSnapshot =
      await this.physicsClient
        .processCommand(
          room.snapshot,
          command,
        );

    room.snapshot =
      nextSnapshot;

    if (
      nextSnapshot.winner
    ) {
      room.status =
        'finished';
    }

    return nextSnapshot;
  }
}