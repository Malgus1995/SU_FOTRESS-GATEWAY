import { Injectable } from '@nestjs/common';

import {
  GameSnapshot,
} from './types/game-snapshot';

import {
  PlayerCommand,
} from './types/player-command';

@Injectable()
export class PhysicsService {

processCommand(
  snapshot: GameSnapshot,
  command: PlayerCommand,
): GameSnapshot {

  console.log(
    '[PHYSICS]',
    command,
  );

  switch (
    command.type
  ) {
    case 'MOVE':
      return this.move(
        snapshot,
        command,
      );

    case 'ATTACK':
      return this.attack(
        snapshot,
        command,
      );

    default:
      return snapshot;
  }
}

private move(
  snapshot: GameSnapshot,
  command: PlayerCommand,
): GameSnapshot {
  const player =
    snapshot.players.find(
      p =>
        p.id ===
        command.playerId,
    );
  if (!player) {
    return snapshot;
  }
  player.x +=
    command.distance ?? 0;
  return snapshot;
}

private attack(
  snapshot: GameSnapshot,
  command: PlayerCommand,
): GameSnapshot {
  const attacker =
    snapshot.players.find(
      p =>
        p.id ===
        command.playerId,
    );
  if (!attacker) {
    return snapshot;
  }
  const target =
    snapshot.players.find(
      p =>
        p.id !==
          attacker.id &&
        p.alive,
    );
  if (!target) {
    return snapshot;
  }
  target.hp -= 20;
  if (
    target.hp <= 0
  ) {
    target.hp = 0;
    target.alive =
      false;
    snapshot.winner =
      attacker.id;
  }
  return snapshot;
}
}