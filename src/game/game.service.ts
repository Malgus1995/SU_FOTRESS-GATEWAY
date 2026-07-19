import {
  Injectable,
} from '@nestjs/common';

import {
  Player,
} from './entities/player.entity';

import type {
  Room,
} from './entities/rooms.entity';

@Injectable()
export class GameService {
  private readonly players =
    new Map<string, Player>();

  private readonly rooms =
    new Map<string, Room>();

  createRoom(
    roomName: string,
    hostId: string,
    maxPlayers: number,
  ): Room {
    const host =
      this.players.get(hostId);

    const room: Room = {
      id:
        crypto.randomUUID(),

      roomName,

      hostId,

      maxPlayers,

      status:
        'waiting',

      players: [
        hostId,
      ],

      readyPlayers: [],

      snapshot: {
        version:
          0,

        currentTurn:
          hostId,

        winner:
          null,

        turnAction: {
          moved:
            false,

          attacked:
            false,
        },

        players: host
          ? [
              this.toSnapshotPlayer(
                host,
              ),
            ]
          : [],
      },
    };

    if (host) {
      host.roomId =
        room.id;
    }

    this.rooms.set(
      room.id,
      room,
    );

    return room;
  }

  getRooms(): Room[] {
    return Array.from(
      this.rooms.values(),
    );
  }

  getRoom(
    id: string,
  ): Room | undefined {
    return this.rooms.get(id);
  }

  deleteRoom(
    id: string,
  ): boolean {
    return this.rooms.delete(id);
  }

  addPlayer(
    id: string,
  ): Player {
    const existingPlayers =
      Array.from(
        this.players.values(),
      );

    let x = 0;
    let attempts = 0;

    do {
      x =
        Math.floor(
          Math.random() *
            700,
        ) + 50;

      attempts += 1;
    } while (
      existingPlayers.some(
        player =>
          Math.abs(
            player.x - x,
          ) < 100,
      ) &&
      attempts < 100
    );

    const player: Player = {
      id,

      roomId:
        null,

      nickname:
        id,

      characterId:
        'tank01',

      hp:
        100,

      x,

      y:
        540,
    };

    this.players.set(
      id,
      player,
    );

    return player;
  }

  removePlayer(
    id: string,
  ): void {
    const player =
      this.players.get(id);

    if (player?.roomId) {
      const room =
        this.rooms.get(
          player.roomId,
        );

      if (room) {
        room.players =
          room.players.filter(
            playerId =>
              playerId !== id,
          );

        room.readyPlayers =
          room.readyPlayers.filter(
            playerId =>
              playerId !== id,
          );

        room.snapshot.players =
          room.snapshot.players.filter(
            snapshotPlayer =>
              snapshotPlayer.id !==
              id,
          );

        if (
          room.players.length ===
          0
        ) {
          this.rooms.delete(
            room.id,
          );
        }
      }
    }

    this.players.delete(id);
  }

  getPlayer(
    id: string,
  ): Player | undefined {
    return this.players.get(id);
  }

  getPlayers(): Player[] {
    return Array.from(
      this.players.values(),
    );
  }

  readyPlayer(
    playerId: string,
  ): Room | null {
    const player =
      this.players.get(
        playerId,
      );

    if (
      !player?.roomId
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
  ): boolean {
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
  ): Player | null {
    const player =
      this.players.get(
        playerId,
      );

    const room =
      this.rooms.get(
        roomId,
      );

    if (
      !player ||
      !room
    ) {
      return null;
    }

    if (
      room.status !==
      'waiting'
    ) {
      return null;
    }

    if (
      room.players.length >=
      room.maxPlayers
    ) {
      return null;
    }

    player.roomId =
      roomId;

    if (
      !room.players.includes(
        playerId,
      )
    ) {
      room.players.push(
        playerId,
      );
    }

    const exists =
      room.snapshot.players.some(
        snapshotPlayer =>
          snapshotPlayer.id ===
          playerId,
      );

    if (!exists) {
      room.snapshot.players.push(
        this.toSnapshotPlayer(
          player,
        ),
      );
    }

    return player;
  }

  private toSnapshotPlayer(
    player: Player,
  ) {
    return {
      id:
        player.id,

      x:
        player.x,

      y:
        player.y,

      hp:
        player.hp,

      maxHp:
        100,

      fuel:
        100,

      maxFuel:
        100,

      alive:
        true,

      facing:
        1 as const,
    };
  }
}