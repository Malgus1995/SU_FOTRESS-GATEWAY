import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';

@Injectable()
export class GameService {
  private players = new Map<string, Player>();

addPlayer(id: string) {
  const existingPlayers =
    Array.from(
      this.players.values(),
    );

  let x = 0;

  while (true) {
    x =
      Math.floor(
        Math.random() * 700,
      ) + 50;

    const tooClose =
      existingPlayers.some(
        (player) =>
          Math.abs(player.x - x) < 100,
      );

    if (!tooClose) {
      break;
    }
  }

this.players.set(id, {
  id,
  roomId: null,
  nickname: id,
  characterId: 'tank01',
  hp: 100,
  x,
  y: 540,
});
}

  removePlayer(id: string) {
    this.players.delete(id);
  }

  getPlayer(id: string) {
    return this.players.get(id);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  joinRoom(id: string, roomId: string) {
    const player = this.players.get(id);

    if (!player) return null;

    player.roomId = roomId;

    return player;
  }

  movePlayer(id: string, x: number, y: number) {
    const player = this.players.get(id);

    if (!player) return null;

    player.x = x;
    player.y = y;

    return player;
  }
}