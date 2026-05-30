import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { Room } from './entities/rooms.entity';

@Injectable()
export class GameService {
  private players = new Map<string, Player>();
  private rooms = new Map<string, Room>();

  createRoom(
  roomName: string,
  hostId: string,
  maxPlayers: number,
) {
const room: Room = {
  id: crypto.randomUUID(),
  roomName,
  hostId,
  maxPlayers,
  status: 'waiting',
  players: [hostId],
  readyPlayers: [],
};

  this.rooms.set(
    room.id,
    room,
  );

  return room;
}

getRooms() {
  return Array.from(
    this.rooms.values(),
  );
}

getRoom(id: string) {
  return this.rooms.get(id);
}

deleteRoom(id: string) {
  return this.rooms.delete(id);
}

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

  readyPlayer(
  playerId: string,
) {
  const player =
    this.players.get(playerId);

  if (
    !player ||
    !player.roomId
  ) {
    return null;
  }

  const room =
    this.rooms.get(
      player.roomId,
    );

  if (!room) {
    return null;
  }

  if (
    !room.readyPlayers.includes(
      playerId,
    )
  ) {
    room.readyPlayers.push(
      playerId,
    );
  }

  return room;
}

isReadyToStart(
  roomId: string,
) {
  const room =
    this.rooms.get(roomId);

  if (!room) {
    return false;
  }

  return (
    room.players.length >= 2 &&
    room.readyPlayers.length ===
      room.players.length
  );
}

joinRoom(
  playerId: string,
  roomId: string,
) {
  const player =
    this.players.get(playerId);

  const room =
    this.rooms.get(roomId);

  if (!player) {
    return null;
  }

  if (!room) {
    return null;
  }

  player.roomId = roomId;

  if (
    !room.players.includes(
      playerId,
    )
  ) {
    room.players.push(
      playerId,
    );
  }
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