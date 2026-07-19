import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  Server,
  Socket,
} from 'socket.io';

import {
  GameService,
} from './game.service';

import {
  CommandExecutorService,
} from './command/command-executor.service';

import type {
  PlayerCommand,
} from './common/types/snapshots';

import type {
  Room,
} from './entities/rooms.entity';

@WebSocketGateway({
  cors: {
    origin:
      '*',
  },
})
export class GameGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  constructor(
    private readonly gameService:
      GameService,

    private readonly commandExecutor:
      CommandExecutorService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(
    client: Socket,
  ): void {
    this.gameService.addPlayer(
      client.id,
    );

    console.log(
      `[CONNECTED] ${client.id}`,
    );
  }

  handleDisconnect(
    client: Socket,
  ): void {
    const player =
      this.gameService.getPlayer(
        client.id,
      );

    const roomId =
      player?.roomId;

    this.gameService.removePlayer(
      client.id,
    );

    if (roomId) {
      this.server
        .to(roomId)
        .emit(
          'playerLeft',
          {
            id:
              client.id,
          },
        );
    }

    console.log(
      `[DISCONNECTED] ${client.id}`,
    );
  }

  @SubscribeMessage(
    'joinRoom',
  )
  handleJoinRoom(
    @MessageBody()
    data: {
      roomId: string;
    },

    @ConnectedSocket()
    client: Socket,
  ): void {
    const player =
      this.gameService.joinRoom(
        client.id,
        data.roomId,
      );

    if (!player) {
      client.emit(
        'commandRejected',
        {
          reason:
            'ROOM_JOIN_FAILED',
        },
      );

      return;
    }

    void client.join(
      data.roomId,
    );

    const room =
      this.gameService.getRoom(
        data.roomId,
      );

    this.server
      .to(data.roomId)
      .emit(
        'playerJoined',
        {
          id:
            player.id,

          x:
            player.x,

          y:
            player.y,
        },
      );

    if (room) {
      this.broadcastSnapshot(
        room,
      );
    }
  }

  @SubscribeMessage(
    'ready',
  )
  handleReady(
    @ConnectedSocket()
    client: Socket,
  ): void {
    const room =
      this.gameService.readyPlayer(
        client.id,
      );

    if (!room) {
      return;
    }

    this.server
      .to(room.id)
      .emit(
        'playerReady',
        {
          playerId:
            client.id,
        },
      );

    const canStart =
      this.gameService.isReadyToStart(
        room.id,
      );

    if (!canStart) {
      return;
    }

    room.status =
      'playing';

    const randomIndex =
      Math.floor(
        Math.random() *
          room.players.length,
      );

    room.snapshot.currentTurn =
      room.players[
        randomIndex
      ];

    room.snapshot.turnAction = {
      moved:
        false,

      attacked:
        false,
    };

  for (const player of room.snapshot.players
  ) {

    player.maxHp ??=
    100;
    player.hp =player.maxHp;
    player.maxFuel ??=100;
    player.fuel =player.maxFuel;

    player.alive =true;
  }

    room.snapshot.version +=
      1;

    this.server
      .to(room.id)
      .emit(
        'gameStart',
        {
          currentTurn:
            room.snapshot.currentTurn,
        },
      );

    this.broadcastSnapshot(
      room,
    );
  }

  @SubscribeMessage(
    'sync',
  )
  handleSync(
    @ConnectedSocket()
    client: Socket,
  ): void {
    const context =
      this.getClientRoom(
        client.id,
      );

    if (!context) {
      client.emit(
        'sync',
        {
          snapshot:
            null,
        },
      );

      return;
    }

    client.emit(
      'sync',
      {
        snapshot:
          context.room.snapshot,
      },
    );
  }

@SubscribeMessage('move')
async handleMove(
  @MessageBody()
  data: {
    direction: -1 | 1;
  },
  @ConnectedSocket()
  client: Socket,
): Promise<void> {
  console.log('[GATEWAY MOVE DATA]', {
    clientId: client.id,
    data,
    direction: data?.direction,
    type: typeof data?.direction,
  });

  await this.executeClientCommand(
    client,
    {
      type: 'MOVE',
      playerId: client.id,
      direction: data.direction,
    },
  );
}

  @SubscribeMessage(
    'attack',
  )
  async handleAttack(
    @MessageBody()
    data: {
      angle: number;
      power: number;
    },

    @ConnectedSocket()
    client: Socket,
  ): Promise<void> {
    await this.executeClientCommand(
      client,
      {
        type:
          'ATTACK',

        playerId:
          client.id,

        angle:
          data.angle,

        power:
          data.power,
      },
    );
  }

  @SubscribeMessage(
    'turnEnd',
  )
  async handleTurnEnd(
    @ConnectedSocket()
    client: Socket,
  ): Promise<void> {
    await this.executeClientCommand(
      client,
      {
        type:
          'END_TURN',

        playerId:
          client.id,
      },
    );
  }

  private async executeClientCommand(
    client: Socket,
    command: PlayerCommand,
  ): Promise<void> {
    const context =
      this.getClientRoom(
        client.id,
      );

    if (!context) {
      client.emit(
        'commandRejected',
        {
          command:
            command.type,

          reason:
            'ROOM_NOT_FOUND',
        },
      );

      return;
    }

    const {
      room,
    } = context;

    try {
      const previousTurn =
        room.snapshot.currentTurn;

      const previousWinner =
        room.snapshot.winner;

      const nextSnapshot =
        await this.commandExecutor
          .execute(
            room,
            command,
          );

      this.broadcastSnapshot(
        room,
      );

      if (
        previousTurn !==
        nextSnapshot.currentTurn
      ) {
        this.server
          .to(room.id)
          .emit(
            'turnChanged',
            {
              playerId:
                nextSnapshot.currentTurn,
            },
          );
      }

      if (
        !previousWinner &&
        nextSnapshot.winner
      ) {
        this.server
          .to(room.id)
          .emit(
            'gameFinished',
            {
              winner:
                nextSnapshot.winner,
            },
          );
      }
    } catch (error) {
      console.error(
        `[COMMAND ERROR] room=${room.id} command=${command.type}`,
        error,
      );

      client.emit(
        'commandRejected',
        {
          command:
            command.type,

          reason:
            'PHYSICS_UNAVAILABLE',
        },
      );
    }
  }

  private getClientRoom(
    clientId: string,
  ): {
    room: Room;
  } | null {
    const player =
      this.gameService.getPlayer(
        clientId,
      );

    if (
      !player?.roomId
    ) {
      return null;
    }

    const room =
      this.gameService.getRoom(
        player.roomId,
      );

    if (!room) {
      return null;
    }

    return {
      room,
    };
  }

  private broadcastSnapshot(
    room: Room,
  ): void {
    this.server
      .to(room.id)
      .emit(
        'snapshot',
        room.snapshot,
      );
  }
}