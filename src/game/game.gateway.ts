import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { GameService } from './game.service';
import { PhysicsService } from 'src/physics/physics.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly physicsService: PhysicsService,
    private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;
handleConnection(client: Socket) {
  this.gameService.addPlayer(client.id);

  console.log(`[CONNECTED] ${client.id}`);
}

handleDisconnect(client: Socket) {
  this.gameService.removePlayer(client.id);
  this.server.emit('playerLeft', {
    id: client.id,
  });
  console.log(`[DISCONNECTED] ${client.id}`);

}
@SubscribeMessage('ready')
handleReady(
  @ConnectedSocket()
  client: Socket,
) {
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

 if (canStart) {
  room.status =
    'playing';

  this.server
    .to(room.id)
    .emit(
      'gameStart',
      {
        currentTurn:
          room.currentTurn,
      },
    );
 }
}

@SubscribeMessage('sync')
handleSync(
  @ConnectedSocket() client: Socket,
) {
  console.log(
    `[SYNC REQUEST] ${client.id}`,
  );

  client.emit('sync', {
    players: this.gameService.getPlayers(),
  });
}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
    '[JOIN ROOM EVENT]',
    client.id,
    data.roomId);

    const player = this.gameService.joinRoom(
      client.id,
      data.roomId,
    );

    if (!player) return;

    client.join(data.roomId);

    console.log(
      `[ROOM JOIN]
       player=${client.id}
       room=${data.roomId}`,
    );

this.server.to(data.roomId).emit('playerJoined', {
  id: client.id,
  x: player.x,
  y: player.y,
});
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() data: { x: number; y: number },
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.gameService.movePlayer(
      client.id,
      data.x,
      data.y,
    );

    if (!player) return;

    if (!player.roomId) return;

    console.log(
      `[MOVE]
       player=${client.id}
       x=${player.x}
       y=${player.y}`,
    );

    this.server.to(player.roomId).emit('playerMoved', {
      id: client.id,
      x: player.x,
      y: player.y,
    });
  }

@SubscribeMessage('attack')
handleAttack(
  @MessageBody()
  data: {
    angle: number;
    power: number;
  },
  @ConnectedSocket()
  client: Socket,
) {
  const player =
    this.gameService.getPlayer(
      client.id,
    );

  if (!player?.roomId) {
    return;
  }

  const room =
    this.gameService.getRoom(
      player.roomId,
    );

  if (!room) {
    return;
  }

  const isMyTurn =
    this.gameService.isMyTurn(
      room.id,
      client.id,
    );

  if (!isMyTurn) {
    console.log(
      `[TURN BLOCK] ${client.id}`,
    );
    return;
  }

  const nextSnapshot =
    this.physicsService.processCommand(
      room.snapshot,
      {
        playerId:
          client.id,
        type: 'ATTACK',
        angle: data.angle,
        power: data.power,
      },
    );

  room.snapshot =
    nextSnapshot;

  console.log(
    `[ATTACK]
     player=${client.id}
     room=${room.id}`,
  );

  this.server
    .to(room.id)
    .emit(
      'snapshot',
      nextSnapshot,
    );

  if (
    nextSnapshot.winner
  ) {
    room.status =
      'finished';

    this.server
      .to(room.id)
      .emit(
        'gameFinished',
        {
          winner:
            nextSnapshot.winner,
        },
      );

    return;
  }

  const nextPlayer =
    this.gameService.nextTurn(
      room.id,
    );

  nextSnapshot.currentTurn =
    nextPlayer;

  this.server
    .to(room.id)
    .emit(
      'turnChanged',
      {
        playerId:
          nextPlayer,
      },
    );
}


@SubscribeMessage('turnEnd')
handleTurnEnd(
  @ConnectedSocket()
  client: Socket,
) {
  const player =
    this.gameService.getPlayer(
      client.id,
    );

  if (
    !player ||
    !player.roomId
  ) {
    return;
  }

  const nextPlayer =
    this.gameService.nextTurn(
      player.roomId,
    );

  console.log(
    `[TURN END]
     current=${client.id}
     next=${nextPlayer}`,
  );

  this.server
    .to(player.roomId)
    .emit(
      'turnChanged',
      {
        playerId:
          nextPlayer,
      },
    );
  }
}