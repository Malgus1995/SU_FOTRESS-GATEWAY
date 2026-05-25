import { Injectable } from '@nestjs/common';

export interface Player {
  id: string;
  roomId: string | null;
  x: number;
  y: number;
}

@Injectable()
export class GameService {
  private players = new Map<string, Player>();

  addPlayer(id: string) {
    this.players.set(id, {
      id,
      roomId: null,
      x: 0,
      y: 0,
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